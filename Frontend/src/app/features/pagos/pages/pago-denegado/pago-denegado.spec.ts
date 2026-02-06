import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoDenegado } from './pago-denegado';

describe('PagoDenegado', () => {
  let component: PagoDenegado;
  let fixture: ComponentFixture<PagoDenegado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoDenegado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoDenegado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
