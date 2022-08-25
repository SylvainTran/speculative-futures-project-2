import { AfterContentInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { AvatarControllerService } from '../services/avatar-controller.service';
import { CharacterDatabaseService } from '../services/character-database.service';
import { Friendship } from '../services/friendship';
import { Player } from '../services/player';
import { PartyQuestData, QuestPartyService, QuestStates } from '../services/quest-party.service';
import { Monster } from '../services/quest.service';


export abstract class CharacterPrompt {  
  constructor(protected minimumFriendshipLevel: number = 0, 
              protected text: string = "I am a character prompt.",
              protected playerOptions?: string[],
              protected characterOptions?: string[]) 
  {}

  public getMinimumFriendshipLevel() {
    return this.minimumFriendshipLevel;
  }

  public getText() {
    return this.text;
  }

  public getPlayerOptions() {
    return this.playerOptions;
  }

  public getCharacterOptions() {
    return this.characterOptions;
  }
}

export class RoadPoemPrompt extends CharacterPrompt {
  constructor(
    minimumFriendshipLevel: number, 
    text: string = "An ice heart oft shears fiery tears.",
    playerOptions?: string[],
    characterOptions?: string[])
  {
    super(minimumFriendshipLevel, text, playerOptions, characterOptions);    
  }
}

@Component({
  selector: 'app-quest-idler',
  templateUrl: './quest-idler.component.html',
  styleUrls: ['./quest-idler.component.css']
})
export class QuestIdlerComponent implements OnInit, AfterContentInit, OnChanges, OnDestroy {

  title = 'quest-idler';
  // Player instance (w/ friend map), Characters
  @Input() playerRef: Player | undefined;
  @Output() playerRefChange = new EventEmitter<Player>();

  partyQuestSub!: Subscription; 
  partyModeActive: boolean = false;
  showPartyMode: boolean = false;
  showPartyButton: boolean = true;
  activePartyQuest?: PartyQuestData; // 2-way bound
  @Output() promptList: CharacterPrompt[] = [];

  // Shenannigans
  monsterDeathSubscription: Subscription;
  @Output() loots: Map<String, number>;
  @Output() lastLootGained: string = "";
  
  constructor(private avatarControllerService: AvatarControllerService, private questPartyService: QuestPartyService, private characterDatabaseService: CharacterDatabaseService) {

    this.monsterDeathSubscription = this.questPartyService.monsterDeathEventSource$.subscribe(
      {
        next: (monsterDefeated: any) => {
          if (monsterDefeated !== null) {
            this.calculateRandomLoot(monsterDefeated)
          }
        },
        error: (err: Error) => console.error('Observer got an error: ' + err),
        complete: () => console.log('Observer got a complete notification')      
      }
    );
    this.loots = new Map();
    this.loots.set("Training Stick", 1);
  }

  ngAfterContentInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    this.partyQuestSub = this.questPartyService.partyQuestDataSource$.subscribe({
      next: (partyQuestData: PartyQuestData) => {
        this.resetPromptList();
        this.updatePartyData(partyQuestData);
        this.updatePartyModeActive(partyQuestData);
        this.updatePartyQuestDisplay(partyQuestData);
      },
      error: (err: Error) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    });
  }

  ngOnDestroy(): void {
    this.partyQuestSub.unsubscribe();
    this.monsterDeathSubscription.unsubscribe();
  }

  public restartGame() {
    console.log("restarting game");
    this.avatarControllerService.setIsAlive(true);
    this.avatarControllerService.getAvatarHealthService().Health = 100;    
  }

  public handleStartGame() {
    let src: any = document.getElementById("bard-of-diegesia-song");
    src?.play();
  }

  public resetPromptList() {
    this.promptList = [];
  }

  /**
   * updatePartyData
   * 
   * This method updates the party quest data
   * by pushing new CharacterPrompt objects to the promptList: CharacterPrompt[]
   * This is in turn pushed down to the avatar party quest display component,
   * which updates its view with this data.
   * 
   * The way this is done currently is by retrieving the player's friendship hash map,
   * and retrieving the conversation data object from there.
   * 
   * In other words, all this method does is retriving the target friend hash key of this party quest, from the
   * player's hashmap, and using that key to to retrive the data that's already in 
   * the friendship object of the player (or the target friend actor).
   * 
   * TODO: Break this into three functions:
   * 1. WHICH FRIEND TO PARTY WITH?
   * 2. GET THAT FRIENDSHIP's DATA
   * 3. UPDATE THE PROMPT LIST OUTPUT WITH IT
   * 
   * @param partyQuestData: The JSON parsed party quest data. It should contain all the 
   * info required to create a new party quest.
   */
  public updatePartyData(partyQuestData: PartyQuestData) {
    let player = partyQuestData.getRegistrants()[0] as Player;
    let fs: Friendship | undefined = player.friendsMap.get(partyQuestData.getRegistrants()[1].name);

    if (fs) {
      for (let i = 0; i < fs.conversationData[0].partyQuestRoadPoemPrompts.length; i++) {
        const playerOptions: string[] = [];
        const optionReplies: string[] = [];
        
        // There are always two player options and replies subsequently for now
        const optionLen = environment.partyQuestPoems.minPlayerOptions;

        for(let j = i * optionLen; j < i * optionLen + optionLen; j++) {
          playerOptions.push(fs.conversationData[0].partyQuestRoadPoemPlayerOptions[j]);
          optionReplies.push(fs.conversationData[0].partyQuestOptionReplies[j]);
        }
        this.promptList.push(new RoadPoemPrompt(fs.friendshipLevel, fs.conversationData[0].partyQuestRoadPoemPrompts[i], playerOptions, optionReplies));
      }
    }
  }

  /**
   * updatePartyModeActive
   * 
   * This method sets the necessary flags for showing the party quest request html (the whole screen pop-up).
   * These variables are bound in the template of this component by *ngIf directives: 
   * (1) the party request button
   * (2) the party request pop-up
   * (3) the whole party display component
   * 
   * @param partyQuestData: The party quest data. Currently not needed?
   */
  public updatePartyModeActive(partyQuestData: PartyQuestData) {
    this.partyModeActive = true;
    this.showPartyButton = true;
  }

  /**
   * 
   * acceptPartyRequest
   * 
   * This method turns off the party request button and 
   * toggles the flag to show the party mode.
   * 
   * In other words, both the showPartyMode flag and the partyModeActive need to be true
   * for the party quest component to display.
   */
  public acceptPartyRequest() {
    this.showPartyMode = true;
    this.showPartyButton = false;
    this.handleStartGame();
  }

  public updatePartyQuestState(evt: any) {
    const activePartyQuestStatus = evt.status;
    if (activePartyQuestStatus === QuestStates.FAIL || activePartyQuestStatus === QuestStates.SUCCESS) {
      this.partyModeActive = false;
      this.showPartyMode = false;
      this.updatePartyFriendship();
    }
  }

  public updatePartyFriendship() {
    const friendName = this.activePartyQuest?.getRegistrants()[1].name;
    let friendship = (this.playerRef?.friendsMap.get(friendName as string)) as Friendship;
    if (friendship.friendshipLevel < 2) {
      friendship.increaseFriendshipLevel();
      friendship.setupFriendshipsData(this.characterDatabaseService);
      console.log("New friendship level: " + friendship.friendshipLevel);
      this.playerRefChange.emit(this.playerRef);
    } else {
      console.warn("Max friendship already reached.");
    }
  }

  public updatePartyQuestDisplay(partyQuestData: PartyQuestData) {
    this.activePartyQuest = partyQuestData;    
  }

  public calculateRandomLoot(monsterDefeated: Monster): void {
    
    const lootTableGrade = monsterDefeated.level;
    let baseProbability = 0;
    let lootTable: string[] = [];
    let lootsT1 = ["Training Stick", "Blue Dagger", "Burning Candle"]
    let lootsT2 = ["Sword of Destiny", "Emerald Bow", "Virtue of Youth"]

    if (lootTableGrade < 50) {
      baseProbability = 0.10;
      lootTable = lootsT1;
    } else if (lootTableGrade >= 50 && lootTableGrade < 100) {
      baseProbability = 0.05;
      lootTable = lootsT2;
    }

    let dice = Math.random();
    let lootIndex = Math.floor(Math.random() * lootTable?.length);

    if (dice > baseProbability) {
      let count = this.loots.get(lootTable[lootIndex])?.valueOf();
      if (count === undefined) {
        count = 1;
      } else {
        count++;
      }
      this.loots.set(lootTable[lootIndex], count);
      this.lastLootGained = lootTable[lootIndex];
      this.resetLastLootGained();
    }
  }

  public resetLastLootGained() {
    setTimeout(() => {
      this.lastLootGained = "";
    }, 4000);
  }
}
