import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// Test quest fetch API
export interface Monster {
  name: string;
  race: string;
  hp: number;
  expGain: number;
  level: number;
  stamina: number;
  zone: string;
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
