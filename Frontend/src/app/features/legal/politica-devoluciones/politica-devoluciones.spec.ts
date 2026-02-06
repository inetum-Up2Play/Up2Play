import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { PoliticaDevoluciones } from './politica-devoluciones';

describe('PoliticaDevoluciones', () => {
  let component: PoliticaDevoluciones;
  let fixture: ComponentFixture<PoliticaDevoluciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticaDevoluciones],
      providers: [
        provideHttpClient(),
        provideNoopAnimations(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticaDevoluciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
