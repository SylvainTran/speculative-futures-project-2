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

  constructor(
    private avatarExperienceService: AvatarExperienceService, 
    private avatarHealthService: AvatarHealthService,
  ) 
  {
    this.avatarExperienceService = avatarExperienceService;
    this.avatarHealthService = avatarHealthService;
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

  public setIsAlive(value: boolean) {
    this.alive = value;
  }

  // TOOD: special click combos / rhythm patterns
  public handleAvatarClicked() {
    console.log("Avatar clicked");
    if (this.isAlive()) {
      ++this.clickCount;
      this.avatarExperienceService.handleLevel(this.clickCount);  
    }
  }
}
