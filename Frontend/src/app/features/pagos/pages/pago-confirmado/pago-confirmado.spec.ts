import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoConfirmado } from './pago-confirmado';

describe('PagoConfirmado', () => {
  let component: PagoConfirmado;
  let fixture: ComponentFixture<PagoConfirmado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoConfirmado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoConfirmado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
