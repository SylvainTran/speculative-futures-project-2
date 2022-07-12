import { Component, Inject, Input, OnInit } from '@angular/core';
import { AVATAR_NAME } from '../app.module';
import { Friend } from '../friend';
import { AvatarControllerService } from '../avatar-controller.service';

@Component({
  selector: 'app-avatar-display',
  templateUrl: './avatar-display.component.html',
  styleUrls: ['./avatar-display.component.css'],
})
export class AvatarDisplayComponent implements OnInit {
  // Received from AvatarController
  private clickCount: number = 0;

  // Bindings
  private avatar: String = "(X_X)";
  private avatarName: String = "";

  public currentHealth: number = 100;
  public currentLevel: number = 1;
  public currentExperience: number = 0;
  public experienceTotalRequired: number = 100;

  // Services
  private avatarControllerService: AvatarControllerService;
  
  constructor(@Inject(AVATAR_NAME) 
              avatarName: string,
              avatarControllerService: AvatarControllerService) 
  {
    this.avatarName = avatarName;
    this.avatarControllerService = avatarControllerService;
  }

  ngOnInit(): void {

  }

  public getAvatar() {
    return this.avatar;
  }

  public getAvatarName() {
    return this.avatarName;
  }

  public handleAvatarClicked() {
    this.avatarControllerService.handleAvatarClicked();
    this.clickCount = this.avatarControllerService.clickCount;
    // TODO Replace by events
    this.currentLevel = this.avatarControllerService.getAvatarExperienceService().getCurrentLevel();
    this.currentExperience = this.avatarControllerService.getAvatarExperienceService().getCurrentExperience();
    this.experienceTotalRequired = this.avatarControllerService.getAvatarExperienceService().getExperienceTotalRequired();
    this.updateAvatarDisplay();
  }

  public updateAvatarDisplay() {     
    if (this.clickCount % 2 == 0) {
      this.avatar = "<(O`.O`)> <( Fighting! )";
    } else if (this.clickCount % 3 == 0) {
      this.avatar = "^(^_^)^_ <( Victorious. )"
    } else {
      this.avatar = "_(*_*)_ <( Defeated. )";
      this.currentHealth = this.avatarControllerService.getAvatarHealthService().changeHealth(-5);
    }
  }
}
