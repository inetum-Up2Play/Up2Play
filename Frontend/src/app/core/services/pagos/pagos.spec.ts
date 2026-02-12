import { TestBed } from '@angular/core/testing';

import { PagosService } from './pagos-service';

describe('Pagos', () => {
  let service: PagosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
