import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvaActividad } from './prova-actividad';

describe('ProvaActividad', () => {
  let component: ProvaActividad;
  let fixture: ComponentFixture<ProvaActividad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvaActividad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvaActividad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
