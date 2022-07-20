import { Component, OnInit } from '@angular/core';
import { AvatarControllerService } from '../services/avatar-controller.service';
import { Player } from '../services/player';

@Component({
  selector: 'app-quest-idler',
  templateUrl: './quest-idler.component.html',
  styleUrls: ['./quest-idler.component.css']
})
export class QuestIdlerComponent implements OnInit {

  title = 'quest-idler';
  playerRef: Player;

  constructor(private avatarControllerService: AvatarControllerService) {
    this.playerRef = new Player("Player");
  }

  ngOnInit(): void {
  }

  public restartGame() {
    console.log("restarting game");
    this.avatarControllerService.clickCount = 0;
    this.avatarControllerService.setIsAlive(true);
    this.avatarControllerService.getAvatarHealthService().setHealth(100);    
  }
}
