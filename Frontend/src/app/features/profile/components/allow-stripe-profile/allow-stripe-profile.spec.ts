import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowStripeProfile } from './allow-stripe-profile';

describe('AllowStripeProfile', () => {
  let component: AllowStripeProfile;
  let fixture: ComponentFixture<AllowStripeProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllowStripeProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllowStripeProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
