import { Inject, Injectable } from '@angular/core';
import { MockFriendList } from './mockfriendlist';

@Injectable({
  providedIn: 'root'
})
export class FriendListService {

  constructor(@Inject(MockFriendList) private friendList: MockFriendList) {

  }

  getFriends() {
    return this.friendList.friendList;
  }
}
