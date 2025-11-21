import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarActividad } from './editar-actividad';

describe('EditarActividad', () => {
  let component: EditarActividad;
  let fixture: ComponentFixture<EditarActividad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarActividad]
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
