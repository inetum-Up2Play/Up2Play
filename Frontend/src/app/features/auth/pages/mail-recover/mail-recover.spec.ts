import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailRecover } from './mail-recover';

describe('MailRecover', () => {
  let component: MailRecover;
  let fixture: ComponentFixture<MailRecover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailRecover]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailRecover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
