import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { StepperInfo } from './stepper-info';

describe('StepperInfo', () => {
  let component: StepperInfo;
  let fixture: ComponentFixture<StepperInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperInfo],
        providers: [
        provideNoopAnimations(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
