import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AllowStripeProfile } from './allow-stripe-profile';

describe('AllowStripeProfile', () => {
  let component: AllowStripeProfile;
  let fixture: ComponentFixture<AllowStripeProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllowStripeProfile],
      providers: [
        provideHttpClient(),    
        MessageService,    
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllowStripeProfile);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('pagosHabilitados', false); 

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});