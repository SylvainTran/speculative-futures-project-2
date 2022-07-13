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

  constructor() {
    this.loadExperienceData();
  }
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
      this.levelUpSource.next(this.currentLevel);
      this.saveExperienceData();
      this.currentExperience = 0;        
    }
  }

  public saveExperienceData() {
    const experienceDataToJSON = {
      "currentLevel": this.currentLevel,
      "currentExperience": this.currentExperience,
      "experienceTotalRequired": this.experienceTotalRequired
    };
    window.localStorage.setItem("com.soberfoxgames.questidler.experienceData", JSON.stringify(experienceDataToJSON));
  }

  public loadExperienceData() {
    let storedExperienceData: any = window.localStorage.getItem("com.soberfoxgames.questidler.experienceData");
    
    if (storedExperienceData !== null) {
      const result = JSON.parse(storedExperienceData);

      this.currentLevel = parseInt(result.currentLevel);      
      this.currentExperience = parseInt(result.currentExperience);
      this.experienceTotalRequired = parseInt(result.experienceTotalRequired);

    } else {
      this.currentLevel = 1;
      this.currentExperience = 0;
      this.experienceTotalRequired = 100;
    }
  }
}
