import { Component } from '@angular/core';
import { AvatarControllerService } from './services/avatar-controller.service';
import { Player } from './services/player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quest-idler';
  playerRef: Player;

  constructor(private avatarControllerService: AvatarControllerService) {
    this.playerRef = new Player("Player");
  }

  // public restartGame() {
  //   console.log("restarting game");
  //   this.avatarControllerService.clickCount = 0;
  //   this.avatarControllerService.setIsAlive(true);
  //   this.avatarControllerService.getAvatarHealthService().setHealth(100);    
  // }
}
