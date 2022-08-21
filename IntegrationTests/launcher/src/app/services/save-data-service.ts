import { Injectable } from '@angular/core';
import { AvatarExperienceService } from './avatar-experience.service';
import { AvatarHealthService } from './avatar-health.service';
import { AvatarStatisticsService } from './avatar-statistics.service';
import { GameEventObject, MainQuestService, SMSQUEST_GameEventObject } from './main-quest.service';

@Injectable({
  providedIn: 'root'
})
export class SaveDataService {

  public experienceJSON: any;

  constructor() {}

  // Loading and saving
  public saveExperienceData(CurrentLevel: number, CurrentExperience: number, ExperienceTotalRequired: number) {
    let experienceDataToJSON = {
      "currentLevel": CurrentLevel,
      "currentExperience": CurrentExperience,
      "experienceTotalRequired": ExperienceTotalRequired
    };
    window.localStorage.setItem("com.soberfoxgames.questidler.experienceData", JSON.stringify(experienceDataToJSON));
  }

  public loadExperienceData() {
    let storedExperienceData: any = window.localStorage.getItem("com.soberfoxgames.questidler.experienceData");
    
    if (storedExperienceData !== null) {
      this.experienceJSON = JSON.parse(storedExperienceData);

      if (this.experienceJSON) {
        return this.experienceJSON;
      } else {
        return {
          "currentLevel": 1,
          "currentExperience": 0,
          "experienceTotalRequired": 100
        }
      }
    }
  }

  public saveAvatarStatisticsData(statistics: Map<String, number>) {
    let avatarStatisticsData = {
      "str": statistics.get("str"),
      "mag": statistics.get("mag"),
      "dex": statistics.get("dex"),
      "spd": statistics.get("spd"),
      "vit": statistics.get("vit"),
      "char": statistics.get("char"),
      "int": statistics.get("int")    
    };
    window.localStorage.setItem("com.soberfoxgames.questidler.avatarStatisticsData", JSON.stringify(avatarStatisticsData));
  }

  public loadAvatarStatisticsFromLocalStorage() {
    let statistics: Map<String, number> = new Map<String, number>();

    let storedAvatarStatisticsData: any = window.localStorage.getItem("com.soberfoxgames.questidler.avatarStatisticsData");
    if (storedAvatarStatisticsData !== null) {
      const result = JSON.parse(storedAvatarStatisticsData);
    
      for (let [key, value] of statistics) {
        let val = result[key as string];
        let _val: number = parseInt(val);
        statistics.set(key, val);  
      }
    } else {
      return null;
    }
    return statistics;
  }

  public saveHealthData(health: number) {
    const healthData = {
      "avatarHealth": health
    }
    window.localStorage.setItem("com.soberfoxgames.questidler.avatarHealth", JSON.stringify(healthData));
  }

  public loadHealthData(): any {
    let storedHealth: any = window.localStorage.getItem("com.soberfoxgames.questidler.avatarHealth");    

    let healthResult = {
      "health": 0
    };

    if (storedHealth !== null) {
      const result = JSON.parse(storedHealth);
      const health = parseInt(result.avatarHealth);
      healthResult.health = health;
    } else {
      healthResult.health = 100;
    }
    return healthResult;
  }

  public saveCompletedSMSEvents(SMSEventsCompletedHashMap: Map<String, GameEventObject>) {
    window.localStorage.setItem("com.soberfoxgames.questidler.completedSMSEvents", JSON.stringify(Object.fromEntries(SMSEventsCompletedHashMap)));
  }

  public loadCompletedSMSEvents(): Map<String, GameEventObject> | null {
    let data: any = window.localStorage.getItem("com.soberfoxgames.questidler.completedSMSEvents");
  
    let results = JSON.parse(data);
    if (results) {
      let ret = new Map<String, GameEventObject>();
      for (const [key, value] of Object.entries(results)) {
        ret.set(key, value as SMSQUEST_GameEventObject);
      }
      return ret;
    } else {
      return null;
    }
  }
}
