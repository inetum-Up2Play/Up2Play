import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarProfile } from './avatar-profile';

describe('AvatarProfile', () => {
  let component: AvatarProfile;
  let fixture: ComponentFixture<AvatarProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
