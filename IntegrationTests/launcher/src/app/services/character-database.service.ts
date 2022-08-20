import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Character } from './character';

interface ConversationNodeData {
  conversationID: number,
  characterA: string, // player usually
  characterB: Character,
  friendshipLevel: string,
  textArray: string,
  actionArray: string[],
  partyQuestRoadPoemPrompts: string[],
  partyQuestOptionReplies: string[],
  partyQuestRoadPoemPlayerOptions: string[]
}

export class ConversationNode {
  conversationID: any;
  characterA: string;
  characterB: Character;
  friendshipLevel: string;
  conversationText: any;
  actionsText: string[];
  partyQuestRoadPoemPrompts: string[];
  partyQuestOptionReplies: string[];
  partyQuestRoadPoemPlayerOptions: string[];

  constructor({conversationID, characterA, characterB, friendshipLevel, textArray, actionArray, partyQuestRoadPoemPrompts, partyQuestOptionReplies, partyQuestRoadPoemPlayerOptions} : ConversationNodeData) {
    this.conversationID = conversationID;
    this.characterA = characterA;
    this.characterB = characterB;
    this.friendshipLevel = friendshipLevel;
    this.conversationText = textArray;
    this.actionsText = actionArray;
    this.partyQuestRoadPoemPrompts = partyQuestRoadPoemPrompts;
    this.partyQuestOptionReplies = partyQuestOptionReplies;
    this.partyQuestRoadPoemPlayerOptions = partyQuestRoadPoemPlayerOptions;
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
    this.assetsPathPrefix = "../../assets/"; //ng serve entry point is integrationtests/launcher folder?
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
          const conversationNode = new ConversationNode({
            conversationID: parseInt(cols[0]),
            characterA: cols[1],
            characterB: new Character(cols[2]),
            friendshipLevel: cols[3],
            textArray: cols[4],
            actionArray: this.getParsedStringArray(cols[5], ",", 0),
            partyQuestRoadPoemPrompts: this.getParsedStringArray(cols[6], "$", 1),
            partyQuestOptionReplies: this.getParsedStringArray(cols[7], "$", 1),
            partyQuestRoadPoemPlayerOptions: this.getParsedStringArray(cols[8], "$", 1)
          });
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
