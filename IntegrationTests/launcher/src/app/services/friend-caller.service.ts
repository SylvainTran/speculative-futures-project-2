import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Character } from './character';
import { CircularQueue } from './queue';

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

  conversationText: string = "";
  conversationURL: string = "http://127.0.0.1:8080/";
  conversations: ConversationNode[] | undefined;

  constructor(private friendCallerService: FriendCallerService, private requestInteraction: RequestInteraction | null) {
  }

  init() {
    this.pullConversationDataNodes();
    this.parseConversationTextArray();
    this.moveConversationIterator();
    this.displayConversationIteratorNode();
    this.waitOnPlayerInput();
    this.checkConversationStatus();
    this.conversationText = "CONVERSATION RECEIVED";
  }

  pullConversationDataNodes() {
    // pull from client side .tsv
    this.conversations = this.friendCallerService.conversationNodes;
  }

  parseConversationTextArray() {
    const testConv = this.conversations![2];

    const splits = testConv.conversationText
                  .replace('[', '')
                  .replace(']', '');

    let _splits = splits.split("$");
    _splits = _splits.slice(1);

    _splits = _splits.map(text => {
      text = text.replace('.,', '.')  
            .replace('?,', '?')
            .replace('!,', '!')
            .replace('A:', testConv.characterA + ":")
            .replace('B:', testConv.characterB + ":")
            .trimEnd();
      return text;
    });
    console.log(_splits);
    return _splits;
  }

  moveConversationIterator() {
    console.log("Moving conversation iterator to: Index = 0");
  }

  displayConversationIteratorNode() {
    console.log("conversationDataNode[0]: Hey Sylvain, want to party?");
  }

  waitOnPlayerInput() {
    console.log("[YES] [NO]");
  }

  checkConversationStatus() {
    // if end index, end conv through service
    this.friendCallerService.endInteraction();
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
  activeReq: RequestInteraction | null;
  activeConv: ConversationSession | null;

  // Waiters are put here
  waitCapacity: number;
  requestQueue: CircularQueue<RequestInteraction>;

  private friendPrivateMessageSource = new Subject<any>();
  friendPrivateMessageSource$ = this.friendPrivateMessageSource.asObservable();

  // Conversation data pulled from /assets
  conversationDatabaseURL: String;
  assetsPathPrefix: String;
  conversationNodes: ConversationNode[] = [];

  reader = new FileReader();
  tempConversationDb: String = "conversationID	characterA	characterB	friendshipLevel	conversationText\r" +
  "0	Player	TryAgain34	C	[$A: I didn't know you played this game too., $B: Want to do a dungeon together?, $A: Sure.]\r" +
  "1	Player	TryAgain34	B	[$A: Hey, it's you again. Weather's nice isn't it?, $B: It sure is., $A: Yep.]\r" +
  "2	Player	TryAgain34	A	[$A: I've been thinking about you said before., $B: Hey, cool. Actually, maybe now's not the time. Can we do this later?, $A: kk, np. can you do you have the Dining Hall app? I'll pm you later. Add me on Mama Messenger: tryagain34.]\r";

  read(data: String) {
    const lines = this.tempConversationDb.split("\r");

    for(let i = 1; i < lines.length; i++) {
      const cols = lines[i].split("\t");
      const id = parseInt(cols[0]);
      const characterA = cols[1];
      const characterB = cols[2];
      const friendshipLevel = cols[3];
      const textArray = cols[4];
      const conversationNode = new ConversationNode(id, characterA, characterB, friendshipLevel, textArray);
      this.conversationNodes.push(conversationNode);
    }

    console.log(this.conversationNodes);
  }

  constructor() {
    this.activeReq = null;
    this.activeConv = null;
    this.waitCapacity = 100;
    this.requestQueue = new CircularQueue<RequestInteraction>(this.waitCapacity);
    this.conversationDatabaseURL = "languageofflowers_conversation_system_and_db - conversations.tsv";
    this.assetsPathPrefix = "./src/assets/"; //ng serve entry point is integrationtests/launcher folder?
    this.pullConversationDatabase();
  }

  pullConversationDatabase() {
    this.read(this.tempConversationDb);
  }

  requestInteraction(requester: Character, target: Character) {

    if (target === undefined) {
      console.log("Target is undefined");
      return;
    }

    const newReq: RequestInteraction = new RequestInteraction(this, requester, target);
    this.requestQueue.enqueue(newReq);

    if (this.activeReq === null) {
      console.log("New active request set");
      this.updateRequestQueue();
    } else {
      console.log("Active request exists already - waiting in queue");
    }
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
