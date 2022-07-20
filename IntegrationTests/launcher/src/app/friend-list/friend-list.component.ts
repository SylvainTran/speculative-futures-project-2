import { Component, OnInit, Output } from '@angular/core';
import { Friend } from '../services/friend';
import { FriendListService } from '../services/friend-list.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit {
  private friendListService: FriendListService;
  @Output() private friendList?: Friend[] = [];
  @Output() private selectedFriend!: Friend;
  showPMBox: boolean = false;
  
  constructor(friendListService: FriendListService) { 
    this.friendListService = friendListService;
  }

  ngOnInit(): void {
    this.friendList = this.friendListService.getFriends();
  }

  public getFriendList() {
    return this.friendList;
  }

  public getSelectedFriend() {
    return this.selectedFriend;
  }
  
  public openPMBox() {
    this.showPMBox = !this.showPMBox;
  }

  public selectFriend(friend: Friend) {
    this.selectedFriend = friend;
  }
}
