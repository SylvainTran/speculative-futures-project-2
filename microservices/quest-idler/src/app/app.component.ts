import { Component } from '@angular/core';
import { AvatarControllerService } from './avatar-controller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quest-idler';

  constructor(private avatarControllerService: AvatarControllerService) {}

  public restartGame() {
    console.log("restarting game");
    this.avatarControllerService.clickCount = 0;
    this.avatarControllerService.setIsAlive(true);
    this.avatarControllerService.getAvatarHealthService().setHealth(100);
  }
}
