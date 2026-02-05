import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGallery } from './card-gallery';

describe('CardGallery', () => {
  let component: CardGallery;
  let fixture: ComponentFixture<CardGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGallery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardGallery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
