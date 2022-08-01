import { AfterContentInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AvatarControllerService } from '../services/avatar-controller.service';
import { Character } from '../services/character';
import { CharacterDatabaseService } from '../services/character-database.service';
import { Friendship, FriendshipLevels } from '../services/friendship';
import { Player } from '../services/player';
import { PartyQuestData, QuestPartyService, QuestStates } from '../services/quest-party.service';


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
  
  constructor(private avatarControllerService: AvatarControllerService, private questPartyService: QuestPartyService, private characterDatabaseService: CharacterDatabaseService) {}

  ngAfterContentInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    const obs = {
      next: (partyQuestData: PartyQuestData) => {
        this.resetPromptList();
        this.updatePartyData(partyQuestData);
        this.updatePartyModeActive(partyQuestData);
        this.updatePartyQuestDisplay(partyQuestData);
      },
      error: (err: Error) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };
    this.partyQuestSub = this.questPartyService.partyQuestDataSource$.subscribe(obs);
  }

  ngOnDestroy(): void {
    this.partyQuestSub.unsubscribe();
  }

  public restartGame() {
    console.log("restarting game");
    this.avatarControllerService.setIsAlive(true);
    this.avatarControllerService.getAvatarHealthService().setHealth(100);    
  }

  public handleStartGame() {
    let src: any = document.getElementById("bard-of-diegesia-song");
    src?.play();
  }

  public resetPromptList() {
    this.promptList = [];
  }

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

  public updatePartyModeActive(partyQuestData: PartyQuestData) {
    this.partyModeActive = true;
    this.showPartyButton = true;
  }

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
}
