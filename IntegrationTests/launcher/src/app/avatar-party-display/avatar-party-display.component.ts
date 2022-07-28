import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AVATAR_NAME } from '../app.module';
import { CharacterPrompt } from '../quest-idler/quest-idler.component';
import { AvatarControllerService } from '../services/avatar-controller.service';
import { AvatarExperienceService } from '../services/avatar-experience.service';
import { PartyQuestData } from '../services/quest-party.service';

export enum UserType {
  PLAYER,
  FRIEND
}

export enum StringAvatarArtStatesEnum {
  IDLE,
  FIGHTING,
  VICTORIOUS,
  DEFEATED,
  DEAD
}

interface StringAvatarArtStates {
  IDLE: string,
  FIGHTING: string,
  VICTORIOUS: string,
  DEFEATED: string,
  DEAD: string
};

class Autumn implements StringAvatarArtStates {

  constructor(
    public IDLE = "'(._.)'",
    public FIGHTING = "'<(O`.O`)> <( Fighting! )'",
    public VICTORIOUS = '^(^_^)^_ <( Victorious. )',
    public DEFEATED = '_(*_*)_ <( Defeated. )',
    public DEAD = '(RIP) <( Has Died. )') {}
}

class DefaultFriend implements StringAvatarArtStates {

  constructor(
    public IDLE = "'(._.)'",
    public FIGHTING = '<(O`.`O)> <( Fighting Alongside! )',
    public VICTORIOUS = '<(O`.`O)> <( Well done! )',
    public DEFEATED ="_(*_*)_ <( It's my fault. )",
    public DEAD = '(RIP) <( Has Died. )') {}
}

class AvatarArt {
  constructor(private name: string, private artStates: StringAvatarArtStates) {}

  public get Idle() {
    return this.artStates.IDLE;
  }

  public get Fighting() {
    return this.artStates.FIGHTING;
  }

  public get Victorious() {
    return this.artStates.VICTORIOUS;
  }

  public get Defeated() {
    return this.artStates.DEFEATED;
  }

  public get Dead() {
    return this.artStates.DEAD;
  }
}

interface PromptBuilder {
  build(): void;
  reinitData(promptList: CharacterPrompt[]): void;
  reset(promptIterator: number, choiceIndex: number): void;
}

// Of course the builder is impure
class PromptReplyBuilder implements PromptBuilder {
  showPlayerOptions: boolean = false;
  showPlayerPromptReply: boolean = false;
  showCharacterPromptReply: boolean = false;
  showPrompt: boolean = false;
  activePromptReply: string | null = "";
  activeCharacterPromptReply: string | null = "";
  activePromptFadeTimeout: any;
  
  constructor(private promptList: CharacterPrompt[], private promptIterator: number, private choiceIndex: number) {}
  
  reinitData(promptList: CharacterPrompt[]): void {
    this.promptList = promptList;
  }

  reset(promptIterator: number, choiceIndex: number = 0): void {
    this.promptIterator = promptIterator;
    this.choiceIndex = choiceIndex;
    this.build();
  }

  build(): void {
    this.displayPlayerOptions(false)
      .displayPlayerPromptReply(false)
      .setStringPromptReply(UserType.PLAYER, this.choiceIndex)
      .setStringPromptReply(UserType.FRIEND, this.choiceIndex)
      .delayCharacterPromptReply(true)
      .delayShowPrompt(false);
  }

  public displayPlayerOptions(value: boolean) {
    this.showPlayerOptions = value;
    return this;
  }

  public displayPlayerPromptReply(value: boolean) {
    this.showPlayerPromptReply = value;
    return this; 
  }

  public setStringPromptReply(userType: UserType, choiceIndex: number) {
    if (userType === UserType.PLAYER) {
      this.activePromptReply =  this.promptList[this.promptIterator].getPlayerOptions()![choiceIndex];
    } else {
      this.activeCharacterPromptReply =  this.promptList[this.promptIterator].getCharacterOptions()![choiceIndex];
    }
    return this;
  }

  public displayCharacterPromptReply(value: boolean) {
    this.showCharacterPromptReply = value;
    return this;
  }

  public delayCharacterPromptReply(show: boolean) {
   setTimeout(() => {
      this.displayCharacterPromptReply(show);
    }, 2000);
    return this;
  }

  public delayShowPrompt(value: boolean) {
    this.activePromptFadeTimeout = setTimeout(() => {
      this.displayPrompt(value);
    }, 8000);
    return this;
  }

  public displayPrompt(value: boolean) {
    this.showPrompt = value;     
    return this; 
  }

  public resetActiveTextBuffers() {
    this.activePromptReply = null;
    this.activeCharacterPromptReply = null;
    return this;
  }
}

export class AvatarStatsDisplay {
  public currentHealth: number = 100;
  public currentLevel: number = 1;
  public currentExperience: number = 0;
  public experienceTotalRequired: number = 100;

  constructor() {}
}

@Component({
  selector: 'app-avatar-party-display',
  templateUrl: './avatar-party-display.component.html',
  styleUrls: ['./avatar-party-display.component.css'],
})
export class AvatarPartyDisplayComponent implements OnInit, OnChanges  {
  // Received from AvatarController
  private clickCount: number = 0;

  // Bindings
  private playerAvatarDisplay: AvatarArt;
  private avatarName: string = "";
  private playerDisplayState: StringAvatarArtStatesEnum = 0;

  // Party
  private avatarName2: string = "";  
  private friendAvatarDisplay: AvatarArt;
  private friendDisplayState: StringAvatarArtStatesEnum = 0;

  // Stats
  private avatarStatsDisplay: AvatarStatsDisplay;

  // Quest
  private bardText: String = "The mountains are breezy and the wind pushes you forth.";
  @Input() public activePartyQuest?: PartyQuestData;

  // Quest events
  // Prompts may be a poem related to the character speaking
  // Or a question to the player
  public promptIterator: number = 0;
  public readonly maxPrompts: number = 3;
  public activePromptReply: string = "";
  public activeCharacterPromptReply: string = "";

  @Input() public promptList: CharacterPrompt[] = [];
  public promptReplyBuilder?: PromptReplyBuilder;

  // Set to random: Used to decide when the show next prompt 
  private clickCountTillNextPrompt: number = 3;
  
  // Sounds: TODO - put in SoundManager service
  avatarClickAudioSrc: any;
  avatarVictoryAudioSrc: any;
  avatarDeathAudioSrc: any;

  // Controllers
  avatarExperienceService: AvatarExperienceService;
    
  constructor(@Inject(AVATAR_NAME) avatarName: string,
              private avatarControllerService: AvatarControllerService)  
  {
    this.avatarName = avatarName;
    this.avatarExperienceService = avatarControllerService.getAvatarExperienceService();
    this.avatarStatsDisplay = new AvatarStatsDisplay();
    this.playerAvatarDisplay = new AvatarArt(avatarName, new Autumn());
    this.friendAvatarDisplay = new AvatarArt(this.avatarName2, new DefaultFriend());
    this.promptReplyBuilder = new PromptReplyBuilder(this.promptList, this.promptIterator, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['promptList'].currentValue !== changes['promptList'].previousValue) {
      this.reinitPromptData(this.promptList);
    }
  }

  ngOnInit(): void {
    const avatarStatsDisplay = this.avatarStatsDisplay;
    avatarStatsDisplay.currentHealth = this.avatarControllerService.getAvatarHealthService().getHealth();
    avatarStatsDisplay.currentLevel = this.avatarExperienceService.getCurrentLevel();
    avatarStatsDisplay.currentExperience = this.avatarExperienceService.getCurrentExperience();
    avatarStatsDisplay.experienceTotalRequired = this.avatarExperienceService.getExperienceTotalRequired();
  }

  ngAfterViewInit(): void {
    this.avatarClickAudioSrc = document.getElementById("click-beep");
    this.avatarVictoryAudioSrc = document.getElementById("victory");
    this.avatarDeathAudioSrc = document.getElementById("death");
  }

  public get AvatarName() {
    return this.avatarName;
  }

  public get FriendName() {
    return this.avatarName2;
  }

  public get BardText() {
    return this.bardText;
  }

  public get AvatarStats() {
    return this.avatarStatsDisplay;
  }

  public get ActiveQuestName() {
    return this.activePartyQuest?.getActiveQuestName();
  }

  public get ActivePartyNames() {
    return this.activePartyQuest?.getRegistrants();
  }

  public get ActivePrompt() {
    return this.promptList[this.promptIterator];
  }

  public get PlayerDisplayState() {
    return this.playerDisplayState;
  }

  public get PlayerAvatar() {
    return this.playerAvatarDisplay;
  }

  public get FriendAvatar() {
    return this.friendAvatarDisplay;
  }

  public handleAvatarStatsDisplay() {
    const avatarStatsDisplay = this.avatarStatsDisplay;
    avatarStatsDisplay.currentLevel = this.avatarExperienceService.getCurrentLevel();
    avatarStatsDisplay.currentExperience = this.avatarExperienceService.getCurrentExperience();
    avatarStatsDisplay.experienceTotalRequired = this.avatarExperienceService.getExperienceTotalRequired();
  }

  // TODO: Might have to put this in the controller and trigger an event instead
  public handleAvatarClicked() {
    this.avatarControllerService.handleAvatarClicked();
    this.clickCount = this.avatarControllerService.clickCount;
    
    if (this.shouldShowPartyQuestPrompt()) {
      this.promptReplyBuilder?.displayPrompt(true);
      this.promptReplyBuilder?.displayPlayerOptions(true);
    }
    this.handleAvatarStatsDisplay();
    this.updateAvatarDisplay();
    this.avatarClickAudioSrc.play();
  }

  public shouldShowPartyQuestPrompt() {
    return this.compareClickCountToPromptThreshold() && this.promptIterator < this.maxPrompts;
  }

  public handlePromptDisplay(currentClickCount: number): number {
    // TOOD: If user is done then reset
    return currentClickCount + Math.ceil(Math.random() * 20);
  }

  public nextPromptIterator(promptIterator: number): number {
    return promptIterator + 1;
  }

  public compareClickCountToPromptThreshold() {
    return this.clickCount >= this.clickCountTillNextPrompt;
  }

  public handlePromptReplyClick(choiceIndex: number) {
    window.clearTimeout(this.promptReplyBuilder?.activePromptFadeTimeout);

    this.rebuildPromptReply(choiceIndex);
    this.promptReplyBuilder?.displayPlayerPromptReply(true);
    this.promptReplyBuilder?.displayCharacterPromptReply(true);
  }

  public reinitPromptData(promptList: CharacterPrompt[]) {
    this.promptReplyBuilder?.reinitData(this.promptList);
  }

  public rebuildPromptReply(choiceIndex: number): void {
    let promptReplyBuilder = this.promptReplyBuilder;
    promptReplyBuilder?.reset(this.promptIterator, choiceIndex);    
  }

  public resetActiveTextBuffers() {
    this.promptReplyBuilder?.resetActiveTextBuffers();
  }

  public updateAvatarDisplay() {    
    if (this.avatarControllerService.isAlive()) {
      if (this.clickCount % 2 === 0) {
        this.playerDisplayState = StringAvatarArtStatesEnum.FIGHTING;
        this.bardText = "(You are out in the mountains together, looking for new adventure.)";

      } else if (this.clickCount % 3 == 0) {
        this.playerDisplayState = StringAvatarArtStatesEnum.VICTORIOUS;

        this.bardText = "(The songs tell of a tale when you defeated a wild, naked goblin together.)";
        this.avatarVictoryAudioSrc.play();
      } else {
        this.playerDisplayState = StringAvatarArtStatesEnum.DEFEATED;

        this.avatarStatsDisplay.currentHealth = this.avatarControllerService.getAvatarHealthService().changeHealth(-5);
        this.avatarDeathAudioSrc.play();

        if (this.avatarControllerService.getAvatarHealthService().healthIsBelowZero()) {
          this.playerDisplayState = StringAvatarArtStatesEnum.DEAD;

          this.bardText = "(You both faded from history, alas defeated by a wild, naked goblin.)";
          this.avatarControllerService.alive = false;
        }
      }
    }
  }
}
