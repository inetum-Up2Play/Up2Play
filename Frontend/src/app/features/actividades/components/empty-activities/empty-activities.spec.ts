import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyActivities } from './empty-activities';

describe('EmptyActivities', () => {
  let component: EmptyActivities;
  let fixture: ComponentFixture<EmptyActivities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyActivities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyActivities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
