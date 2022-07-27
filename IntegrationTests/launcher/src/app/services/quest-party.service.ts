import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PartyRequestCommand } from './friend-caller.service';

export class PartyQuestData {

  private registrants: String[] = [];

  constructor(r1: string, r2: string, private activeQuestName: string) {
    this.registrants[0] = r1;
    this.registrants[1] = r2;
  }

  public getRegistrants(): String[] {
    return this.registrants;
  }

  public log(): string {
    return this.registrants[0] + " and " + this.registrants[1];
  }

  public getActiveQuestName(): string {
    return this.activeQuestName;
  }
}

@Injectable({
  providedIn: 'root'
})
export class QuestPartyService {

  partyQuestDataSource = new Subject<PartyQuestData>();
  partyQuestDataSource$: Observable<PartyQuestData> = this.partyQuestDataSource.asObservable();
  
  private actions: PartyRequestCommand[] = [];
  private partyQuestData: PartyQuestData;

  constructor() {
    this.partyQuestData = new PartyQuestData("Default", "Default 2", "Test Quest");
  }

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
    const questData = this.fetchNewQuestData();
    const conv = a.getConversationSession();
    this.partyQuestData = new PartyQuestData(conv.conversationRequesterName,  conv.conversationTargetName, questData);
    this.partyQuestDataSource.next(this.partyQuestData);
  }

  public requestParty() {
    // sends an invite to the player   
  }

  public popUpPartyDungeonView() {
    // To emphasize collaboration and intimacy
    // use router for this
  }

  public fetchNewQuestData() {
    console.log("Fetching new quest data from backend.");
    return "Goblin Bandits";
  }
}
