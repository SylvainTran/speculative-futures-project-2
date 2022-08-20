import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class GameEventObject {
  
  constructor(
    private key: string,                      // when a successful data-submit request is done, the subject fires this key - listeners receive it and accesses this game event object by that key, then do what they need to do with the response
    private success: boolean,
    private response: string[],               // when talker alternates with subject - list of indexes when this occurs in order to fake timeouts / delay responses between two actors
    private timeStamp?: string,
    private callbacks?: Function[],
    private callerObject?: Object,
    private args?: any[])
  {}

  get Key() {
    return this.key;
  }

  get Success() {
    return this.success;
  }

  get Response() {
    return this.response;
  }

  get TimeStamp() {
    return this.timeStamp;
  }

  get Callbacks() {
    return this.callbacks;
  }

  set Key(val) {
    this.key = val;
  }

  set Success(val) {
    this.success = val;
  }

  set Response(val) {
    this.response = val;
  }

  set TimeStamp(val) {
    this.timeStamp = val;
  }

  set Callbacks(val) {
    this.callbacks = val;
  }

  public applyCallbacks() {
    this.Callbacks?.forEach(callback => callback.call(this.callerObject, this.args))
  }
} // TODO: specialize into SMSGameEventObject

@Injectable({
  providedIn: 'root'
})
export class MainQuestService {

  // flags
  progressionHashMap: Map<String, GameEventObject>;
  // Events
  questEventSuccessSource = new Subject<string>();
  questEventSuccessSource$: Observable<string> = this.questEventSuccessSource.asObservable();

  constructor() { 
    this.progressionHashMap = new Map<String, GameEventObject>();
    this.progressionHashMap.set("neptunia", 
      new GameEventObject("neptunia", 
                          false, 
                          ["Autumn: I know what you're doing on my phone.", "Autumn: You're John Cyfer, am I correct?@waitReply", "John: Are you really the Queen?", "Autumn: Yes.@waitReply", "John: Where are you now?", "Autumn: I cannot say."], 
                          "Tue, July 18th, 19:35:09, 2111", 
                          [this.log], 
                          this, 
                          ["Player has progressed in the game!"]
                        ));
  }

  public log() {}
}
