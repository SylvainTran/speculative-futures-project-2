import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConversationSession, FriendCallerService } from '../services/friend-caller.service';

@Component({
  selector: 'app-chat-display',
  templateUrl: './chat-display.component.html',
  styleUrls: ['./chat-display.component.css']
})
export class ChatDisplayComponent implements OnInit, OnDestroy {
  chatboard: String[] = [];
  friendPrivateMessagesSub: Subscription;
  newMessages: number = 0;

  constructor(private friendCallerService: FriendCallerService) {
    this.chatboard = [];
    const obs = {
      next: (conversationSession: ConversationSession) => this.updateChat(conversationSession),
      error: (err: Error) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };
    this.friendPrivateMessagesSub = this.friendCallerService.friendPrivateMessageSuccessSource$.subscribe(obs);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.friendPrivateMessagesSub.unsubscribe();
  }

  updateChat(conversationSession: ConversationSession) {

    ++this.newMessages;
    
    // Simulate real time delays
    let conversationTextIndex = 0;

    let chatInterval = setInterval( () => {
      
      if (conversationTextIndex >= conversationSession.conversationEndIndex) {
        clearInterval(chatInterval);
        console.log("The conversation has ended.");
        --this.newMessages;
        return;
      }

      const dialogueNode = conversationSession.conversationTexts[conversationTextIndex++];
      this.chatboard.push(dialogueNode);

    }, 1000 * Math.ceil(Math.random() * 5));    
  }

}
