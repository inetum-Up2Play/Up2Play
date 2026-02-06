import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http'; 
import { provideHttpClientTesting } from '@angular/common/http/testing'; 
import { provideRouter } from '@angular/router'; 
import { ProximosPlanes } from './proximos-planes';

describe('ProximosPlanes', () => {
  let component: ProximosPlanes;
  let fixture: ComponentFixture<ProximosPlanes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProximosPlanes],
      providers: [ 
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]) 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProximosPlanes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
