import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeminosCondiciones } from './teminos-condiciones';

describe('TeminosCondiciones', () => {
  let component: TeminosCondiciones;
  let fixture: ComponentFixture<TeminosCondiciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeminosCondiciones]
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
