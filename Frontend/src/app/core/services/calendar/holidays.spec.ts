import { TestBed } from '@angular/core/testing';

import { MonkeyTest } from './monkey-test-service';

describe('MonkeyTest', () => {
  let service: MonkeyTest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonkeyTest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
