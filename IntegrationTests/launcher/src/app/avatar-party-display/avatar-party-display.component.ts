import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AVATAR_NAME } from '../app.module';
import { AvatarControllerService } from '../services/avatar-controller.service';
import { PartyQuestData } from '../services/quest-party.service';

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

  // Quest
  private enemyPlaceholder: String = "The mountains are breezy and the wind pushes you forth.";
  @Input() public activePartyQuest?: PartyQuestData;
  
  // Sounds
  avatarClickAudioSrc: any;
  avatarVictoryAudioSrc: any;
  avatarDeathAudioSrc: any;
    
  constructor(@Inject(AVATAR_NAME) 
              avatarName: string,
              private avatarControllerService: AvatarControllerService)  
  {
    this.avatarName = avatarName;
  }

  ngOnInit(): void {
    this.currentHealth = this.avatarControllerService.getAvatarHealthService().getHealth();

    let aes = this.avatarControllerService.getAvatarExperienceService();
    this.currentLevel = aes.getCurrentLevel();
    this.currentExperience = aes.getCurrentExperience();
    this.experienceTotalRequired = aes.getExperienceTotalRequired();
  }

  ngAfterViewInit(): void {
    this.avatarClickAudioSrc = document.getElementById("click-beep");
    this.avatarVictoryAudioSrc = document.getElementById("victory");
    this.avatarDeathAudioSrc = document.getElementById("death");
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

  public getFriendName() {
    return this.avatarName2;
  }

  public getEnemyPlaceholder() {
    return this.enemyPlaceholder;
  }

  public getActiveQuestName() {
    return this.activePartyQuest?.getActiveQuestName();
  }

  public getActivePartyNames() {
    return this.activePartyQuest?.getRegistrants();
  }

  public handleAvatarClicked() {
    // TODO Replace by events
    this.avatarControllerService.handleAvatarClicked();
    this.clickCount = this.avatarControllerService.clickCount;
    this.currentLevel = this.avatarControllerService.getAvatarExperienceService().getCurrentLevel();
    this.currentExperience = this.avatarControllerService.getAvatarExperienceService().getCurrentExperience();
    this.experienceTotalRequired = this.avatarControllerService.getAvatarExperienceService().getExperienceTotalRequired();
    this.updateAvatarDisplay();
    this.avatarClickAudioSrc.play();
  }

  public updateAvatarDisplay() {    
    if (this.avatarControllerService.isAlive()) {
      if (this.clickCount % 2 === 0) {
        this.avatar = "<(O`.O`)> <( Fighting! )";
        this.avatar2 = "<(O`.`O)> <( Fighting Alongside! )";
        this.enemyPlaceholder = "(You are out in the mountains together, looking for new adventure.)";
      } else if (this.clickCount % 3 == 0) {
        this.avatar = "^(^_^)^_ <( Victorious. )"
        this.avatar2 = "<(O`.`O)> <( Well done! )";
        this.enemyPlaceholder = "(The songs tell of a tale when you defeated a wild, naked goblin together.)";
        this.avatarVictoryAudioSrc.play();
      } else {
        this.avatar = "_(*_*)_ <( Defeated. )";
        this.avatar2 = "_(*_*)_ <( It's my fault. )";
        this.currentHealth = this.avatarControllerService.getAvatarHealthService().changeHealth(-5);
        this.avatarDeathAudioSrc.play();
        if(this.avatarControllerService.getAvatarHealthService().healthIsBelowZero()) {
          this.avatar = "(RIP) <( Has Died. )";
          this.avatar2 = "(RIP) <( Has Died. )";
          this.enemyPlaceholder = "(You both faded from history, alas defeated by a wild, naked goblin.)";
          this.avatarControllerService.alive = false;
        }
      }
    }
  }
}
