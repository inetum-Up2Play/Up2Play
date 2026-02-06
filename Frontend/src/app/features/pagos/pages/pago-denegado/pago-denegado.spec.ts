import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { PagoDenegado } from './pago-denegado';

describe('PagoDenegado', () => {
  let component: PagoDenegado;
  let fixture: ComponentFixture<PagoDenegado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoDenegado],
      providers: [
        provideHttpClient(),
        MessageService,
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDenegado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
