import { TestBed } from '@angular/core/testing';

import { TaskGeneratorService } from './task-generator.service';

describe('TaskGeneratorService', () => {
  let service: TaskGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
