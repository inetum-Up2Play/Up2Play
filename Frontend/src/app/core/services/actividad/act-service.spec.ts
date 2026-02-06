import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActService } from './act-service';

describe('ActService', () => {
  let service: ActService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ],
    });
    service = TestBed.inject(ActService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
