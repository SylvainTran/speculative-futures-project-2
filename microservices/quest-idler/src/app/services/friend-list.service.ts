import { Inject, Injectable } from '@angular/core';
import { Character } from './character';
import { FriendCallerService } from './friend-caller.service';
import { MockFriendList } from './mockfriendlist';

@Injectable({
  providedIn: 'root'
})
export class FriendListService {

  constructor(@Inject(MockFriendList) private friendList: MockFriendList,
              private friendCallerService: FriendCallerService) {

    console.log(friendList);
  }

  getFriends() {
    return this.friendList.friendList;
  }

  sendPrivateMessage(requester: Character, target: Character) {
    this.friendCallerService.requestInteraction(requester, target);
  }
}
