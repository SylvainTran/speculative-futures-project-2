import { Injectable } from '@angular/core';
import { Observable, Subject, timestamp } from 'rxjs';
import { SaveDataService } from './save-data-service';

export abstract class GameEventObject {
  
  constructor(
    public key: string,                      // when a successful data-submit request is done, the subject fires this key - listeners receive it and accesses this game event object by that key, then do what they need to do with the response
    public success: boolean,
    public response: string[],               // when talker alternates with subject - list of indexes when this occurs in order to fake timeouts / delay responses between two actors
    public prerequisiteEventKeys: string[],
    public timeStamp?: string,
    public callbacks?: Function[],
    public args?: any[])
  {}

  // prerequisitesAreSatisfied
  //
  // Used to make sure the user can't run a game event unless all prerequisites are met
  public prerequisitesAreSatisfied(values: string[]): boolean {
    if (this.prerequisiteEventKeys.length === 0) {
      return true;
    } else {
      return this.prerequisiteEventKeys.every( (key) => values.includes(key) );
    }
  }

  public applyCallbacks() {
    this.callbacks?.forEach(callback => callback.call(this, this.args))
  }
}

export class SMSQUEST_GameEventObject extends GameEventObject {

  constructor(
    key: string,
    success: boolean,
    response: string[],
    prerequisiteEventKeys: string[],
    timeStamp?: string,
    callbacks?: Function[],
    args?: any[],
  ) 
  {
    super(key, success, response, prerequisiteEventKeys, timeStamp, callbacks, args);
  }
}

@Injectable({
  providedIn: 'root'
})
export class MainQuestService {

  // flags
  progressionHashMap: Map<String, GameEventObject>;
  // Events
  TRIGGER_SMS_EVENT = new Subject<string>();
  TRIGGER_SMS_EVENT$: Observable<string> = this.TRIGGER_SMS_EVENT.asObservable();

  constructor(
    public saveDataService: SaveDataService
  ) { 
    this.progressionHashMap = new Map<String, GameEventObject>();
    this.progressionHashMap.set("neptunia", 
      new SMSQUEST_GameEventObject("neptunia", 
                          false, 
                          ["Sixth3489: Ask, and it will be given to you; seek, and you will find; knock, and the door will be opened to you.", "Sixth3489: Are you having fun on that account?@waitReply", "Autumn: Hey... long time no talk. I haven't used this account in a while", "Sixth3489: You can stop pretending. I know who you are.@waitReply", "Autumn: Okay, so who am I?", "Sixth3489: John Cyfer. You work for the NSA.", "Sixth3489: I have the information that you seek. But you'll have to do what I say first.@waitReply", "Autumn: Why should I trust you?", "Sixth3489: I know how long you've been trying. You're in the dark. So take a chance.@cutLiveConnection&waitReply", "Autumn: How did you do that?", "Sixth3489: I know that device well. Go to the Settings app, and enable dev mode. Then root the phone. After that, activate the VPN app. We'll talk again once you do that.@end"], 
                          [],
                          "Tue, July 18th, 19:35:09, 2111", 
                          [this.log], 
                          ["Player has progressed in the game!"]
                        ));

    this.progressionHashMap.set("rootedPhone", 
      new SMSQUEST_GameEventObject("rootedPhone",
                          false,
                          ["Sixth3489: Thank you for trusting me.", "Your faith will be rewarded.@end"],
                          ["neptunia"],
                          "Tue, July 18th, 19:40:00, 2111",
                          [this.log],
                          ["Player has rooted the device!"]
                        ));

    this.loadCompletedSMSEvents();
  }

  public log() {}

  public getSMSEventsCompleted(): string[] {
    let completed: string[] = [];

    let gameEventObjects = this.progressionHashMap.values();

    for (const gameEventObject of gameEventObjects) {
      if (gameEventObject.success) {
        completed.push(gameEventObject.key);
      }
    }
    return completed;
  }

  public saveCompletedSMSEvents() {
    this.saveDataService.saveCompletedSMSEvents(this.progressionHashMap);
  }

  public loadCompletedSMSEvents() {
    let results: any = this.saveDataService.loadCompletedSMSEvents();

    if (results) {
      this.progressionHashMap = results;
    }
  }
}
