import { TestBed } from '@angular/core/testing';

import { AvatarExperienceService } from './avatar-experience.service';

describe('AvatarExperienceService', () => {
  let service: AvatarExperienceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarExperienceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
