import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProximosPlanes } from './proximos-planes';

describe('ProximosPlanes', () => {
  let component: ProximosPlanes;
  let fixture: ComponentFixture<ProximosPlanes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProximosPlanes]
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
