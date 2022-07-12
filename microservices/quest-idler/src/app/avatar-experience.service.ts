import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarExperienceService {
  private currentLevel: number = 1;
  private currentExperience: number = 0;
  private experienceTotalRequired: number = 100;

  constructor() {}
  
  public getCurrentLevel() {
    return this.currentLevel;
  }
  public getCurrentExperience() {
    return this.currentExperience;
  }
  public getExperienceTotalRequired() {
    return this.experienceTotalRequired;
  }
  public handleLevel(clickCount: number) {
    this.currentExperience += clickCount;
    
    if (this.currentExperience >= this.experienceTotalRequired) {
      ++this.currentLevel;
      this.experienceTotalRequired *= 2;  
      this.currentExperience = 0;    
      alert("Level up!");
      console.log("LEVEL UP!");
    }
  }
}
