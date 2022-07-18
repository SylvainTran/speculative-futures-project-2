import { Injectable } from '@angular/core';

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

    // Check for saved data
    this.loadFromLocalStorage();
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
    this.saveAvatarStatisticsData();
    return this.statistics;
  }

  public saveAvatarStatisticsData() {
    const avatarStatisticsData = {
      "str": this.statistics.get("str"),
      "mag": this.statistics.get("mag"),
      "dex": this.statistics.get("dex"),
      "spd": this.statistics.get("spd"),
      "vit": this.statistics.get("vit"),
      "char": this.statistics.get("char"),
      "int": this.statistics.get("int")    
    };
    window.localStorage.setItem("com.soberfoxgames.questidler.avatarStatisticsData", JSON.stringify(avatarStatisticsData));
  }

  public loadFromLocalStorage() {
    let storedAvatarStatisticsData: any = window.localStorage.getItem("com.soberfoxgames.questidler.avatarStatisticsData");
    if (storedAvatarStatisticsData !== null) {
      const result = JSON.parse(storedAvatarStatisticsData);
    
      for (let [key, value] of this.statistics) {
        let val = result[key as string];
        let _val: number = parseInt(val);
        this.statistics.set(key, val);  
      }
    }
  }
}
