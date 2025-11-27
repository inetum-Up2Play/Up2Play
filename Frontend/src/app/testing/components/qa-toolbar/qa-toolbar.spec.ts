import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaToolbar } from './qa-toolbar';

describe('QaToolbar', () => {
  let component: QaToolbar;
  let fixture: ComponentFixture<QaToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QaToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QaToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
