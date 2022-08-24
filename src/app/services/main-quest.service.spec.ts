import { TestBed } from '@angular/core/testing';

import { MainQuestService } from './main-quest.service';

describe('MainQuestService', () => {
  let service: MainQuestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainQuestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
