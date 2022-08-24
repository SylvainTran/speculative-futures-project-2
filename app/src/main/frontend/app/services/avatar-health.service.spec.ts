import { TestBed } from '@angular/core/testing';

import { AvatarHealthService } from './avatar-health.service';

describe('AvatarHealthService', () => {
  let service: AvatarHealthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarHealthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
