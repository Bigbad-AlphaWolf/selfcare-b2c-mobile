import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnBoardingComponent } from './on-boarding.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('OnBoardingComponent', () => {
  let component: OnBoardingComponent;
  let fixture: ComponentFixture<OnBoardingComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [OnBoardingComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OnBoardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
