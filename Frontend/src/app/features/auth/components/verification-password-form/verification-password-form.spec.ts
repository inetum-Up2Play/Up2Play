import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { VerificationPasswordForm } from './verification-password-form';

describe('VerificationPasswordForm', () => {
  let component: VerificationPasswordForm;
  let fixture: ComponentFixture<VerificationPasswordForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationPasswordForm],
      providers: [
        provideHttpClient(),
        MessageService,
        provideHttpClientTesting(),
        provideRouter([]),
      ],
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
