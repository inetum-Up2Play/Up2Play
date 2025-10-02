/* tslint:disable:no-unused-variable */
// fix import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PruebaPrimeNGComponent } from './pruebaPrimeNG.component';

describe('PruebaPrimeNGComponent', () => {
  let component: PruebaPrimeNGComponent;
  let fixture: ComponentFixture<PruebaPrimeNGComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ PruebaPrimeNGComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PruebaPrimeNGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
