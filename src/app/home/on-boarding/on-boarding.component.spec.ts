import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnBoardingComponent } from './on-boarding.component';
import { Router } from '@angular/router';

describe('OnBoardingComponent', () => {
  let component: OnBoardingComponent;
  let fixture: ComponentFixture<OnBoardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnBoardingComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: Router }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnBoardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
