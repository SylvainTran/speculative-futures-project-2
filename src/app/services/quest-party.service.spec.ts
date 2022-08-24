import { TestBed } from '@angular/core/testing';

import { QuestPartyService } from './quest-party.service';

describe('QuestPartyService', () => {
  let service: QuestPartyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestPartyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
