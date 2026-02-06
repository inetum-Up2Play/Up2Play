import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { PagoConfirmado } from './pago-confirmado';

describe('PagoConfirmado', () => {
  let component: PagoConfirmado;
  let fixture: ComponentFixture<PagoConfirmado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoConfirmado],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
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
