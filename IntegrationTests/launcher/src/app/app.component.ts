import { Component, OnInit } from '@angular/core';
import { AvatarControllerService } from './services/avatar-controller.service';
import { Player } from './services/player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'quest-idler';
  playerRef: Player;
  friendListVisible: boolean = true;
  messageCenterVisible: boolean = true;
  currentTime: string | undefined;

  constructor(private avatarControllerService: AvatarControllerService) {
    this.playerRef = new Player("Player");
  }
  ngOnInit(): void {
    this.currentTime = new Date().toISOString();
  }

  // public restartGame() {
  //   console.log("restarting game");
  //   this.avatarControllerService.clickCount = 0;
  //   this.avatarControllerService.setIsAlive(true);
  //   this.avatarControllerService.getAvatarHealthService().setHealth(100);    
  // }

  public setFriendListVisible(value: boolean) : void {
    this.friendListVisible = value;
  }

  public setMessageCenterVisible(value: boolean) : void {
    this.messageCenterVisible = value;
  }
}
