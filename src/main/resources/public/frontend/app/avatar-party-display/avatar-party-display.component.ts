import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AVATAR_NAME } from '../app.module';
import { CharacterPrompt } from '../quest-idler/quest-idler.component';
import { AvatarControllerService } from '../services/avatar-controller.service';
import { AvatarExperienceService } from '../services/avatar-experience.service';
import { PartyQuestData, QuestPartyService, QuestStates } from '../services/quest-party.service';
import { Monster } from '../services/quest.service';

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
    public IDLE = "'YOU STAND READY'",
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
  show(): void;
  buildReply(): void;
  tearDown(): void;
  reinitData(promptList: CharacterPrompt[]): void;
  reset(promptIterator: number, choiceIndex: number): void;
}

// Of course the builder is impure
class PromptReplyBuilder implements PromptBuilder {
  // Controls
  showPlayerOptions: boolean = false;
  showPlayerPromptReply: boolean = false;
  showCharacterPromptReply: boolean = false;
  showPrompt: boolean = false;

  // Data
  activePromptReply: string | null = "";
  activeCharacterPromptReply: string | null = "";
  activePromptFadeTimeout: any;
  
  // Timeouts
  promptTeardownDelay: number = 8000;
  
  // Lock for preventing multiple builds for the same prompt
  locked: boolean = false;
  
  constructor(private director: AvatarPartyDisplayComponent, private promptList: CharacterPrompt[], private promptIterator: number, private choiceIndex: number) {

  }
  
  // Re-initialize the prompt list obtained from the parent quest-idler
  reinitData(promptList: CharacterPrompt[]): void {
    this.promptList = promptList;
  }

  // Makes sure the prompt iterator and option choice index are updated
  reset(promptIterator: number, choiceIndex: number = 0): void {
    this.promptIterator = promptIterator;
    this.choiceIndex = choiceIndex;
    this.tearDown();
  }

  // Makes sure all the flags are reset to default false and null text
  // Call teardown before building a new prompt or reply
  tearDown(): void {
    this.displayPlayerOptions(false)
      .displayPlayerPromptReply(false)
      .displayCharacterPromptReply(false)
      .resetActiveTextBuffers()
      .displayPrompt(false);
  }

  // Builds the reply texts and animations that comes after clicking on
  // an option in the prompt
  buildReply(): void {
    this.displayPrompt(true)
    .setStringPromptReply(UserType.PLAYER, this.choiceIndex)
    .setStringPromptReply(UserType.FRIEND, this.choiceIndex)
    .displayPlayerPromptReply(true)
    .delayCharacterPromptReply(true)
    .hidePromptAfterDelay(false)
    .setupForNextPrompt();
  }

  // Shows the initial prompt window's state: the prompt container and
  // the player's options (not the replies that comes after clicking on an option!)
  // Also, the lock is set here because that's the first place where the prompt shows up
  /**
   * Note that the iterator deals with knowing which data
   * is proper to show at this stage. All this does is turn on the flags
   * for the *ngIf directives set in this component's templates to display the containers.
   * 
   * The location of a quest also should update after each new prompt, if there is a new one.
   */
  show(): void {
    this.displayPrompt(true)
      .displayPlayerOptions(true)
      .updateLocationBg();
  }

  public updateLocationBg() {

    if (this.director.locationBgEl) {

      const locations = this.director.activePartyQuest?.getLocations();

      console.log(locations);

      if (locations && this.promptIterator < locations.length) {
        this.director.activeLocation = locations[this.promptIterator];
        this.director.locationBgEl.style.backgroundImage = "url(" + this.director.assetPathPrefix + this.director.activeLocation + ")";
      }
    }
  }

  public displayPlayerOptions(value: boolean) {
    this.showPlayerOptions = value;
    return this;
  }

  public displayPlayerPromptReply(value: boolean) {
    this.showPlayerPromptReply = value;
    return this; 
  }

  // Sets the prompt reply of the player and friend following the selection of an option
  public setStringPromptReply(userType: UserType, choiceIndex: number) {
    if (userType === UserType.PLAYER) {
      const playerOptions = this.promptList[this.promptIterator].getPlayerOptions();
      if (playerOptions !== undefined) {
        this.activePromptReply = playerOptions[choiceIndex];
      }
    } else {
      const characterOptions = this.promptList[this.promptIterator].getCharacterOptions();
      if (characterOptions !== undefined) {
        this.activeCharacterPromptReply = characterOptions[choiceIndex];
      }
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

  // This function does three things after a timeout:
  // 1. Sets the lock to false to allow clicks again
  // 2. Advances the prompt iterator
  // 3. Validates the quest state
  public setupForNextPrompt() {
    setTimeout( () => {
      this.unlock()
        .advancePromptIterator()
        .validateQuestState(QuestStates.SUCCESS);
    }, this.promptTeardownDelay);
  }

  public hidePromptAfterDelay(value: boolean) {
    this.activePromptFadeTimeout = setTimeout(() => {
      this.displayPrompt(value);
    }, this.promptTeardownDelay);
    return this;
  }

  // Signals the parent that the prompt/quest is ended, do whatever follows next
  public validateQuestState(state: QuestStates) {
    // Temp - end quest regardless of quest state if prompts are done
    if (!this.director.promptIteratorIsLessThanMaxPrompts()) {
      // emit event end quest, partyModeActive && showPartyMode set to false in parent quest-idler component
      if (this.director.monsterIterator >= this.director.activePartyQuestMonsters.length) {
        this.director.monstersAllDefeated = true;
        this.director.triggerPartyQuestEnded(state);
      }
    }
    return this;
  }

  public advancePromptIterator() {
    this.promptIterator = this.nextPromptIterator(this.promptIterator);
    this.director.PromptIterator = this.promptIterator;
    return this;
  }

  public nextPromptIterator(promptIterator: number): number {
    return promptIterator + 1;
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

  public lock() {
    this.Lock = true;
    return this;
  }

  public unlock() {
    this.Lock = false;
    return this;
  }

  public set Lock(value: boolean) {
    this.locked = value;
  }

  public get IsLocked() {
    return this.locked;
  }
}

export class QuestWindowBuilder {
  show: boolean = true;

  constructor(private activePartyQuest: PartyQuestData | undefined) {}

  build(): void {
    this.displayMonsters()
      .displayLoot()
      .displayEnvironment();
  }

  reinitData(partyQuestData: PartyQuestData): void {
    this.activePartyQuest = partyQuestData;
  }

  displayMonsters() {
    return this;
  }

  displayLoot() {
    return this;
  }

  displayEnvironment() {
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
  @Output() public activePartyQuestChange = new EventEmitter<PartyQuestData>(); // trigger the status flag in it to fail or success

  // Quest events
  // Prompts may be a poem related to the character speaking
  // Or a question to the player
  public promptIterator: number = 0;
  public maxPrompts: number = 1;
  public activePromptReply: string = "";
  public activeCharacterPromptReply: string = "";

  @Input() public promptList: CharacterPrompt[] = [];
  public promptReplyBuilder?: PromptReplyBuilder;

  // Quest, location and battle windows
  /**
   * TODO: This is responsible for updating the new locations
   * after each new prompt.
   * 
   * Location update: it should retrive the active key from the locations: string[]
   * by using the promptIterator. Then it updates the template with the active location.
   */
  public questWindowBuilder: QuestWindowBuilder;
  public assetPathPrefix: string = "../../assets/locations/";
  public activeLocation: string = "parallaxforest.gif"; // A path url to the active location src.
  public locationBgEl: any = document.getElementById("locationBg");
  // Set to random: Used to decide when the show next prompt 
  private clickCountTillNextPrompt: number = 3;

  // TODO: Temp
  public activePartyQuestMonsters: Monster[] = [];
  public activeMonster: Monster | undefined;
  public monsterIterator: number = 0;
  public monstersAllDefeated: boolean = false;

  // Loots
  @Input() lastLootGained?: string = "";
  
  // Sounds: TODO - put in SoundManager service
  avatarClickAudioSrc: any;
  avatarVictoryAudioSrc: any;
  avatarDeathAudioSrc: any;
  partySVGContainerSrc: any;

  // Controllers
  avatarExperienceService: AvatarExperienceService;

  // in CSS rem units:
  marginAcc: number = -34;
  screenMaxX: number = 52;
  screenMinX: number = -34;
    
  constructor(@Inject(AVATAR_NAME) avatarName: string,
              private avatarControllerService: AvatarControllerService,
              private questPartyService: QuestPartyService)  
  {
    this.avatarName = avatarName;
    this.avatarExperienceService = avatarControllerService.getAvatarExperienceService();
    this.playerAvatarDisplay = new AvatarArt(avatarName, new Autumn());
    this.friendAvatarDisplay = new AvatarArt(this.avatarName2, new DefaultFriend());

    // TODO: dependency injection
    this.avatarStatsDisplay = new AvatarStatsDisplay();
    this.promptReplyBuilder = new PromptReplyBuilder(this, this.promptList, this.promptIterator, 0);
    this.questWindowBuilder = new QuestWindowBuilder(this.activePartyQuest);  
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['promptList'].currentValue !== changes['promptList'].previousValue) {
      this.reinitPromptData(changes['promptList'].currentValue);
      this.maxPrompts = changes['promptList'].currentValue.length;
    }
    if (changes['activePartyQuest'].currentValue !== changes['activePartyQuest'].previousValue) {
      this.reinitActivePartyQuestData(changes['activePartyQuest'].currentValue);
      const data = this.activePartyQuest?.getQuestData().monsters;
      
      // This is just an object rn
      this.activePartyQuestMonsters = [];
      data?.forEach(monster => {
        this.activePartyQuestMonsters.push(new Monster(monster));
      });
      this.monsterIterator = 0;
      this.activeMonster = this.activePartyQuestMonsters[this.monsterIterator];
    }
  }

  ngOnInit(): void {
    const avatarStatsDisplay = this.avatarStatsDisplay;
    avatarStatsDisplay.currentHealth = this.avatarControllerService.getAvatarHealthService().Health;
    avatarStatsDisplay.currentLevel = this.avatarExperienceService.CurrentLevel;
    avatarStatsDisplay.currentExperience = this.avatarExperienceService.CurrentExperience;
    avatarStatsDisplay.experienceTotalRequired = this.avatarExperienceService.ExperienceTotalRequired;
  }

  ngAfterViewInit(): void {
    this.avatarClickAudioSrc = document.getElementById("click-beep");
    this.avatarVictoryAudioSrc = document.getElementById("victory");
    this.avatarDeathAudioSrc = document.getElementById("death");
    this.locationBgEl = document.getElementById("locationBg");
    this.partySVGContainerSrc = document.getElementById("party-svgs");
  }

  // Getters
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

  // Setters
  public set PromptIterator(value: number) {
    this.promptIterator = value;
  }

  public set ClickCountToPromptThreshold(value: number) {
    this.clickCountTillNextPrompt = value;
  }

  public handleAvatarStatsDisplay() {
    const avatarStatsDisplay = this.avatarStatsDisplay;
    avatarStatsDisplay.currentLevel = this.avatarExperienceService.CurrentLevel;
    avatarStatsDisplay.currentExperience = this.avatarExperienceService.CurrentExperience;
    avatarStatsDisplay.experienceTotalRequired = this.avatarExperienceService.ExperienceTotalRequired;
  }

  // TODO: Might have to put this in the controller and trigger an event instead
  public handleAvatarClicked(evt: MouseEvent): void {

    const prompt = this.promptReplyBuilder;

    if (prompt?.IsLocked) {
      return;
    }

    this.avatarControllerService.handleAvatarClicked();
    this.clickCount = this.avatarControllerService.clickCount;

    // Animate party svg
    this.animatePartySVG();

    // Attacks monsters
    if (this.activePartyQuestMonsters !== undefined && this.activePartyQuest) {
      // Damage
      if (this.monsterIterator < this.activePartyQuestMonsters.length) {

        if (this.activeMonster) {

          if (this.activeMonster.hp > 0) {
            this.activeMonster.damage(this.activePartyQuest.getRegistrants());
          } else {
            // Award random loot
            this.questPartyService.monsterDeathEventSource.next(this.activeMonster);
            this.monsterIterator++;
            this.activeMonster = this.activePartyQuestMonsters[this.monsterIterator];
            const finisher = Math.random() * 100 > 50? this.ActivePartyNames![0].name : this.ActivePartyNames![1].name;
            this.bardText = finisher + " dealt the vanquishing blow!";
            console.log("The monster was defeated");
          }
          // We may have just killed the last monster
          prompt?.validateQuestState(QuestStates.SUCCESS);
        }
      } else {
        this.bardText = "With all the monsters defeated, they had more time to spent together.";
        console.log("All quest monsters were defeated.");
        this.monstersAllDefeated = true;
        prompt?.validateQuestState(QuestStates.SUCCESS);
      }
    }
    
    if (this.shouldShowPartyQuestPrompt()) {
      if (prompt) {
        prompt.lock();
        prompt.tearDown();
        prompt.show();        
      }
    }
    this.handleAvatarStatsDisplay();
    this.updateAvatarDisplay();
    this.avatarClickAudioSrc.play();
  }

  private animatePartySVG() {
    this.partySVGContainerSrc.style.marginLeft = `${this.marginAcc++}rem`;
    if (this.marginAcc > this.screenMaxX) {
      this.marginAcc = this.screenMinX;
    }
  }

  public shouldShowPartyQuestPrompt() {
    return this.compareClickCountToPromptThreshold() && this.promptIteratorIsLessThanMaxPrompts() && this.promptIsNotLocked();
  }

  public getNextClickCountToPromptThreshold(currentClickCount: number) {
    return currentClickCount + Math.ceil(Math.random() * 20);
  }

  public compareClickCountToPromptThreshold() {
    return this.clickCount >= this.clickCountTillNextPrompt;
  }

  public promptIteratorIsLessThanMaxPrompts() {
    return this.promptIterator < this.maxPrompts;
  }

  public promptIsNotLocked() {
    return !this.promptReplyBuilder?.IsLocked;
  }

  public handlePromptReplyClick(choiceIndex: number) {
    this.rebuildPromptReply(choiceIndex);
    this.ClickCountToPromptThreshold = this.getNextClickCountToPromptThreshold(this.clickCount);
  }

  public reinitPromptData(promptList: CharacterPrompt[]) {
    this.promptReplyBuilder?.reinitData(promptList);
  }

  public reinitActivePartyQuestData(partyQuestData: PartyQuestData) {
    this.questWindowBuilder?.reinitData(partyQuestData);
  }

  public rebuildPromptReply(choiceIndex: number): void {
    let promptReplyBuilder = this.promptReplyBuilder;
    promptReplyBuilder?.reset(this.promptIterator, choiceIndex);
    promptReplyBuilder?.buildReply();
  }

  public updateAvatarDisplay() {    
    if (this.avatarControllerService.isAlive()) {
      if (this.clickCount % 2 === 0) {
        this.playerDisplayState = StringAvatarArtStatesEnum.FIGHTING;

      } else if (this.clickCount % 3 == 0) {
        this.playerDisplayState = StringAvatarArtStatesEnum.VICTORIOUS;
        this.avatarVictoryAudioSrc.play();
      } else {
        this.playerDisplayState = StringAvatarArtStatesEnum.DEFEATED;

        this.avatarStatsDisplay.currentHealth = this.avatarControllerService.getAvatarHealthService().changeHealth(-5);
        if (this.avatarStatsDisplay.currentHealth <= 0) {
          this.avatarStatsDisplay.currentHealth = 0;
        }
        this.avatarDeathAudioSrc.play();

        if (this.avatarControllerService.getAvatarHealthService().healthIsBelowZero()) {
          this.playerDisplayState = StringAvatarArtStatesEnum.DEAD;
          this.avatarControllerService.alive = false;
        }
      }
    }
  }

  public triggerPartyQuestEnded(state: QuestStates) {
    if (this.activePartyQuest) {
      this.promptIterator = 0;
      this.maxPrompts = 1;
      this.activePartyQuest.SetQuestStatus = state;
      this.activePartyQuestChange.emit(this.activePartyQuest);
    } else {
      console.log("activePartyQuest error");
    }
  }
}
