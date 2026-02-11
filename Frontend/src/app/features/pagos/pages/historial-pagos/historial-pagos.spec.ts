import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { HistorialPagos } from './historial-pagos';

registerLocaleData(localeEs);

describe('HistorialPagos', () => {
  let component: HistorialPagos;
  let fixture: ComponentFixture<HistorialPagos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialPagos],
      providers: [
        provideHttpClient(),
        MessageService,
        provideNoopAnimations(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialPagos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
