import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoActividad } from './info-actividad';

describe('InfoActividad', () => {
  let component: InfoActividad;
  let fixture: ComponentFixture<InfoActividad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoActividad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoActividad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
