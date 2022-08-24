import { TestBed } from '@angular/core/testing';

import { SaveDataService } from './save-data-service';

describe('SaveDataServiceService', () => {
  let service: SaveDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
