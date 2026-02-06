import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http'; 
import { provideHttpClientTesting } from '@angular/common/http/testing'; 
import { provideRouter } from '@angular/router'; 
import { VerificationFormComponent } from './verification-form.component';
import { MessageService } from 'primeng/api';

describe('VerificationFormComponent', () => {
  let component: VerificationFormComponent;
  let fixture: ComponentFixture<VerificationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationFormComponent],
      providers: [ 
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        provideRouter([]) 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
