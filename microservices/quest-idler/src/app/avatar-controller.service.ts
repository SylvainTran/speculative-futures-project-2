import { Injectable } from '@angular/core';
import { AvatarExperienceService } from './avatar-experience.service';
import { AvatarHealthService } from './avatar-health.service';
import { QuestService } from './quest.service';

@Injectable({
  providedIn: 'root'
})
export class AvatarControllerService {
  // The click count is used to increment experience
  // in the avatar experience service
  clickCount: number = 0;
  alive: boolean = true;
  // Composition
  private avatarExperienceService: AvatarExperienceService;
  private avatarHealthService: AvatarHealthService;
  private questService: QuestService;

  constructor(
    avatarExperienceService: AvatarExperienceService, 
    avatarHealthService: AvatarHealthService,
    questService: QuestService) 
  {
    this.avatarExperienceService = avatarExperienceService;
    this.avatarHealthService = avatarHealthService;
    this.questService = questService;
  }

  public getAvatarExperienceService() {
    return this.avatarExperienceService;
  }

  public getAvatarHealthService() {
    return this.avatarHealthService;
  }

  public isAlive() {
    return this.alive;
  }

  // TOOD: special click combos / rhythm patterns
  public handleAvatarClicked() {
    console.log("Avatar clicked");
    if (this.isAlive()) {
      this.clickCount += 10 + 1 + Math.floor(Math.random() * 3);
      this.avatarExperienceService.handleLevel(this.clickCount);  
    }
  }
}
