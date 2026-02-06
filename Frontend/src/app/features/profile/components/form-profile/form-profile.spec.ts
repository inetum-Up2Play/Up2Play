import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { FormProfile } from './form-profile';

describe('FormProfile', () => {
  let component: FormProfile;
  let fixture: ComponentFixture<FormProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProfile],
      providers: [MessageService, provideNoopAnimations(),],
    }).compileComponents();

    fixture = TestBed.createComponent(FormProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
