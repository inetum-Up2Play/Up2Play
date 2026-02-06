import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InfoActividad } from './info-actividad';


describe('InfoActividad', () => {
  let component: InfoActividad;
  let fixture: ComponentFixture<InfoActividad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoActividad],
      providers: [
        provideHttpClient(),
        MessageService,
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoActividad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
