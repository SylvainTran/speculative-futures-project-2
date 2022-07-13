import { Component, Input, OnInit } from '@angular/core';
import { Friend } from '../services/friend';

@Component({
  selector: 'app-friend-detail',
  templateUrl: './friend-detail.component.html',
  styleUrls: ['./friend-detail.component.css']
})
export class FriendDetailComponent implements OnInit {
  @Input() selectedFriend: Friend | undefined;
  constructor() {}

  ngOnInit(): void {
  }
}
