import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-collectables',
  templateUrl: './collectables.component.html',
  styleUrls: ['./collectables.component.css']
})
export class CollectablesComponent implements OnInit {
  // TODO: move into loot service
  public loots: Map<String, number>;

  constructor() {
    // TODO: refactor
    this.loots = new Map();
    this.loots.set("Training Stick", 1);
  }

  ngOnInit(): void {
  }

}
