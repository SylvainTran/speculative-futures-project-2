import { Injectable } from '@angular/core';
import { SaveDataService } from './save-data-service';

@Injectable({
  providedIn: 'root'
})
export class AvatarHealthService {
  private health: number = 100;

  constructor(private saveDataService: SaveDataService) {
    this.loadFromLocalStorage();
  }

  public get Health() {
    return this.health;
  }

  public set Health(value: number) {
    this.health = value;
  }

  public changeHealth(value: number) {
    this.health += value;
    this.saveDataService.saveHealthData(this.health);
    return this.health;
  }
  
  public healthIsBelowZero() {
    return this.health <= 0;
  }

  public loadFromLocalStorage() {
    let healthResult = this.saveDataService.loadHealthData();

    if (healthResult !== null) {
      this.health = healthResult.health;
    }
  }
}
