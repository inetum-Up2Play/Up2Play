import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearActividad } from './crear-actividad';

describe('CrearActividad', () => {
  let component: CrearActividad;
  let fixture: ComponentFixture<CrearActividad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearActividad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearActividad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
