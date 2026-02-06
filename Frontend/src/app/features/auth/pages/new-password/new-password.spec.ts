import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http'; 
import { provideHttpClientTesting } from '@angular/common/http/testing'; 
import { provideRouter } from '@angular/router'; 
import { MessageService } from 'primeng/api';
import { NewPassword } from './new-password';

describe('NewPassword', () => {
  let component: NewPassword;
  let fixture: ComponentFixture<NewPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPassword],
      providers: [ 
        provideHttpClient(),
        MessageService,
        provideHttpClientTesting(),
        provideRouter([]) 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
