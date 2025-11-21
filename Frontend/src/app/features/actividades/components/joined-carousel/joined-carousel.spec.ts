import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinedCarousel } from './joined-carousel';

describe('JoinedCarousel', () => {
  let component: JoinedCarousel;
  let fixture: ComponentFixture<JoinedCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinedCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinedCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
