import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuestPartyService } from '../services/quest-party.service';
import { Monster } from '../services/quest.service';

@Component({
  selector: 'app-collectables',
  templateUrl: './collectables.component.html',
  styleUrls: ['./collectables.component.css']
})
export class CollectablesComponent implements OnInit, OnDestroy {

  // TODO: move into loot service
  @Input() loots?: Map<String, number>;

  constructor() {

  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void { 
  }

}
