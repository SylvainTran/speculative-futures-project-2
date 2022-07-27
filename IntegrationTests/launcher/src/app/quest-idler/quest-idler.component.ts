import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AvatarControllerService } from '../services/avatar-controller.service';
import { Player } from '../services/player';
import { PartyQuestData, QuestPartyService } from '../services/quest-party.service';

@Component({
  selector: 'app-quest-idler',
  templateUrl: './quest-idler.component.html',
  styleUrls: ['./quest-idler.component.css']
})
export class QuestIdlerComponent implements OnInit, OnDestroy {

  title = 'quest-idler';
  playerRef: Player;

  partyQuestSub: Subscription; 
  partyModeActive: boolean = false;
  showPartyMode: boolean = false;
  showPartyButton: boolean = true;
  @Output() activePartyQuest?: PartyQuestData; 

  constructor(private avatarControllerService: AvatarControllerService, private questPartyService: QuestPartyService) {
    this.playerRef = new Player("Player");
    const obs = {
      next: (partyQuestData: PartyQuestData) => this.updatePartyModeActive(partyQuestData),
      error: (err: Error) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };
    this.partyQuestSub = this.questPartyService.partyQuestDataSource$.subscribe(obs);
  }

  ngOnInit(): void {
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
    this.updatePartyQuestDisplay(partyQuestData);
  }

  public acceptPartyRequest() {
    this.showPartyMode = true;
    this.showPartyButton = false;
    this.handleStartGame();
  }

  public updatePartyQuestDisplay(partyQuestData: PartyQuestData) {
    this.activePartyQuest = partyQuestData;    
  }
}
