import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Character } from './character';

// Test quest fetch API
export class Monster {

  public name: string;
  public race: string;
  public hp: number;
  public expGain: number;
  public level: number;
  public stamina: number;
  public zone: string;

  constructor(monster: Monster) {
    this.name = monster.name;
    this.race = monster.race
    this.hp = monster.hp;
    this.expGain = monster.expGain; 
    this.level = monster.level;
    this.stamina = monster.stamina;
    this.zone = monster.zone;
  }

  public damage(party: Character[]): void {
  if (this.hp > 0 && party) {
    party.forEach(character => {
      // Temp:
      this.hp -= 1;
      if (this.hp < 0) {
        this.hp = 0;
      }
      //this.hp -= character.attackDamage;
    })
  }
  }
}

@Injectable({
  providedIn: 'root'
})
export class QuestService {

  questDescription: string = "";
  getURL: string = "http://127.0.0.1:8080/";
  quests: Monster[] | undefined; // TODO: move from Monster to Quest

  constructor(private http: HttpClient) {
  }

  init() {
    this.pullQuestData();
    this.checkQuestStatus();
    this.questDescription = "QUEST RECEIVED";
  }

  pullQuestData() {
    // fetch json from server endpoint
    console.log("[Quest Service]: Pulling quest data nodes from server endpoint.");
    this.http.get<Monster[]>(this.getURL + "newquest?level=1").subscribe( (data: Monster[]) => {
      this.quests = {...data};
      console.log(this.quests);
    });
  }

  checkQuestStatus() {
  }
}
