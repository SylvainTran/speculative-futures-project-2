import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ScheduledEvent } from './services/scheduled-event';
import { AvatarControllerService } from './services/avatar-controller.service';
import { Player } from './services/player';
import { CharacterDatabaseService, ConversationNode } from './services/character-database.service';
import { Friendship } from './services/friendship';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'quest-idler';
  currentTime: string | undefined;
  scheduledEvents: ScheduledEvent[] = [];

  // State control
  playerRef: Player | undefined;
  mainActivityActive: boolean = true;
  activeActivity: string = "";
  showFiller = false;

  // Apps/activities display
  friendListVisible: boolean = false;
  messageCenterVisible: boolean = false;
  showDarkwebTrojan: boolean = true;
  investigationFormVisible: boolean = false;
  showTodoApp: boolean = true;
  showGalleryApp: boolean = true;
  showSettingsActivity: boolean = true;
  showNewsApp: boolean = true;
  showBibleApp: boolean = true;

  constructor(private avatarControllerService: AvatarControllerService, private characterDatabaseService: CharacterDatabaseService) {
    this.playerRef = new Player("Autumn");
    // Subscribe to db loaded event source
    this.characterDatabaseService.databaseLoadedEventSource.subscribe({
      next: (c: ConversationNode[]) => this.setupPlayer(c),
      error: (err: Error) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification') // this unsubscribes as well
    });
  }

  ngAfterViewInit(): void {
  }
  
  ngOnInit(): void {
    this.currentTime = new Date().toISOString();
  }

  public setupPlayer(conversationNodes: ConversationNode[]) {
    // Once the character database has all the data,
    // add all the characters' relationships (vs. player) and their prompts
    this.setupPlayerFriendships(conversationNodes);
    this.addFriendshipConversations();
  }

  public setupPlayerFriendships(conversationNodes: ConversationNode[]) {

    this.characterDatabaseService.conversationNodes.forEach(conversationNode => {

      if (!this.playerRef?.friendsMap.has(conversationNode.characterB.name)) {
        this.playerRef?.friendsMap.set(conversationNode.characterB.name, new Friendship(this.playerRef, conversationNode.characterB));
      }
    });
  }

  public addFriendshipConversations() {
    this.playerRef?.friendsMap.forEach(friendship => {
      friendship.setupFriendshipsData(this.characterDatabaseService);
    });
  }

  // public restartGame() {
  //   console.log("restarting game");
  //   this.avatarControllerService.clickCount = 0;
  //   this.avatarControllerService.setIsAlive(true);
  //   this.avatarControllerService.getAvatarHealthService().setHealth(100);    
  // }

  // Getters
  public get CharacterDatabaseService() {
    return this.characterDatabaseService;
  }

  public setFriendListVisible(value: boolean) : void {
    this.friendListVisible = value;
    const container = document.getElementById("meta-friend-list-tag");
    if(container) container.focus();
  }

  public setMessageCenterVisible(value: boolean) : void {
    this.messageCenterVisible = value;
    const container = document.getElementById("meta-message-center-tag");
    if(container) container.focus();
  }

  public setInvestigationFormVisible(value: boolean): void {
    this.investigationFormVisible = value;
  }

  public updatePlayerRef(evt: Player) {
    this.playerRef = evt;
  }

  public launchActivity(appID: string): void {
    console.log("Launching activity: " + appID);
    this.mainActivityActive = false;
    this.activeActivity = appID;
    //this.disableKeyDownEvents(['Evening-in-the-Promised-Land', 'UpperCanvas', 'GameVideo', 'GameCanvas']);
  }

  public returnToMainActivity() {
    this.mainActivityActive = true;
    this.activeActivity = "mainActivity";
    location.reload();
  }

  public disableKeyDownEvents(ids: string[]) {

    ids.forEach ((id: string) => {
      let noInteracts = document.getElementById(id);

      if (noInteracts) {
        noInteracts.addEventListener("keydown", function(e) {
          e.preventDefault();
          return false;
        }, true);
        noInteracts.addEventListener("click", function(e) {
          e.preventDefault();
          return false;
        }, true);
      }  
    })
  }
}
