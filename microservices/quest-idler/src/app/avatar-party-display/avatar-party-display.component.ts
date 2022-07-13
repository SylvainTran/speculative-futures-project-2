import { Component, Inject, OnInit } from '@angular/core';
import { AVATAR_NAME } from '../app.module';
import { AvatarControllerService } from '../avatar-controller.service';

@Component({
  selector: 'app-avatar-party-display',
  templateUrl: './avatar-party-display.component.html',
  styleUrls: ['./avatar-party-display.component.css'],
})
export class AvatarPartyDisplayComponent implements OnInit {
  // Received from AvatarController
  private clickCount: number = 0;

  // Bindings
  private avatar: String = "(._.)";
  private avatarName: String = "";

  // Party
  private avatar2: String = "(._.)";
  private avatarName2: String = "";  

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
    this.currentHealth = this.avatarControllerService.getAvatarHealthService().getHealth();

    let aes = this.avatarControllerService.getAvatarExperienceService();
    this.currentLevel = aes.getCurrentLevel();
    this.currentExperience = aes.getCurrentExperience();
    this.experienceTotalRequired = aes.getExperienceTotalRequired();
  }

  public getAvatar() {
    return this.avatar;
  }

  public getAvatar2() {
    return this.avatar2;
  }

  public getAvatarName() {
    return this.avatarName;
  }

  public handleAvatarClicked() {
    // TODO Replace by events
    this.avatarControllerService.handleAvatarClicked();
    this.clickCount = this.avatarControllerService.clickCount;
    this.currentLevel = this.avatarControllerService.getAvatarExperienceService().getCurrentLevel();
    this.currentExperience = this.avatarControllerService.getAvatarExperienceService().getCurrentExperience();
    this.experienceTotalRequired = this.avatarControllerService.getAvatarExperienceService().getExperienceTotalRequired();
    this.updateAvatarDisplay();
  }

  public updateAvatarDisplay() {    
    if (this.avatarControllerService.isAlive()) {
      if (this.clickCount % 2 === 0) {
        this.avatar = "<(O`.O`)> <( Fighting! )";
        this.avatar2 = "<(O`.`O)> <( Fighting Alongside! )";
      } else if (this.clickCount % 3 == 0) {
        this.avatar = "^(^_^)^_ <( Victorious. )"
        this.avatar2 = "<(O`.`O)> <( Well done! )";
      } else {
        this.avatar = "_(*_*)_ <( Defeated. )";
        this.avatar2 = "_(*_*)_ <( It's my fault. )";
        this.currentHealth = this.avatarControllerService.getAvatarHealthService().changeHealth(-5);
        if(this.avatarControllerService.getAvatarHealthService().healthIsBelowZero()) {
          this.avatar = "(RIP) <( Has Died. )";
          this.avatar2 = "(RIP) <( Has Died. )";
          this.avatarControllerService.alive = false;
        }
      }
    }
  }
}
