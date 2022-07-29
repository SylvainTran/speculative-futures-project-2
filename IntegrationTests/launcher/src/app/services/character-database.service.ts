import { Injectable } from '@angular/core';
import { ConversationNode } from './friend-caller.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterDatabaseService {
  // Conversation data pulled from /assets
  conversationDatabaseURL: string;
  assetsPathPrefix: String;
  conversationNodes: ConversationNode[] = [];

  constructor() {
    this.conversationDatabaseURL = "languageofflowers_conversation_system_and_db - questIdlerConversations.tsv";
    this.assetsPathPrefix = "../../assets/"; //ng serve entry point is integrationtests/launcher folder?
    this.pullConversationDatabase();

  }

  readDatabase(conversationDatabaseURL: string) {
    // REVIEW: not sure if the fetch api for local files will work later on when the game is hosted remotely? Used this because there's a breaking issue with the File Reader node class from 'fs' needing a polyfill currently.
    let lines;    
    fetch(conversationDatabaseURL, {mode: 'no-cors'})
      .then(response => response.text())
      .then(data=> {
        lines = data; 
        const rows = lines.split("\r");
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i].split("\t");
          const id = parseInt(cols[0]);
          const characterA = cols[1];
          const characterB = cols[2];
          const friendshipLevel = cols[3];
          const textArray = cols[4];
          const actionArray = cols[5];
          const conversationNode = new ConversationNode(id, characterA, characterB, friendshipLevel, textArray, actionArray);
          this.conversationNodes.push(conversationNode);
        }
        console.log(this.conversationNodes);
      })
      .catch(error => console.error(error));
  }

  pullConversationDatabase() {
    this.readDatabase(this.assetsPathPrefix + this.conversationDatabaseURL);
  }
}
