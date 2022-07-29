import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Character } from './character';
import { CircularQueue } from './queue';
import { Friendship, FriendshipLevels } from './friendship';
import { QuestPartyService } from './quest-party.service';
import { CharacterDatabaseService } from './character-database.service';

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

  checkCharactersAreBusy() {
    return !this.requester.isBusy && !this.target.isBusy; // a character is busy if they are talking to somebody else or offline
  }

  setIsBusy(busy: boolean) {
    this.requester.isBusy = busy;
    this.target.isBusy = busy;

    console.log(this.requester.isBusy);
    console.log(this.target.isBusy);
  }

  initiateRequest() {
    this.ready = this.checkCharactersAreBusy();
    console.log("This.ready: " + this.ready);

    if (this.ready) {
      // proceed
      this.setIsBusy(true);
      this.ready = false;
      console.log("This.ready now: " + this.ready);
      this.friendCallerService.startInteraction(this);

    } else {
      this.log();
      this.friendCallerService.friendPrivateMessageFailureSource.next(null);
    }
  }

  log() {
    console.log("logging request to file");
  }  
}

export enum ActionCommands {
  DO_NOTHING,
  CHAT_HOMES_MEETUP,
  QUEST_IDLER_PARTY_REQUEST,
  MESSAGE_CENTER_CORRESPONDENCE
}

export class ConversationSession {

  conversationTexts: string[] = [];
  conversationRequesterName: string = ""; 
  conversationTargetName: string = "";
  // conversationURL: string = "http://127.0.0.1:8080/";
  conversations: ConversationNode[] | undefined;
  conversationEndIndex: number = 0;
  friendshipLevel: FriendshipLevels | any;
  maxFriendshipLevel: number = 3;
  conversationActions: number[] = [];

  constructor(private friendCallerService: FriendCallerService, private requestInteraction: RequestInteraction, private questPartyService: QuestPartyService) {
    this.conversationRequesterName = requestInteraction.requester.name;
  }

  init() {
    this.getFriendshipLevel();
    this.pullConversationDataNodes();
    this.pullActions();
    this.parseConversationTextArray();
    // this.displayConversationIteratorNode();
    // this.waitOnPlayerInput();
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
    this.conversations = this.friendCallerService.getInteractionFriendshipConversationTexts(this.requestInteraction.requester, this.requestInteraction.target, this.friendshipLevel);
    console.log("this conversations: " + this.conversations.length);
    console.log(this.conversations);

    if(this.conversations.length === 0 || this.conversations === null || this.conversations === undefined) {
      console.log("No conversations found - ending conversation session.");
      this.friendCallerService.endInteraction(this.requestInteraction);
    }
  }

  pullActions() {
    const conversation = this.conversations![0];
    const actionsText = conversation.actionsText;
    const splits = actionsText
                    .replace('[', '')
                    .replace(']', '')      
                    .split(",");
    const actions: number[] = [];

    splits.forEach( split => {
      const parsed = parseInt(split);
      if (isNaN(parsed)) {
        console.error("action parsed is NaN!");
      } else {
        actions.push(parsed);
      }
    });
    this.conversationActions = actions;
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
    this.friendCallerService.endInteraction(this.requestInteraction);
  }

  increaseFriendshipLevel() {
    let f: Friendship | undefined = this.requestInteraction.requester.friendsMap.get(this.conversationTargetName);
    if (f!.friendshipLevel < this.maxFriendshipLevel) {
      f!.increaseFriendshipLevel();
    }
  }

  applyActions() {    
    this.conversationActions.forEach( action => {
      if (action === ActionCommands.QUEST_IDLER_PARTY_REQUEST) {
        const party = new PartyRequestCommand(this.friendCallerService, this.questPartyService, this);
        // TODO: for later - party.execute();
        this.questPartyService.setupQuestParty(party);
      }
    });
  }
}

export abstract class ActionCommand {
  constructor(private friendCallerService: FriendCallerService) {}  
  abstract execute(): void;
}

export class PartyRequestCommand extends ActionCommand {
  constructor(friendCallerService: FriendCallerService, private questPartyService: QuestPartyService, private conversationSession: ConversationSession) {
    super(friendCallerService);
  }

  override execute(): void {
    // Sets the data in the questPartyService
    // This data is pulled and consumed by avatar party display component in its init routine
    this.questPartyService.setupQuestParty(this);
  }

  public getConversationSession() {
    return this.conversationSession;
  }
}

export class ConversationNode {
  conversationID: number = 0;
  characterA: string = "";
  characterB: string = "";
  friendshipLevel: string = "";
  conversationText: string = "";
  actionsText: string = "";

  constructor(conversationID: number, characterA: string, characterB: string, friendshipLevel: string, conversationText: string, actionsText: string) {
    this.conversationID = conversationID;
    this.characterA = characterA;
    this.characterB = characterB;
    this.friendshipLevel = friendshipLevel;
    this.conversationText = conversationText;
    this.actionsText = actionsText;
  }
}

@Injectable({
  providedIn: 'root'
})
export class FriendCallerService {

  // There shouldn't be more than one active conversation at all times (for now)
  activeConv: ConversationSession | null;
  //convHistory: any;

  // Waiters are put here
  waitCapacity: number;
  requestQueue: CircularQueue<RequestInteraction>;

  public friendPrivateMessageSuccessSource = new Subject<any>();
  friendPrivateMessageSuccessSource$ = this.friendPrivateMessageSuccessSource.asObservable();
  public friendPrivateMessageFailureSource = new Subject<any>();
  friendPrivateMessageFailureSource$ = this.friendPrivateMessageFailureSource.asObservable();
  
  constructor(private questPartyService: QuestPartyService, private characterDatabaseService: CharacterDatabaseService) {
    this.activeConv = null;
    this.waitCapacity = 100;
    this.requestQueue = new CircularQueue<RequestInteraction>(this.waitCapacity);
  }

  public getQuestPartyService() {
    return this.questPartyService;
  }

  requestInteraction(requester: Character, target: Character) {

    const newReq: RequestInteraction = new RequestInteraction(this, requester, target);
    
    // Add to request queue once. 
    if (!this.requestQueue.contains(newReq)) {
      this.requestQueue.enqueue(newReq);
    } else {
      // then was requested before. TOOD: decide randomly if should take the request now
      // Right now everything passes and starts a conversation or logs the missed opportunity
    }

    // This may bounce off if the chars are busy, in that case it just logs the event which could be useful for the ai later
    newReq.initiateRequest(); // REVIEW: Initiate here?    
  }

  startInteraction(request: RequestInteraction) {
    // Remove from queue
    this.requestQueue.dequeue();
    this.activeConv = new ConversationSession(this, request, this.questPartyService);
    this.activeConv.init(); // Note: init from outside, unwinding problem
    // Notify friend detail of success and update displays
    this.friendPrivateMessageSuccessSource.next(this.activeConv);
  }

  getInteractionFriendshipConversationTexts(c1: Character, c2: Character, fl: number) {

    let ret = this.characterDatabaseService.conversationNodes.filter(conversation => {
      let eqn = (conversation.characterA === c1.name && conversation.characterB === c2.name) || 
      (conversation.characterA === c2.name && conversation.characterB === c1.name);
      let feq = FriendshipLevels[fl] === conversation.friendshipLevel;

      return eqn && feq;
    });
    return ret;
  }

  endInteraction(request: RequestInteraction) {
    request.setIsBusy(false); // REVIEW: Should this be guaranteed !?
    request.ready = true;
  }

  bookNewEvent(activeRequestInteraction: RequestInteraction) {
    // the two characters agree on meeting again in a different app or in the same app, 
    // at some point in the future
  }

  cancelEvent(requestInteraction: RequestInteraction) {

  }

  executeCommand(c: ActionCommand) {
    c.execute();
  }
}
