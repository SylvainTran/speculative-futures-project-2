import { Component, Input, OnInit } from '@angular/core';
import { Friend } from '../services/friend';
import { FriendListService } from '../services/friend-list.service';
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
    this.player = new Player("Sylvain");
  }

  ngOnInit(): void {
  }

  sendPrivateMessage() {
    console.log("Sending a private message to : " + this.selectedFriend?.name);
    this.friendListService.sendPrivateMessage(this.player, this.selectedFriend);
  }
}
