import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Character } from './character';
import { PartyRequestCommand } from './friend-caller.service';

export interface Quest {
  name: string,
  id: number,
  experienceGain: number,
  goldGain: number,
  prerequisites: string[],
  questLevel: number,
  zone: string
}

export enum QuestStates {
  START,
  FAIL,
  SUCCESS
}

// 1. bard declares state of party's quest
// 2. describes location, threats, current hero's actions
// 3. the bard's declarations contextualize the meaning of the idle clicker
// 4. the clicker's display / avatar can be a semantic verb / collected from the hero's quests and stats
// 4.1 clicking "focuses/applies/accents" the verbs -> multiple choices?
// 5. the quest has sub milestones - locations change the background picture dynamically
// 6. you progress / collect stats and poem verbs for future clicks
// 7. progress location -> 1-1, 1/3 ... troll cave
// 8. quests reflect the poem's structure/stanzas
// 9. the verb may dynamically affect the poems/nuances/context?
// pulverize pulverize pulverize pulverize pulverize pulverize pulverize
// light light light love reflect reflect love light pulverize

// User sees own created poem at the end result
// computer picks semi-intelligently for the party friend, juxtaposes/puts alnogside your
// entry and the friends' entry (collaborative poetry)
// ... the poem mash combo window shows a string stream of clicked verbs, then stops when the relation prompt appears
// the computer friend AI interjects their own verbs in that continuous stream

// some characters are more interested in the "fantasy quest generator"
// others in the "hangout in a pixel destination app"
// the fantasy app's quest content language and verbs have to do with fighting / overcoming
// the hangout app is about socialization / human processes
// the available verbs to connect differ between these two apps

export class PartyQuestData {

  private registrants: Character[] = []
  
  private status: QuestStates;

  constructor(r1: Character, r2: Character, private questData: Quest[]) {
    this.registrants[0] = r1;
    this.registrants[1] = r2;
    this.status = QuestStates.START;
  }

  public getRegistrants(): Character[] {
    return this.registrants;
  }

  public log(): string {
    return this.registrants[0] + " and " + this.registrants[1];
  }

  public getActiveQuestName(questIteratorIndex: number): string {
    return this.questData[questIteratorIndex].name;
  }

  public getQuestData(questIteratorIndex: number) {
    return this.questData[questIteratorIndex];
  }

  public get QuestStatus() {
    return this.status;
  }

  public set SetQuestStatus(value: QuestStates) {
    this.status = value;
  }
}

@Injectable({
  providedIn: 'root'
})
export class QuestPartyService {

  partyQuestDataSource = new Subject<PartyQuestData>();
  partyQuestDataSource$: Observable<PartyQuestData> = this.partyQuestDataSource.asObservable();
  
  private actions: PartyRequestCommand[] = [];
  private partyQuestData: PartyQuestData | undefined;

  constructor(private http: HttpClient) {}

  public getPartyQuestData() {
    return this.partyQuestData;
  }

  public addJob(a: PartyRequestCommand) {
    this.actions.push(a);
  }

  public getActions() {
    return this.actions;
  }

  public setupQuestParty(a: PartyRequestCommand) {
    let mQuest: any[] = [];

    const obs = {
      next: (questData: any) => {
        if (questData !== null) {
          mQuest = questData;
          console.log(mQuest);
          const conv = a.getConversationSession();
          this.partyQuestData = new PartyQuestData(conv.conversationRequester as Character, conv.conversationTarget as Character, mQuest);
          this.partyQuestDataSource.next(this.partyQuestData);   
        }
      }
    };
    this.fetchNewQuestData().subscribe(obs);
  }
  
  public fetchNewQuestData() {
    console.log("Fetching new quest data from backend.");
    return this.http.get<any>("http://127.0.0.1:8080/newquest");
  }
}
