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

export class SMS_CLASS {
  constructor(public eventKey: string, public sender: ACTORS) {}
};

export enum ACTORS {
  QUEEN, BOSS
}

@Injectable({
  providedIn: 'root'
})
export class MainQuestService {

  // flags
  progressionHashMap: Map<String, GameEventObject>;
  // Events
  TRIGGER_SMS_EVENT = new Subject<SMS_CLASS>();
  TRIGGER_SMS_EVENT$: Observable<SMS_CLASS> = this.TRIGGER_SMS_EVENT.asObservable();

  constructor(
    public saveDataService: SaveDataService
  ) { 
    this.progressionHashMap = new Map<String, GameEventObject>();
    this.progressionHashMap.set("neptunia", 
      new SMSQUEST_GameEventObject("neptunia", 
                          false, 
                          ["Autumn: I want to go there. A place of green springs and where the sun falls on people who love peace.", "Autumn: There is a place hidden that people call Neptunia. I was not able to find the exact location yet.@waitReply", "YOU: Maybe the place isn't meant to be discovered.", "Autumn: That's a good observation. I believe certain things... are meant to be secrets.", "Autumn: But we shouldn't stop looking for that place. It is there, somewhere. Don't you agree?@end"],
                          [],
                          "Tue, July 18th, 19:35:09, 2111", 
                          [this.log], 
                          ["Player has progressed in the game!"]
                        ));

    this.progressionHashMap.set("rootedPhone", 
      new SMSQUEST_GameEventObject("rootedPhone",
                          false,
                          ["Autumn: A user can root their phone to enable special functions. These functions are not otherwise possible for unrooted users."],
                          [],
                          "Tue, July 18th, 19:40:00, 2111",
                          [this.log],
                          ["Player has rooted the device!"]
                        ));

    this.progressionHashMap.set("bibleAppFirstLaunch", 
    new SMSQUEST_GameEventObject("bibleAppFirstLaunch",
                      false,
                      ["Autumn: When it's wind and it rains, people go inside. When it's sunny, people go outside."],
                      [],
                      "Tue, July 18th, 19:40:00, 2111",
                      [this.log],
                      ["Player has rooted the device!"]
                    ));

    this.progressionHashMap.set("gridania", 
    new SMSQUEST_GameEventObject("gridania",
                      false,
                      ["Autumn: I met someone special a long time ago.", "Autumn: I don't know where they are today, but I still remember their kindness.", "Autumn: It's the kind of thing you don't want to forget."],
                      [],
                      "Tue, July 18th, 19:43:00, 2111",
                      [this.log],
                      ["Player has rooted the device!"]
                    ));
    //this.loadCompletedSMSEvents();
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
