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
  subscription: Subscription;
  
  constructor(
    @Inject(AvatarStatisticsService) private avatarStatisticsService: AvatarStatisticsService,
    @Inject(AvatarExperienceService) private avatarExperienceService: AvatarExperienceService
    ) {

    this.statistics = this.avatarStatisticsService.statistics;    
    this.subscription = this.avatarExperienceService.levelUpSource$.subscribe(() => {
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
