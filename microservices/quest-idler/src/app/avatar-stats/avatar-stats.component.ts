import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AvatarExperienceService } from '../avatar-experience.service';
import { AvatarStatisticsService } from '../avatar-statistics.service';

@Component({
  selector: 'app-avatar-stats',
  templateUrl: './avatar-stats.component.html',
  styleUrls: ['./avatar-stats.component.css']
})
export class AvatarStatsComponent implements OnInit, OnDestroy {
  public statisticLabels: String[] | undefined;
  public statistics: Map<String, number>;
  private avatarStatisticsService: AvatarStatisticsService;
  private avatarExperienceService: AvatarExperienceService;
  subscription: Subscription;
  
  constructor(
    @Inject(AvatarStatisticsService) avatarStatisticsService: AvatarStatisticsService,
    @Inject(AvatarExperienceService) avatarExperienceService: AvatarExperienceService
    ) {
    this.statisticLabels = ["str", "mag", "dex", "spd", "vit", "char", "int"];
    this.statistics = new Map();
    this.statisticLabels.forEach( label => this.statistics.set(label, 5 + Math.ceil(Math.random() * 5)));              
    
    this.avatarStatisticsService = avatarStatisticsService;    
    this.avatarExperienceService = avatarExperienceService;

    this.subscription = avatarExperienceService.levelUpSource$.subscribe(() => {
      this.calculateAvatarLevelStats();
    });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public calculateAvatarLevelStats() {
    console.log("Calculating avatar level stats!");
    this.statistics = this.avatarStatisticsService.incrementStats();
  }
}
