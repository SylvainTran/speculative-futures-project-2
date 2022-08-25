import { Component, OnInit } from '@angular/core';
import { ACTORS, MainQuestService, SMS_CLASS } from '../services/main-quest.service';

@Component({
  selector: 'app-settings-activity',
  templateUrl: './settings-activity.component.html',
  styleUrls: ['./settings-activity.component.css']
})
export class SettingsActivityComponent implements OnInit {

  constructor(private mainQuestService: MainQuestService) {   
  }

  ngOnInit(): void {
  }

  public triggerEvent(eventType: string) {
    let data = new SMS_CLASS('rootedPhone', ACTORS[ACTORS.Autumn]);
    this.mainQuestService.TRIGGER_SMS_EVENT.next(data);
  }

}
