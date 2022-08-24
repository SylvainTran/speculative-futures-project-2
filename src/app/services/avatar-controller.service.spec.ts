import { TestBed } from '@angular/core/testing';

import { AvatarControllerService } from './avatar-controller.service';

describe('AvatarControllerService', () => {
  let service: AvatarControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
