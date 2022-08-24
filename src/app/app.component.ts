import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ScheduledEvent } from './services/scheduled-event';
import { AvatarControllerService } from './services/avatar-controller.service';
import { Player } from './services/player';
import { CharacterDatabaseService, ConversationNode } from './services/character-database.service';
import { Friendship } from './services/friendship';
import { MainQuestService, SMSQUEST_GameEventObject, SMS_CLASS } from './services/main-quest.service';

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

  // Windows display
  friendListVisible: boolean = false;
  messageCenterVisible: boolean = false;
  investigationFormVisible: boolean = false;
  public smsWindowVisible: boolean = false;

  // Apps display
  showTodoApp: boolean = true;
  showGalleryApp: boolean = true;
  showSettingsActivity: boolean = true;
  showNewsApp: boolean = true;
  showBibleApp: boolean = true;
  smsNotificationSoundSrc: any;
  postItCornerSrc: any;
  postitTextSrc: any;

  constructor(
    private avatarControllerService: AvatarControllerService, 
    private characterDatabaseService: CharacterDatabaseService, 
    private mainQuestService: MainQuestService) {
    this.playerRef = new Player("Cyfer");
    // Subscribe to db loaded event source
    this.characterDatabaseService.databaseLoadedEventSource.subscribe({
      next: (c: ConversationNode[]) => this.setupPlayer(c),
      error: (err: Error) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification') // this unsubscribes as well
    });

    this.mainQuestService.TRIGGER_SMS_EVENT$.subscribe({
      next: (eventKey) => this.handleSMSPopUp(eventKey)
    });
    this.smsNotificationSoundSrc = document.getElementById('smsNotification');
  }

  ngAfterViewInit(): void {
    // Post-it handler
    this.postItCornerSrc = document.getElementById('postit-corner');
    this.postitTextSrc = document.getElementById('postit-text');
    this.attachPostItCornerHandlers();
  }
  
  ngOnInit(): void {
    this.currentTime = new Date().toISOString();
    const year = [parseInt(this.currentTime.charAt(1))];
    const newValue = year[0] + 1;
    let newTimeStamp = this.currentTime.substring(0, 1) + newValue + this.currentTime.substring(2);
    this.currentTime = newTimeStamp;
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

  public setSmsWindowVisible(value: boolean): void {
    this.smsWindowVisible = value;
  }

  public updatePlayerRef(evt: Player) {
    this.playerRef = evt;
  }

  public launchActivity(appID: string): void {
    console.log("Launching activity: " + appID);
    this.mainActivityActive = false;
    this.activeActivity = appID;
  }

  public handleSMSPopUp(data: SMS_CLASS) {
    const g: SMSQUEST_GameEventObject = this.mainQuestService.progressionHashMap.get(data.eventKey) as SMSQUEST_GameEventObject;
    if (g === undefined) {
      return;
    }

    let completed: string[] = this.mainQuestService.getSMSEventsCompleted();
    let satisfiedPreconditions = g.prerequisiteEventKeys.length === 0 || g.prerequisiteEventKeys.every( (key) => completed.includes(key) );
    if (g.success || !satisfiedPreconditions) {
      return;
    }
    this.smsWindowVisible = true;
    this.smsNotificationSoundSrc.play();
  }

  public returnToMainActivity() {
    // this.mainActivityActive = true;
    // this.activeActivity = "mainActivity";
    // this.showTodoApp = false;
    // this.showGalleryApp = false;
    // this.showSettingsActivity = false;
    // this.showNewsApp = false;
    // this.showBibleApp = false;
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

  keywordsCheatsheet: string[] = ["neptunia", "gridania", "1-74-10"];
  postItIterator: number = 0;
  public attachPostItCornerHandlers() {
    this.postItCornerSrc.addEventListener("click", () => { 
      this.postitTextSrc.innerHTML = this.keywordsCheatsheet[this.postItIterator++]; 
      if (this.postItIterator >= this.keywordsCheatsheet.length) {
        this.postItIterator = 0;
      }
    });
  }
}
