import { OnInit, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarStatisticsService {

  statisticLabels = ["str", "mag", "dex", "spd", "vit", "char", "int"];
  statistics: Map<String, number>;
  
  constructor() {
    this.statistics = new Map();
    this.statisticLabels.forEach( label => {
      this.statistics.set(label, 5 + Math.ceil(Math.random() * 5));
    });
  }

  public diceIsGreaterThanThreshold(dice: number, threshold: number) {
    return dice > threshold;
  }

  public selectStats(selectedStats: String[]) {

    for (let [key, value] of this.statistics) {
      let dice = Math.ceil(Math.random() * 6);

      if (this.diceIsGreaterThanThreshold(dice, 3)) {
        selectedStats.push(key);
      }
    }
    return selectedStats;
  }
  
  public incrementStat(stat: String) {
    console.log("incrementing stat: " + stat);
    let oldValue: number | any = this.statistics.get(stat);
    this.statistics.set(stat, oldValue + Math.ceil(Math.random() * 3));
  }

  public incrementStats() {
    console.log("Incrementing stats");
    let buffer : String[] = [];
    this.selectStats(buffer); 
    buffer.forEach(stat => this.incrementStat(stat));
    return this.statistics;
  }
}
