import { Component, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AvatarControllerService } from '../services/avatar-controller.service';
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
export class QuestIdlerComponent implements OnInit, OnChanges, OnDestroy {

  title = 'quest-idler';
  playerRef: Player;

  partyQuestSub!: Subscription; 
  partyModeActive: boolean = false;
  showPartyMode: boolean = false;
  showPartyButton: boolean = true;
  activePartyQuest?: PartyQuestData; // 2-way bound
  @Output() promptList: CharacterPrompt[] = [];

  constructor(private avatarControllerService: AvatarControllerService, private questPartyService: QuestPartyService) {
    this.playerRef = new Player("Player");
    // TODO: match data with called friend target and friendship level
    const testRoadPoemPrompt = new RoadPoemPrompt(0, undefined, ["Thine words share the same spit as mine.", "Malarkey!", "..."], ["We are one in this thought.", "Thunder bolt with your house!", "Your silence is highly eerie."]);
    const testRoadPoemPrompt2 = new RoadPoemPrompt(0, "The clerksmen of heaven must be unconcerned to us.", ["Tis' a possibility.", "Nay.", "..."], ["It is only one of many possibilities.", "And why not?", "..."]);
    const testRoadPoemPrompt3 = new RoadPoemPrompt(0, "You being here with me made my day better. If only just for this sun. So, Thank you for that.", ["It goes both ways."], undefined);

    this.promptList.push(testRoadPoemPrompt);
    this.promptList.push(testRoadPoemPrompt2);
    this.promptList.push(testRoadPoemPrompt3);        
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    const obs = {
      next: (partyQuestData: PartyQuestData) => {
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
    this.avatarControllerService.clickCount = 0;
    this.avatarControllerService.setIsAlive(true);
    this.avatarControllerService.getAvatarHealthService().setHealth(100);    
  }

  public handleStartGame() {
    let src: any = document.getElementById("bard-of-diegesia-song");
    src?.play();
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

      // TODO: Increment friendship levels      
    }
  }

  public updatePartyQuestDisplay(partyQuestData: PartyQuestData) {
    this.activePartyQuest = partyQuestData;    
  }

  public readDatabase() {
    
  }
}
