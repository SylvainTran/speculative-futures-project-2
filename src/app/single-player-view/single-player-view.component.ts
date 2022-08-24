import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Player } from '../services/player';

@Component({
  selector: 'app-single-player-view',
  templateUrl: './single-player-view.component.html',
  styleUrls: ['./single-player-view.component.css']
})
export class SinglePlayerViewComponent implements OnInit {

  @Input() playerRef: Player | undefined;
  @Input() loots?: Map<String, number>;

  constructor() { }

  ngOnInit(): void {
  }

}
