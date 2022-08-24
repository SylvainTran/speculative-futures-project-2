import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AVATAR_NAME } from '../app.module';
import { AvatarControllerService } from '../services/avatar-controller.service';
import { ConversationSession, FriendCallerService } from '../services/friend-caller.service';
import { PartyQuestData, QuestPartyService } from '../services/quest-party.service';

@Component({
  selector: 'app-avatar-display',
  templateUrl: './avatar-display.component.html',
  styleUrls: ['./avatar-display.component.css'],
})
export class AvatarDisplayComponent implements OnInit, OnDestroy, AfterViewInit {
  // Received from AvatarController
  private clickCount: number = 0;

  // Bindings
  private avatar: String = "(._.)";
  private avatarName: String = "";
  private enemyPlaceholder: String = "The mountains are breezy and the wind pushes you forth.";
  private location: String = "//\\//\\";
  private locationName: String = "Titan's Mountains";

  public currentHealth: number = 100;
  public currentLevel: number = 1;
  public currentExperience: number = 0;
  public experienceTotalRequired: number = 100;

  // Video game poetry experiment
  friendPrivateMessagesSub: Subscription;
  conversationSession?: ConversationSession | null;
  conversationTextIndex = 0;
  poems: String[] = [];
  controlLock: boolean = false;

  // Sounds
  avatarClickAudioSrc: any;
  avatarVictoryAudioSrc: any;
  avatarDeathAudioSrc: any;

  // Party mode
  partyQuestSub: Subscription;
  partyModeActive: boolean = false;

  // Services
  private avatarControllerService: AvatarControllerService;
  
  constructor(@Inject(AVATAR_NAME) 
              avatarName: string,
              avatarControllerService: AvatarControllerService,
              private friendCallerService: FriendCallerService,
              private questPartyService: QuestPartyService) 
  {
    this.avatarName = avatarName;
    this.avatarControllerService = avatarControllerService;

    const obs = {
      next: (conversationSession: ConversationSession) => this.updateVideoGamePoetry(conversationSession),
      error: (err: Error) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };
    this.friendPrivateMessagesSub = this.friendCallerService.friendPrivateMessageSuccessSource$.subscribe(obs);

    const partyModeObs = {
      next: (partyQuestData: PartyQuestData) => this.updatePartyModeActive(partyQuestData),
      error: (err: Error) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };
    this.partyQuestSub = this.questPartyService.partyQuestDataSource$.subscribe(partyModeObs);
  }

  ngAfterViewInit(): void {
    this.avatarClickAudioSrc = document.getElementById("click-beep");
    this.avatarVictoryAudioSrc = document.getElementById("victory");
    this.avatarDeathAudioSrc = document.getElementById("death");
  }

  ngOnInit(): void {
    this.currentHealth = this.avatarControllerService.getAvatarHealthService().Health;

    let aes = this.avatarControllerService.getAvatarExperienceService();
    this.currentLevel = aes.CurrentLevel;
    this.currentExperience = aes.CurrentExperience;
    this.experienceTotalRequired = aes.ExperienceTotalRequired;
  }

  ngOnDestroy(): void {
    this.friendPrivateMessagesSub.unsubscribe();
    this.partyQuestSub.unsubscribe();
  }

  public getAvatar() {
    return this.avatar;
  }

  public getAvatarName() {
    return this.avatarName;
  }

  public getEnemyPlaceholder() {
    return this.enemyPlaceholder;
  }

  public getLocation() {
    return this.location;
  }

  public getLocationName() {
    return this.locationName;
  }

  public handleAvatarClicked() {
    if (this.controlLock) {
      this.poetryClickHandler();
      return;
    }
    // Else normal clicker behaviour
    // TODO Replace by events
    this.avatarControllerService.handleAvatarClicked();
    this.clickCount = this.avatarControllerService.clickCount;
    this.currentLevel = this.avatarControllerService.getAvatarExperienceService().CurrentLevel;
    this.currentExperience = this.avatarControllerService.getAvatarExperienceService().CurrentExperience;
    this.experienceTotalRequired = this.avatarControllerService.getAvatarExperienceService().ExperienceTotalRequired;
    this.updateAvatarDisplay();
    // Sounds
    this.avatarClickAudioSrc.play();
  }

  public updateAvatarDisplay() {    
    if (this.avatarControllerService.isAlive()) {
      if (this.clickCount % 2 === 0) {
        this.avatar = "<(o_o)> <( ... )";
        this.location = "/\\/\\";
        this.enemyPlaceholder = "(You are out in the mountains, looking for new adventure.)";
      } else if (this.clickCount % 3 == 0) {
        this.avatar = "^(^_^)^_ <( Victorious. )"
        this.location = "/\\/\\";
        this.enemyPlaceholder = "(The songs tell of a tale when you defeated a wild, naked goblin.)";
        this.avatarVictoryAudioSrc.play();
      } else {
        this.avatar = "<(*_*)> <( ... )";
        this.enemyPlaceholder = "(You faded from history, alas defeated by a wild, naked goblin.)";
        this.currentHealth = this.avatarControllerService.getAvatarHealthService().changeHealth(-5);
        if (this.currentHealth <= 0) {
          this.currentHealth = 0;
        }
        this.avatarDeathAudioSrc.play();
        if(this.avatarControllerService.getAvatarHealthService().healthIsBelowZero()) {
          this.avatar = "(RIP) <( Has Died. )";
          this.avatarControllerService.alive = false;
        }
      }
    }
  }

  public set ControlLock(value: boolean) {
    this.controlLock = value;
  }

  // Experimental poetry
  public updateVideoGamePoetry(conversationSession: ConversationSession) {
    // Switch control lock to poetry click handling
    this.ControlLock = true;   
    this.conversationSession = conversationSession;
    this.updateTextDisplay();
  }

  public poetryClickHandler() {
    if (this.conversationSession === undefined || this.conversationSession === null) {
      return;
    } 
    if (this.conversationTextIndex >= this.conversationSession.conversationEndIndex) {
      this.ControlLock = false;
      // End conversation
      this.conversationSession.endConversation();
      this.conversationSession.applyActions();
      this.conversationSession = null;
      this.conversationTextIndex = 0;
      return;
    } else {
      this.updateTextDisplay();
    }
  }

  public updateTextDisplay() {
    if (this.conversationSession === undefined || this.conversationSession === null) {
      return;
    } 
    const dialogueNode = this.conversationSession.conversationTexts[this.conversationTextIndex++];
    this.poems.push(dialogueNode);  
  }

  public updatePartyModeActive(partyQuestData: PartyQuestData) {
    this.partyModeActive = true;
  }
}
