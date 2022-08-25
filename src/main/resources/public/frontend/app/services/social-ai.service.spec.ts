import { TestBed } from '@angular/core/testing';

import { SocialAiService } from './social-ai.service';

describe('SocialAiService', () => {
  let service: SocialAiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialAiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
