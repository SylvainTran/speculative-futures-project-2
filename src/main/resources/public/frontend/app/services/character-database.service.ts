import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Character } from './character';
import { ACTORS, SMS_CLASS } from './main-quest.service';

interface ConversationNodeData {
  conversationID: number,
  characterA: string, // player usually
  characterB: Character,
  friendshipLevel: string,
  textArray: string,
  actionArray: string[],
  partyQuestRoadPoemPrompts: string[],
  partyQuestOptionReplies: string[],
  partyQuestRoadPoemPlayerOptions: string[],
  SMS_EVENT_KEY: SMS_CLASS
}

export class ConversationNode {

  constructor(
    public conversationID: any, 
    public characterA: string, 
    public characterB: Character, 
    public friendshipLevel: string, 
    public conversationText: string, 
    public actionsText: string[], 
    public partyQuestRoadPoemPrompts: string[], 
    public partyQuestOptionReplies: string[], 
    public partyQuestRoadPoemPlayerOptions: string[], 
    public SMS_EVENT: SMS_CLASS) {

  }
}

@Injectable({
  providedIn: 'root'
})
export class CharacterDatabaseService implements OnInit {
  // Conversation data pulled from /assets
  conversationDatabaseURL: string;
  assetsPathPrefix: string;
  conversationNodes: ConversationNode[] = [];

  prompts: string[][] = [];
  playerOptions: string[][] = [];
  optionReplies: string[][] = [];

  // Database is loaded event
  databaseLoadedEventSource = new Subject<ConversationNode[]>();
  databaseLoadedEventSource$: Observable<ConversationNode[]> = this.databaseLoadedEventSource.asObservable();

  constructor() {
    this.conversationDatabaseURL = "languageofflowers_conversation_system_and_db - questIdlerConversations.tsv";
    this.assetsPathPrefix = "../assets/";
    this.pullConversationDatabase();
  }

  ngOnInit(): void {

  }

  public readDatabase(conversationDatabaseURL: string) {
    let lines;    
    fetch(conversationDatabaseURL, {mode: 'no-cors'})
      .then(response => response.text())
      .then(data=> {
        lines = data; 
        const rows = lines.split("\r");
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i].split("\t");

          // Process the strings          
          // Pull eOS events (e.g., SMS events, etc.)
          const ACTOR_NAME = ACTORS[parseInt(cols[10])];
          let smsData = new SMS_CLASS(cols[9], ACTOR_NAME);

          const conversationNode = new ConversationNode(
            parseInt(cols[0]),
            cols[1],
            new Character(cols[2]),
            cols[3],
            cols[4],
            this.getParsedStringArray(cols[5], ",", 0),
            this.getParsedStringArray(cols[6], "$", 1),
            this.getParsedStringArray(cols[7], "$", 1),
            this.getParsedStringArray(cols[8], "$", 1),
            smsData
          );
          this.conversationNodes.push(conversationNode);          
        }
        this.databaseLoadedEventSource.next(this.conversationNodes);
        console.log("Db loaded");
      })
      .catch(error => console.error(error));
  }

  public pullConversationDatabase() {
    this.readDatabase(this.assetsPathPrefix + this.conversationDatabaseURL);
  }

  public getParsedStringArray(line: string, splitSymbol: string, sliceIndex?: number): string[] {
    return line
      .trim()
      .replace('[', '')
      .replace(']', '')
      .split(splitSymbol)
      .slice(sliceIndex);  
  }
}
