import { TestBed } from '@angular/core/testing';

import { FriendCallerService } from './friend-caller.service';

describe('FriendCallerService', () => {
  let service: FriendCallerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FriendCallerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
