import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { VerificationPassword } from './verification-password';

describe('VerificationPassword', () => {
  let component: VerificationPassword;
  let fixture: ComponentFixture<VerificationPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationPassword],
      providers: [
        provideHttpClient(),
        MessageService,
        provideHttpClientTesting(),
        provideRouter([]),
      ],
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
