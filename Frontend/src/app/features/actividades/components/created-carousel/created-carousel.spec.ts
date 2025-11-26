import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedCarousel } from './created-carousel';

describe('CreatedCarousel', () => {
  let component: CreatedCarousel;
  let fixture: ComponentFixture<CreatedCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
