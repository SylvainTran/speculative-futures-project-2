import { OnInit, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarStatisticsService {

  statisticLabels = ["str", "mag", "dex", "spd", "vit", "char", "int"];
  statistics: Map<String, number>;
  
  constructor() {
    this.statistics = new Map();
  }

  ngOnInit() {
    this.statisticLabels.forEach( label => this.statistics.set(label, 5 + Math.ceil(Math.random() * 5)));
  }
}
