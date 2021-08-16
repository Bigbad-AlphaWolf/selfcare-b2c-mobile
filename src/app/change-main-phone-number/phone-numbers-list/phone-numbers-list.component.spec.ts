import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhoneNumbersListComponent } from './phone-numbers-list.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';

describe('PhoneNumbersListComponent', () => {
  let component: PhoneNumbersListComponent;
  let fixture: ComponentFixture<PhoneNumbersListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneNumbersListComponent],
      providers: [
        {
          provide: Router,
        },
        {
          provide: DashboardService,
          useValue: {
            getCurrentPhoneNumber: () => {
              return '781210011';
            },
            currentPhoneNumberChange: {
              subscribe: () => {},
            },
            setCurrentPhoneNumber: () => {},
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneNumbersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
