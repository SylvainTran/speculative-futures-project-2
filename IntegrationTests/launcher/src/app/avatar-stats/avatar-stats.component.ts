import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AvatarExperienceService } from '../services/avatar-experience.service';
import { AvatarStatisticsService } from '../services/avatar-statistics.service';

@Component({
  selector: 'app-avatar-stats',
  templateUrl: './avatar-stats.component.html',
  styleUrls: ['./avatar-stats.component.css']
})
export class AvatarStatsComponent implements OnInit, OnDestroy {
  public statistics: Map<String, number>;
  private avatarStatisticsService: AvatarStatisticsService;
  private avatarExperienceService: AvatarExperienceService;
  subscription: Subscription;
  
  constructor(
    @Inject(AvatarStatisticsService) avatarStatisticsService: AvatarStatisticsService,
    @Inject(AvatarExperienceService) avatarExperienceService: AvatarExperienceService
    ) {
    this.avatarStatisticsService = avatarStatisticsService;    
    this.avatarExperienceService = avatarExperienceService;

    this.statistics = avatarStatisticsService.statistics;
    
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
