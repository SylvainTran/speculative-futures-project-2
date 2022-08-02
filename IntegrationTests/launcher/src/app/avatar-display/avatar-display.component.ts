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
  public TEXT_BUFFER_STREAM: string = "";
  public POEM_OUTPUT: string = "";
  public activeClicksRemaining: number = 5;

  public result: string = "";
  private avatarName: String = "";
  private enemyPlaceholder: String = "The mountains are breezy and the wind pushes you forth.";
  private location: String = "//\\//\\";
  private locationName: String = "Mountains of Uncertainty 1-1";

  public currentHealth: number = 100;
  public currentLevel: number = 1;
  public currentExperience: number = 0;
  public experienceTotalRequired: number = 100;

  // Video game poetry experiment
  friendPrivateMessagesSub: Subscription;
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
    this.currentHealth = this.avatarControllerService.getAvatarHealthService().getHealth();

    let aes = this.avatarControllerService.getAvatarExperienceService();
    this.currentLevel = aes.getCurrentLevel();
    this.currentExperience = aes.getCurrentExperience();
    this.experienceTotalRequired = aes.getExperienceTotalRequired();
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
  
  public getVerbFromRandomSample(index: number): string {
    let group = index % 2 === 0? 1 : 2;
    const m_physicalActions: string[] = ["pulverize", "push", "hammer", "cut", "pummel", "break", "throw", "blow"];
    const m_nonPhysicalActions: string[] = ["reflect", "prepare", "anticipate", "tear up"];

    if (group === 1) {
      return m_physicalActions[index % m_physicalActions.length];
    } else {
      return m_nonPhysicalActions[index % m_nonPhysicalActions.length];
    }
  }

  public executeStream() {
    this.POEM_OUTPUT = this.TEXT_BUFFER_STREAM;
    setTimeout(()=> {this.POEM_OUTPUT = ""}, 3000);
    
    if (this.clickCount % 2 === 0) {
      this.location = "/\\/\\";
      this.enemyPlaceholder = "(You are out in the mountains, looking for new adventure.)";
    } else if (this.clickCount % 3 === 0) {
      this.result = "[Victorious.]"
      this.location = "/\\/\\";
      this.enemyPlaceholder = "(The songs tell of a tale when you defeated a wild, naked goblin.)";
      this.avatarVictoryAudioSrc.play();
    } else {
      this.result = "[Defeated.]";
      this.enemyPlaceholder = "(You faded from history, alas defeated by a wild, naked goblin.)";
      this.currentHealth = this.avatarControllerService.getAvatarHealthService().changeHealth(-5);
      this.avatarDeathAudioSrc.play();
      if(this.avatarControllerService.getAvatarHealthService().healthIsBelowZero()) {
        this.result = "[Died.]";
        this.avatarControllerService.alive = false;
      }
    }
  }

  public handleAvatarClicked() {
    if (this.controlLock) {
      return;
    }
    // TODO Replace by events
    this.avatarControllerService.handleAvatarClicked();
    this.clickCount = this.avatarControllerService.clickCount;
    this.currentLevel = this.avatarControllerService.getAvatarExperienceService().getCurrentLevel();
    this.currentExperience = this.avatarControllerService.getAvatarExperienceService().getCurrentExperience();
    this.experienceTotalRequired = this.avatarControllerService.getAvatarExperienceService().getExperienceTotalRequired();
    this.updateAvatarDisplay();
    // Sounds
    this.avatarClickAudioSrc.play();
  }

  public updateAvatarDisplay() {    
    if (this.avatarControllerService.isAlive()) {
      if (this.activeClicksRemaining > 0) {
        this.avatar = this.getVerbFromRandomSample(this.clickCount);
        this.TEXT_BUFFER_STREAM += " " + this.avatar;
        --this.activeClicksRemaining;
      } else {
        this.executeStream();
        this.activeClicksRemaining = 5;
        this.TEXT_BUFFER_STREAM = "";
      }
    }
  }

  public set ControlLock(value: boolean) {
    this.controlLock = value;
  }

  // Experimental poetry
  public updateVideoGamePoetry(conversationSession: ConversationSession) {

    this.ControlLock = true;   
    let conversationTextIndex = 0;

    let chatInterval = setInterval( () => {

      console.log("Console text index : " + conversationTextIndex + " , conversation end index: " + conversationSession.conversationEndIndex);
      
      if (conversationTextIndex >= conversationSession.conversationEndIndex) {
        clearInterval(chatInterval);
        this.ControlLock = false;
        // End conversation
        conversationSession.endConversation();
        conversationSession.applyActions();
        return;
      }

      const dialogueNode = conversationSession.conversationTexts[conversationTextIndex++];
      this.poems.push(dialogueNode);

    }, 1000 * Math.ceil(Math.random() * 5));  
  }

  public updatePartyModeActive(partyQuestData: PartyQuestData) {
    this.partyModeActive = true;
  }
}
