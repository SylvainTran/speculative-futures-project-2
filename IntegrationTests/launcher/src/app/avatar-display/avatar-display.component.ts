import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AVATAR_NAME } from '../app.module';
import { AvatarControllerService } from '../services/avatar-controller.service';
import { ConversationSession, FriendCallerService } from '../services/friend-caller.service';

@Component({
  selector: 'app-avatar-display',
  templateUrl: './avatar-display.component.html',
  styleUrls: ['./avatar-display.component.css'],
})
export class AvatarDisplayComponent implements OnInit, AfterViewInit {
  // Received from AvatarController
  private clickCount: number = 0;

  // Bindings
  private avatar: String = "(._.)";
  private avatarName: String = "";
  private enemyPlaceholder: String = "The mountains are breezy and the wind pushes you forth.";
  private location: String = "//\\//\\";
  private locationName: String = "Mountains of Uncertainty 1-1";
  private sun: any;
  // private gameCanvas: HTMLCanvasElement;
  // private ctx: CanvasRenderingContext2D;

  public currentHealth: number = 100;
  public currentLevel: number = 1;
  public currentExperience: number = 0;
  public experienceTotalRequired: number = 100;

  // Video game poetry experiment
  friendPrivateMessagesSub: Subscription;
  poems: String[] = [];

  // Services
  private avatarControllerService: AvatarControllerService;
  
  constructor(@Inject(AVATAR_NAME) 
              avatarName: string,
              avatarControllerService: AvatarControllerService,
              private friendCallerService: FriendCallerService) 
  {
    this.avatarName = avatarName;
    this.avatarControllerService = avatarControllerService;

    const obs = {
      next: (conversationSession: ConversationSession) => this.updateVideoGamePoetry(conversationSession),
      error: (err: Error) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };
    this.friendPrivateMessagesSub = this.friendCallerService.friendPrivateMessageSource$.subscribe(obs);
    // this.gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    // this.ctx = this.gameCanvas.getContext('2d') as CanvasRenderingContext2D ;
  }
  ngAfterViewInit(): void {
    // Canvas 
    // Let us chase the sun together
    // this.sun = new Image();
    // this.sun.src = '../assets/sunbg.png';
    // window.requestAnimationFrame(this.draw);
  }

  ngOnInit(): void {
    this.currentHealth = this.avatarControllerService.getAvatarHealthService().getHealth();

    let aes = this.avatarControllerService.getAvatarExperienceService();
    this.currentLevel = aes.getCurrentLevel();
    this.currentExperience = aes.getCurrentExperience();
    this.experienceTotalRequired = aes.getExperienceTotalRequired();
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
    // TODO Replace by events
    this.avatarControllerService.handleAvatarClicked();
    this.clickCount = this.avatarControllerService.clickCount;
    this.currentLevel = this.avatarControllerService.getAvatarExperienceService().getCurrentLevel();
    this.currentExperience = this.avatarControllerService.getAvatarExperienceService().getCurrentExperience();
    this.experienceTotalRequired = this.avatarControllerService.getAvatarExperienceService().getExperienceTotalRequired();
    this.updateAvatarDisplay();
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
      } else {
        this.avatar = "<(*_*)> <( ... )";
        this.enemyPlaceholder = "(You faded from history, alas defeated by a wild, naked goblin.)";
        this.currentHealth = this.avatarControllerService.getAvatarHealthService().changeHealth(-5);
        if(this.avatarControllerService.getAvatarHealthService().healthIsBelowZero()) {
          this.avatar = "(RIP) <( Has Died. )";
          this.avatarControllerService.alive = false;
        }
      }
    }
  }

  // Experimental poetry
  public updateVideoGamePoetry(conversationSession: ConversationSession) {
    let conversationTextIndex = 0;

    let chatInterval = setInterval( () => {

      console.log("Console text index : " + conversationTextIndex + " , conversation end index: " + conversationSession.conversationEndIndex);
      
      if (conversationTextIndex >= conversationSession.conversationEndIndex) {
        clearInterval(chatInterval);
        // End conversation
        conversationSession.endConversation();
        return;
      }

      const dialogueNode = conversationSession.conversationTexts[conversationTextIndex++];
      this.poems.push(dialogueNode);

    }, 1000 * Math.ceil(Math.random() * 5));  
  }

  draw() {
    // this.ctx.drawImage(this.sun, 0, 0, 400, 400);
    // window.requestAnimationFrame(this.draw);
    // console.log("Drawing" + this.gameCanvas);
  }
}
