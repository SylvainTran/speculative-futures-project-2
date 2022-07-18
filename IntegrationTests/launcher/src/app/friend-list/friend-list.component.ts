import { Component, OnInit } from '@angular/core';
import { Friend } from '../services/friend';
import { FriendListService } from '../services/friend-list.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit {
  // Friend related
  private friendListService: FriendListService;
  private friendList?: Friend[] = [];
  private selectedFriend!: Friend;
  
  constructor(friendListService: FriendListService) { 
    this.friendListService = friendListService;
  }

  ngOnInit(): void {
    this.friendList = this.friendListService.getFriends();
  }

  public selectFriend(friend: Friend) {
    this.selectedFriend = friend;
  }

  public getFriendList() {
    return this.friendList;
  }

  public getSelectedFriend() {
    return this.selectedFriend;
  }
}
