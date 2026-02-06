import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EditarActividad } from './editar-actividad';

describe('EditarActividad', () => {
  let component: EditarActividad;
  let fixture: ComponentFixture<EditarActividad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarActividad],
      providers: [
        provideHttpClient(),
        MessageService,
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarActividad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
