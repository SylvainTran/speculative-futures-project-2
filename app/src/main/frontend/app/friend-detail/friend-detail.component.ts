import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Character } from '../services/character';
import { Friend } from '../services/friend';
import { ConversationSession } from '../services/friend-caller.service';
import { FriendListService } from '../services/friend-list.service';
import { Friendship } from '../services/friendship';
import { Player } from '../services/player';

@Component({
  selector: 'app-friend-detail',
  templateUrl: './friend-detail.component.html',
  styleUrls: ['./friend-detail.component.css']
})
export class FriendDetailComponent implements OnInit {
  // The player ref is sent all the way from the AppComponent.ts
  @Input() playerRef: Player | undefined;
  lastPMSent: boolean = false;
  lastPMSentSuccess: boolean = false;
  activeFriendTarget: string | undefined = "";
  showPM: boolean = true;
  friendPrivateMessagesSub: Subscription;
  friendPMFailureSub: Subscription;

  @Input() selectedFriend!: Friend;
  constructor(private friendListService: FriendListService) {
    const obs = {
      next: (conversationSession: ConversationSession) => {
        this.updatePMStatus(conversationSession, true);
        setTimeout( () => {
          this.lastPMSentSuccess = false;
          this.activeFriendTarget = "";
        }, 5000);
      },
      error: (err: Error) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };
    this.friendPrivateMessagesSub = this.friendListService.friendCallerService.friendPrivateMessageSuccessSource$.subscribe(obs);
    const PMFailureHandler = {
      next: (conversationSession: ConversationSession | null) => {
        this.updatePMStatus(null, false);
      },
      error: (err: Error) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };
    this.friendPMFailureSub = this.friendListService.friendCallerService.friendPrivateMessageFailureSource$.subscribe(PMFailureHandler);
  }

  ngOnInit(): void {
  }

  addFriend(requester: Character, target: Character): Friendship {
    return new Friendship(requester, target);
  }
  
  sendPrivateMessage() {
    console.log("Sending a private message to : " + this.selectedFriend?.name);
    const targetName = this.selectedFriend.name;
    let f: Friendship | undefined;

    if (this.playerRef) {
      if(!this.playerRef.friendsMap.has(targetName)) {
        f = this.addFriend(this.playerRef, this.selectedFriend);
        this.playerRef.friendsMap.set(targetName, f);
      } else {
        f = this.playerRef.friendsMap.get(targetName);
      }
      if (f !== undefined) {
        if (f.friendshipLevel < 3) {
          this.friendListService.sendPrivateMessage(f);
        }
        this.notifyLastPMStatus();  
      } else {
        console.log("Error: friendship was not defined properly.");
      }
    } else {
      console.warn("Player ref not defined yet. See AppComponent.ts");
    }
  }

  public notifyLastPMStatus() {
    this.lastPMSent = true;
    setTimeout( () => {
      this.lastPMSent = false;
    }, 3000);
  }

  public checkFriendAvailability() {
    setTimeout( () => {
      this.lastPMSentSuccess = this.activeFriendTarget === "" ? false : true;
    }, 500);
  }

  public updatePMStatus(conversationSession: ConversationSession | null, status: boolean) {
    this.lastPMSentSuccess = status;
    this.activeFriendTarget = conversationSession?.conversationTargetName;
  }  
}
