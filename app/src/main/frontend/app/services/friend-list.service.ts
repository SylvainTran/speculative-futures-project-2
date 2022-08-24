import { Inject, Injectable } from '@angular/core';
import { Character } from './character';
import { FriendCallerService } from './friend-caller.service';
import { Friendship } from './friendship';
import { MockFriendList } from './mockfriendlist';

// I think this should be a Global friend list (shared across all the apps)
@Injectable({
  providedIn: 'root'
})
export class FriendListService {

  constructor(@Inject(MockFriendList) private friendList: MockFriendList,
              public friendCallerService: FriendCallerService) {

    console.log(friendList);
  }

  getFriends() {
    return this.friendList.friendList;
  }

  sendPrivateMessage(friendship: Friendship) {
    this.friendCallerService.requestInteraction(friendship.character1, friendship.character2);
  }
}
