import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActivityCard } from './activity-card';

describe('ActivityCard', () => {
  let component: ActivityCard;
  let fixture: ComponentFixture<ActivityCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityCard],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityCard);
    component = fixture.componentInstance;

    component.actividadId = 1; 

    fixture.componentRef.setInput('titulo', 'Actividad de Prueba');
    fixture.componentRef.setInput('fecha', new Date().toISOString().split('T')[0]); 
    fixture.componentRef.setInput('hora', '10:00');
    fixture.componentRef.setInput('ubicacion', 'Madrid Centro');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});