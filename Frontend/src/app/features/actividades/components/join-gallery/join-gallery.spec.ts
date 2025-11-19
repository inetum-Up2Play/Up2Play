import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinGallery } from './join-gallery';

describe('JoinGallery', () => {
  let component: JoinGallery;
  let fixture: ComponentFixture<JoinGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinGallery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinGallery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
