import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeCallback } from './stripe-callback';

describe('StripeCallback', () => {
  let component: StripeCallback;
  let fixture: ComponentFixture<StripeCallback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripeCallback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripeCallback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
