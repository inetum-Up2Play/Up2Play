import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http'; 
import { provideHttpClientTesting } from '@angular/common/http/testing'; 
import { provideRouter } from '@angular/router'; 
import { MessageService } from 'primeng/api';
import { MailRecover } from './mail-recover';

describe('MailRecover', () => {
  let component: MailRecover;
  let fixture: ComponentFixture<MailRecover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailRecover],
      providers: [ 
        provideHttpClient(),
        MessageService,
        provideHttpClientTesting(),
        provideRouter([]) 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailRecover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
