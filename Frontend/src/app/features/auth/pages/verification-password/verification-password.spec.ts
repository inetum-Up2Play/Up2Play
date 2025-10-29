import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationPassword } from './verification-password';

describe('VerificationPassword', () => {
  let component: VerificationPassword;
  let fixture: ComponentFixture<VerificationPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
