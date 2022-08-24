import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Character } from './character';
import { PartyRequestCommand } from './friend-caller.service';
import { Monster } from './quest.service';

export interface Quest {
  name: string,
  id: number,
  experienceGain: number,
  goldGain: number,
  prerequisites: string[],
  questLevel: number,
  zone: string,
  locations: string[],
  monsters: Monster[]
}

export enum QuestStates {
  START,
  FAIL,
  SUCCESS
}

export class PartyQuestData {

  private registrants: Character[] = []
  
  private status: QuestStates;

  private selectedQuestIndex: number = 0;

  /**
   * Constructor.
   * @param r1
   * @param r2 
   * @param questData : This is all the quests. Must pick a random one here!
   */
  constructor(r1: Character, r2: Character, private questData: Quest[]) {
    this.registrants[0] = r1;
    this.registrants[1] = r2;
    this.status = QuestStates.START;
    this.selectedQuestIndex = Math.floor(Math.random() * (questData.length)); // Math.random's max bound is exclusive, so this is never more than len - 1
  }

  public getRegistrants(): Character[] {
    return this.registrants;
  }

  public log(): string {
    return this.registrants[0] + " and " + this.registrants[1];
  }

  public getActiveQuestName(): string {
    return this.questData[this.selectedQuestIndex].name;
  }

  public getQuestData() {
    return this.questData[this.selectedQuestIndex];
  }

  public getLocations() {
    return this.questData[this.selectedQuestIndex].locations;
  }

  public getMonsters(): Monster[] {
    return this.questData[this.selectedQuestIndex].monsters;
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

  /**
   * Subscribers: quest-idler-component.ts
   * This is emitted at the end of a conversation, with the party request action. 
   * When an party action command is executed.
   */
  partyQuestDataSource = new Subject<PartyQuestData>();
  partyQuestDataSource$: Observable<PartyQuestData> = this.partyQuestDataSource.asObservable();
  
  /**
   * Used to communicate between the collectables and quest party to award loot.
   */
  monsterDeathEventSource = new Subject<any>();
  monsterDeathEventSource$: Observable<any> = this.monsterDeathEventSource.asObservable();

  private actions: PartyRequestCommand[] = [];
  private partyQuestData: PartyQuestData | undefined;
  private apiUrl: string = environment.apiUrl;

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

  /**
   * Invokers: PartyRequestCommand's execute method in the friend-caller-service
   * is reponsible for invoking this method.
   * 
   * This sends along the fetched party quest data to subscribers.
   * 
   * Subscribers: quest-idler-component.ts
   * 
   * @param a 
   * 
   */
  public setupQuestParty(a: PartyRequestCommand) {
    let mQuest: any[] = [];

    this.fetchNewQuestData("/newquest").subscribe({
      next: (questData: any) => {
        if (questData !== null) {
          mQuest = questData;
          console.log(mQuest);
          const conv = a.getConversationSession();
          this.partyQuestData = new PartyQuestData(conv.conversationRequester as Character, conv.conversationTarget as Character, mQuest);
          this.partyQuestDataSource.next(this.partyQuestData);   
        }
      },
      error: (err: Error) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification')      
    });
  }
  
  public fetchNewQuestData(routeName: string) {
    console.log("Fetching new quest data from backend.");
    
    let params = new HttpParams();
    params = params.append('level', 10);
    params = params.append('prereqs', "Tutorial 1");
    params = params.append('prereqs', "Tutorial 2");
    params = params.append('zone', "1-1");
    return this.http.get<any>(this.apiUrl + routeName, {params: params});
  }
}
