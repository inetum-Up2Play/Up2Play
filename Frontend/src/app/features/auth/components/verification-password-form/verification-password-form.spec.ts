import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationPasswordForm } from './verification-password-form';

describe('VerificationPasswordForm', () => {
  let component: VerificationPasswordForm;
  let fixture: ComponentFixture<VerificationPasswordForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationPasswordForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationPasswordForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
