import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConversationSession, FriendCallerService } from '../services/friend-caller.service';

@Component({
  selector: 'app-chat-display',
  templateUrl: './chat-display.component.html',
  styleUrls: ['./chat-display.component.css']
})
export class ChatDisplayComponent implements OnInit {
  chatboard: String[] = [];
  friendPrivateMessagesSub: Subscription;

  constructor(private friendCallerService: FriendCallerService) {
    this.chatboard = ["Hello", "How are you?"];

    const obs = {
      next: (conversationSession: ConversationSession) => this.updateChat(conversationSession),
      error: (err: Error) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };
    this.friendPrivateMessagesSub = this.friendCallerService.friendPivateMessageSource$.subscribe(obs);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.friendPrivateMessagesSub.unsubscribe();
  }

  updateChat(conversationSession: ConversationSession) {
    console.log(conversationSession.conversationText);
    this.chatboard.push(conversationSession.conversationText);
  }

}
