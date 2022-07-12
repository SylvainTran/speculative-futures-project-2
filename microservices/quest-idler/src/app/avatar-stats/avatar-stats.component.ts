import { Component, OnInit } from '@angular/core';
import { AvatarStatisticsService } from '../avatar-statistics.service';

@Component({
  selector: 'app-avatar-stats',
  templateUrl: './avatar-stats.component.html',
  styleUrls: ['./avatar-stats.component.css']
})
export class AvatarStatsComponent implements OnInit {
  public statisticLabels: String[] | undefined;
  public statistics: Map<String, number>;
  private avatarStatisticsService: AvatarStatisticsService;

  constructor(avatarStatisticsService: AvatarStatisticsService) {
    this.statisticLabels = ["str", "mag", "dex", "spd", "vit", "char", "int"];
    this.statistics = new Map();
    this.statisticLabels.forEach( label => this.statistics.set(label, 5 + Math.ceil(Math.random() * 5)));              
    this.avatarStatisticsService = avatarStatisticsService;
  }

  ngOnInit(): void {
    
  }

  public calculate() {
    
  }

}
