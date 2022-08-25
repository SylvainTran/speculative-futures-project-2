import { TestBed } from '@angular/core/testing';

import { CharacterDatabaseService } from './character-database.service';

describe('CharacterDatabaseService', () => {
  let service: CharacterDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
