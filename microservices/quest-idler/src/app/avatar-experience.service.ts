import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarExperienceService {
  private currentLevel: number = 1;
  private currentExperience: number = 0;
  private experienceTotalRequired: number = 100;

  // Event bus
  private levelUpSource = new Subject<any>();
  levelUpSource$ = this.levelUpSource.asObservable();

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
      this.levelUpSource.next(this.currentLevel);
      console.log("LEVEL UP!");
    }
  }
}
