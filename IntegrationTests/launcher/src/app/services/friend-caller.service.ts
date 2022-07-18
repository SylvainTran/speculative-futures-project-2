import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Character } from './character';
import { CircularQueue } from './queue';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

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

// Test quest fetch API
export interface Monster {
  name: string;
  race: string;
  hp: number;
  expGain: number;
  level: number;
  stamina: number;
  zone: string;
}

export class ConversationSession {

  conversationText: string = "";
  conversationURL: string = "http://127.0.0.1:8080/";
  conversations: Monster[] | undefined;

  constructor(private http: HttpClient, private friendCallerService: FriendCallerService, private requestInteraction: RequestInteraction | null) {
  }

  init() {
    this.pullConversationDataNodes();
    this.moveConversationIterator();
    this.displayConversationIteratorNode();
    this.waitOnPlayerInput();
    this.checkConversationStatus();
    this.conversationText = "CONVERSATION RECEIVED";
  }

  pullConversationDataNodes() {

    // const httpOptions = {
   	//  	headers: new HttpHeaders()
	  // }
    // httpOptions.headers.append('Access-Control-Allow-Origin', '*');
    // httpOptions.headers.append('Content-Type', 'application/json');
    // httpOptions.headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    // fetch json from server endpoint
    console.log("[ConversationSession]: Pulling conversation data nodes from server endpoint.");
    this.http.get<Monster[]>(this.conversationURL + "newquest?level=1").subscribe( (data: Monster[]) => {
      this.conversations = {...data};
      console.log(this.conversations);
    });
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

  constructor(private http: HttpClient) {
    this.activeReq = null;
    this.activeConv = null;
    this.waitCapacity = 100;
    this.requestQueue = new CircularQueue<RequestInteraction>(this.waitCapacity);
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
    this.activeConv = new ConversationSession(this.http, this, this.activeReq);
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
