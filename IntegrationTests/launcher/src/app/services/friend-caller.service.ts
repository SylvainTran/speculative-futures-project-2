import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Character } from './character';
import { CircularQueue } from './queue';
import { Friendship, FriendshipLevels } from './friendship';

// This is the beginning of a social AI system, or social artificial intelligence heuristics/pragmatics
// Tailored specifically for this game.
export class RequestInteraction {

  // This flags sets the interaction as ready to proceed
  ready: boolean = false;
  readyCheckDelay: number = 10; // in seconds
  checkIntervalTimer: any = null;
  requester!: Character;
  target!: Character;

  constructor(private friendCallerService: FriendCallerService, 
              requester: Character, 
              target: Character) {
    
    console.log("Target: " + target.name + ", " + target.isBusy);
    this.requester = requester;
    this.target = target;
  }

  checkTargetIsBusy() {
    return !this.target.isBusy; // a character is busy if they are talking to somebody else or offline
  }

  setIsBusy(busy: boolean) {
    this.requester.isBusy = busy;
    this.target.isBusy = busy;
    this.ready = busy;

    console.log(this.requester.isBusy);
    console.log(this.target.isBusy);
    console.log(this.ready);
  }

  initiateRequest() {
    this.ready = this.checkTargetIsBusy();
    console.log("This.ready: " + this.ready);

    if (this.ready) {
      // proceed
      window.clearInterval(this.checkIntervalTimer);
      this.setIsBusy(true);
      this.friendCallerService.startInteraction();

    } else {
      if (this.checkIntervalTimer === null) {
        this.checkIntervalTimer = window.setInterval(() => {this.checkTargetIsBusy(); this.initiateRequest();}, 1000 * this.readyCheckDelay);
      }
      // Log failed attempt to interact. This is good to know (hopefully it makes the player feel bad?)
      this.log();
    }
  }

  log() {
    console.log("logging request to file");
  }  
}

export class ConversationSession {

  conversationTexts: string[] = []; // 
  conversationTargetName: string = "";
  // conversationURL: string = "http://127.0.0.1:8080/";
  conversations: ConversationNode[] | undefined;
  conversationEndIndex: number = 0;
  friendshipLevel: FriendshipLevels | any;
  maxFriendshipLevel: number = 3;

  constructor(private friendCallerService: FriendCallerService, private requestInteraction: RequestInteraction) {
  }

  init() {
    this.getFriendshipLevel();
    this.pullConversationDataNodes();
    this.parseConversationTextArray();
    // this.displayConversationIteratorNode();
    // this.waitOnPlayerInput();
    this.endConversation();
  }

  getFriendshipLevel() {
    this.conversationTargetName = this.requestInteraction.target.name;

    if(this.requestInteraction.requester.friendsMap.has(this.conversationTargetName)) {
      let f: Friendship | undefined = this.requestInteraction.requester.friendsMap.get(this.conversationTargetName);
      this.friendshipLevel = f!.friendshipLevel;
    } else {
      console.log("Friends map never initialized.")
    }

    console.log("FRIENDSHIP LEVEL : " + this.friendshipLevel);
  }

  pullConversationDataNodes() {
    // pull from client side .tsv
    // this.conversations = this.friendCallerService.conversationNodes;
    this.conversations = this.friendCallerService.getInteractionFriendshipConversationTexts(this.requestInteraction.requester, this.requestInteraction.target, this.friendshipLevel);
    console.log("this conversations: " + this.conversations.length);
    console.log(this.conversations);

    if(this.conversations.length === 0 || this.conversations === null || this.conversations === undefined) {
      console.log("No conversations found - ending conversation session.");
      this.endConversation();
    }
  }

  // The conversation index is the friendship level
  parseConversationTextArray() {
    const requestedConversation = this.conversations![0];
    const splits = requestedConversation.conversationText
                  .replace('[', '')
                  .replace(']', '');

    let _splits = splits.split("$");
    _splits = _splits.slice(1);

    _splits = _splits.map(text => {
      text = text.replace('.,', '.')  
            .replace('?,', '?')
            .replace('!,', '!')
            .replace('A:', requestedConversation.characterA + ":")
            .replace('B:', requestedConversation.characterB + ":")
            .trimEnd();
      console.log("TEXT: " + text);
      ++this.conversationEndIndex; // this refers to count of replies in this conv
      return text;
    });

    this.conversationTexts = _splits;
    return this.conversationTexts;
  }

  displayConversationIteratorNode() {
    console.log("conversationDataNode[0]: Hey Sylvain, want to party?");
  }

  waitOnPlayerInput() {
    console.log("[YES] [NO]");
  }

  endConversation() {
    this.increaseFriendshipLevel();
    this.friendCallerService.endInteraction();
  }

  increaseFriendshipLevel() {
    let f: Friendship | undefined = this.requestInteraction.requester.friendsMap.get(this.conversationTargetName);
    if (f!.friendshipLevel < this.maxFriendshipLevel) {
      f!.increaseFriendshipLevel();
    }
  }
}

export class ConversationNode {
  conversationID: number = 0;
  characterA: string = "";
  characterB: string = "";
  friendshipLevel: string = "";
  conversationText: string = "";

  constructor(conversationID: number, characterA: string, characterB: string, friendshipLevel: string, conversationText: string) {
    this.conversationID = conversationID;
    this.characterA = characterA;
    this.characterB = characterB;
    this.friendshipLevel = friendshipLevel;
    this.conversationText = conversationText;
  }
}

@Injectable({
  providedIn: 'root'
})
export class FriendCallerService {

  // There shouldn't be more than one active request at all times
  activeReq: RequestInteraction | any;
  activeConv: ConversationSession | null;

  // Waiters are put here
  waitCapacity: number;
  requestQueue: CircularQueue<RequestInteraction>;

  private friendPrivateMessageSource = new Subject<any>();
  friendPrivateMessageSource$ = this.friendPrivateMessageSource.asObservable();

  // Conversation data pulled from /assets
  conversationDatabaseURL: string;
  assetsPathPrefix: String;
  conversationNodes: ConversationNode[] = [];
  
  constructor() {
    this.activeReq = null;
    this.activeConv = null;
    this.waitCapacity = 100;
    this.requestQueue = new CircularQueue<RequestInteraction>(this.waitCapacity);
    this.conversationDatabaseURL = "languageofflowers_conversation_system_and_db - conversations.tsv";
    this.assetsPathPrefix = "../../assets/"; //ng serve entry point is integrationtests/launcher folder?
    this.pullConversationDatabase();
  }

  read(conversationDatabaseURL: string) {
    // REVIEW: not sure if the fetch api for local files will work later on when the game is hosted remotely? Used this because there's a breaking issue with the File Reader node class from 'fs' needing a polyfill currently.
    let lines;    
    fetch(conversationDatabaseURL, {mode: 'no-cors'})
      .then(response => response.text())
      .then(data=> {
        lines = data; 
        const rows = lines.split("\r");
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i].split("\t");
          const id = parseInt(cols[0]);
          const characterA = cols[1];
          const characterB = cols[2];
          const friendshipLevel = cols[3];
          const textArray = cols[4];
          const conversationNode = new ConversationNode(id, characterA, characterB, friendshipLevel, textArray);
          this.conversationNodes.push(conversationNode);
        }
        console.log(this.conversationNodes);
      })
      .catch(error => console.error(error));
  }

  pullConversationDatabase() {
    this.read(this.assetsPathPrefix + this.conversationDatabaseURL);
  }

  requestInteraction(requester: Character, target: Character) {

    const newReq: RequestInteraction = new RequestInteraction(this, requester, target);
    this.requestQueue.enqueue(newReq);

    if (this.activeReq === null) {
      console.log("New active request set");
      this.updateRequestQueue();
    } else {
      console.log("Active request exists already - waiting in queue");
    }
    // TODO: Must handle cases where no convo exists between chars - do this before init request
    newReq.initiateRequest(); // REVIEW: Initiate here?    
  }

  updateRequestQueue() {
    this.activeReq = this.requestQueue.dequeue(); // get the next in queue
  }

  startInteraction() {
    this.activeConv = new ConversationSession(this, this.activeReq);
    this.activeConv.init(); // Note: init from outside, unwinding problem
    this.friendPrivateMessageSource.next(this.activeConv);
  }

  getInteractionFriendshipConversationTexts(c1: Character, c2: Character, fl: number) {

    let ret = this.conversationNodes.filter(conversation => {
      let eqn = (conversation.characterA === c1.name && conversation.characterB === c2.name) || 
      (conversation.characterA === c2.name && conversation.characterB === c1.name);
      let feq = FriendshipLevels[fl] === conversation.friendshipLevel;

      return eqn && feq;
    });
    return ret;
  }

  endInteraction() {
    this.activeReq!.setIsBusy(false); // REVIEW: Should this be guaranteed !?
    this.activeReq = null;
  }

  bookNewEvent(activeRequestInteraction: RequestInteraction) {
    // the two characters agree on meeting again in a different app or in the same app, 
    // at some point in the future
  }

  cancelEvent(requestInteraction: RequestInteraction) {

  }
}
