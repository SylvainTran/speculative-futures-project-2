import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarHealthService {
  private health: number = 100;

  constructor() {}

  public getHealth() {
    return this.health;
  }

  public setHealth(value: number) {
    this.health = value;
  }

  public changeHealth(value: number) {
    this.health += value;
    return this.health;
  }
  
  public healthIsBelowZero() {
    return this.health <= 0;
  }
}
