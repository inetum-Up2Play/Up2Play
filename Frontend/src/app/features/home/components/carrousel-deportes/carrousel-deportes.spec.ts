import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrouselDeportes } from './carrousel-deportes';

describe('CarrouselDeportes', () => {
  let component: CarrouselDeportes;
  let fixture: ComponentFixture<CarrouselDeportes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrouselDeportes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrouselDeportes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
