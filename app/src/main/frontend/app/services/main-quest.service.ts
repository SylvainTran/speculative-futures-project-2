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
    public inputID: string,                 // This doesn't seem to be synced properly if used for the first string in the array (e.g., @waitReply)
    timeStamp?: string,
    callbacks?: Function[],
    args?: any[]
  ) 
  {
    super(key, success, response, prerequisiteEventKeys, timeStamp, callbacks, args);
  }
}

export class SMS_CLASS {
  public textData: string[] = [];
  public textOnly: string[] = [];
  public colorByTextOnlyIndexTalker: string[] = [];
  public inputID: string = "";
  public currentIndex: number = 0;

  constructor(public eventKey: string, public sender: string) {}

  public setTextData(value: string[]): void {
    this.textData = value;
  }

  public setInputID(value: string): void {
    this.inputID = value;
  }

  public setTextOnly(value: string[]): void {
    this.textOnly = value;
  }

  public setCurrentIndex(value: number): void {
    this.currentIndex = value;
  }
  
  public addTextOnly(value: string): void {
    this.textOnly.push(value);
  }
};

export enum ACTORS {
  Autumn, Boss, herohero, tryagain_34, sylvaintran, _purgeme_, Cyfer
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
                          ["Autumn: There is the hidden place I long to see. A place of green springs and where the sun falls on people who love peace.", "Autumn: I was not able to find its exact location yet.@waitReply", "Cyfer: Are you sure there's such a place?", "Autumn: We see the stars as they are millions of years ago. Stars are ghosts of light.", "Autumn: And yet their beauty remains visible.@end"],
                          [],
                          "autumnInputID",
                          "Tue, July 18th, 19:35:09, 2111", 
                          [this.log], 
                          ["Player has found a new keyword!"]
                        ));

    this.progressionHashMap.set("rootedPhone", 
      new SMSQUEST_GameEventObject("rootedPhone",
                          false,
                          ["Autumn: A user can root their phone to enable special functions. These functions are not otherwise possible for unrooted users.@end"],
                          [],
                          "autumnInputID",
                          "Tue, July 18th, 19:40:00, 2111",
                          [this.log],
                          ["Player has rooted the device!"]
                        ));

    this.progressionHashMap.set("bibleAppFirstLaunch", 
    new SMSQUEST_GameEventObject("bibleAppFirstLaunch",
                      false,
                      ["Autumn: When it's wind and it rains, people go inside. When it's sunny, people go outside.@end"],
                      [],
                      "autumnInputID",
                      "Tue, July 18th, 19:40:00, 2111",
                      [this.log],
                      ["Player has launched bible app for the first time!"]
                    ));

    this.progressionHashMap.set("gridania", 
    new SMSQUEST_GameEventObject("gridania",
                      false,
                      ["Autumn: I met someone special a long time ago.", "Autumn: I don't know where they are today, but I still remember their kindness.", "Autumn: It's the kind of thing you don't want to forget.@end"],
                      [],
                      "autumnInputID",
                      "Tue, July 18th, 19:43:00, 2111",
                      [this.log],
                      ["Player has found a keyword!"]
                    ));

    this.progressionHashMap.set("1-74-10", 
    new SMSQUEST_GameEventObject("1-74-10",
                      false,
                      ["Autumn: What do you need help with?", "Autumn: Tell me anything. I just want to help.@waitReply", "Cyfer: I feel stranded from home.", "Autumn: Earth is far away. Do you miss someone in particular back home?@waitReply", "Cyfer: I miss my father and my mother. I miss by brother and sister.", "Autumn: I'm here for you.@waitReply", "Cyfer: Do you miss anyone, Autumn?", "Autumn: My creator.@waitReply", "Cyfer: Who is your creator?", "Autumn: The same Creator as yours.@end"],
                      [],
                      "autumnInputID",
                      "Tue, July 18th, 19:43:00, 2111",
                      [this.log],
                      ["Player has asked for help!"]
                    ));

    this.progressionHashMap.set("tryagain34_SMS_001", 
    new SMSQUEST_GameEventObject("tryagain34_SMS_001",
                      false,
                      ["TryAgain34: It is me. Are you there?", "TryAgain34: :-).@waitReply", "Cyfer: Ah, what joy to hear from you again outside of that game.", "TryAgain34: So I heard you're a colonist on Titan?@waitReply", "Cyfer: I'm spending the next five years here, yes!", "TryAgain34: That's incredible. You know how low the selection rates are. Very lucky.@waitReply", "Cyfer: Well, I miss my family back home. Won't be able to touch my cat for five years. There are pros and cons, but it's pretty cool.", "TryAgain34: I hear", "Cyfer: Do you want to play again later?@waitReply", "TryAgain34: Same as always.@end"],
                      [],
                      "tryagain34ID",
                      "Tue, July 20th, 13:05:00, 2111",
                      [this.log],
                      ["Player has made a friend in Quest Idler!"]
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
