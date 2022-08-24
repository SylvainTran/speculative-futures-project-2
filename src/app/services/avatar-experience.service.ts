import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SaveDataService } from './save-data-service';

@Injectable({
  providedIn: 'root'
})
export class AvatarExperienceService {
  private currentLevel: number = 1;
  private currentExperience: number = 0;
  private experienceTotalRequired: number = 100;
  private experienceDataToJSON: Object | undefined;

  // Event bus
  private levelUpSource = new Subject<any>();
  levelUpSource$ = this.levelUpSource.asObservable();

  constructor(
    private saveDataService: SaveDataService
  ) {
    this.loadFromLocalStorage();
  }
  // getters
  public get CurrentLevel() {
    return this.currentLevel;
  }
  public get CurrentExperience() {
    return this.currentExperience;
  }
  public get ExperienceTotalRequired() {
    return this.experienceTotalRequired;
  }
  public get ExperienceDataToJSON() {
    return this.experienceDataToJSON;
  }
  // Setters
  public set CurrentLevel(value: number) {
    this.currentLevel = value;
  }
  public set CurrentExperience(value: number) {
    this.currentExperience = value;
  }
  public set ExperienceTotalRequired(value: number) {
    this.experienceTotalRequired = value;
  }

  public handleLevel(clickCount: number) {
    this.currentExperience += clickCount;
    
    if (this.currentExperience >= this.experienceTotalRequired) {
      ++this.currentLevel;
      this.experienceTotalRequired *= 2;  
      this.levelUpSource.next(this.currentLevel);
      this.currentExperience = 0;
      this.saveDataService.saveExperienceData(this.currentLevel, this.currentExperience, this.experienceTotalRequired);
    }
  }

  public loadFromLocalStorage() {
    let result: any = this.saveDataService.loadExperienceData();

    if (result) {
      this.currentLevel = result.currentLevel;      
      this.currentExperience = result.currentExperience;
      this.experienceTotalRequired = result.experienceTotalRequired;
    }
  }
}
