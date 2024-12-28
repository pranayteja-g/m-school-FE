import { TestBed } from '@angular/core/testing';

import { ExamresultService } from './examresult.service';

describe('ExamresultService', () => {
  let service: ExamresultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamresultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
