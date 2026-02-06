import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http'; 
import { provideHttpClientTesting } from '@angular/common/http/testing'; 
import { provideRouter } from '@angular/router'; 
import { TeminosCondiciones } from './teminos-condiciones';

describe('TeminosCondiciones', () => {
  let component: TeminosCondiciones;
  let fixture: ComponentFixture<TeminosCondiciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeminosCondiciones],
      providers: [ 
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]) 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeminosCondiciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
