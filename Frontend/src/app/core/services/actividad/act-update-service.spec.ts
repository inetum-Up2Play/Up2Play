import { TestBed } from '@angular/core/testing';

import { ActUpdateService } from './act-update-service';

describe('ActUpdateService', () => {
  let service: ActUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
