import { Component, Input, OnInit } from '@angular/core';
import { Character } from '../services/character';
import { Friend } from '../services/friend';
import { FriendListService } from '../services/friend-list.service';
import { Friendship } from '../services/friendship';
import { Player } from '../services/player';

@Component({
  selector: 'app-friend-detail',
  templateUrl: './friend-detail.component.html',
  styleUrls: ['./friend-detail.component.css']
})
export class FriendDetailComponent implements OnInit {
  //Temp
  player: Player;
  @Input() selectedFriend!: Friend;
  constructor(private friendListService: FriendListService) {
    this.player = new Player("Autumn");
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

    if(!this.player.friendsMap.has(targetName)) {
      f = this.addFriend(this.player, this.selectedFriend);
      this.player.friendsMap.set(targetName, f);
    } else {
      f = this.player.friendsMap.get(targetName);
    }
    if (f !== undefined) {
      this.friendListService.sendPrivateMessage(f);
    } else {
      console.log("Error: friendship was not defined properly.");
    }
  }
}
