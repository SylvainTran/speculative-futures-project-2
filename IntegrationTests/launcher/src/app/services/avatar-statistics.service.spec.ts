import { TestBed } from '@angular/core/testing';

import { AvatarStatisticsService } from './avatar-statistics.service';

describe('AvatarStatisticsService', () => {
  let service: AvatarStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
