import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http'; 
import { MessageService } from 'primeng/api';
import { provideHttpClientTesting } from '@angular/common/http/testing'; 
import { provideRouter } from '@angular/router'; 
import { CardGallery } from './card-gallery';

describe('CardGallery', () => {
  let component: CardGallery;
  let fixture: ComponentFixture<CardGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGallery],
      providers: [ 
        provideHttpClient(),
        MessageService,
        provideHttpClientTesting(),
        provideRouter([]) 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardGallery);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('tipo', 'actividades'); 

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});