import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { Router } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { of } from 'rxjs';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';

import { AssistanceHubPage } from './assistance-hub.page';

describe('AssistanceHubPage', () => {
  let component: AssistanceHubPage;
  let fixture: ComponentFixture<AssistanceHubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [ AssistanceHubPage ],
      providers: [
        {
          provide: HttpClient
        },
        {
          provide: AppVersion
        },
        {
          provide: Router
        },
        {
          provide: DashboardService, useValue: {
            getCurrentPhoneNumber: () => {
              return ""
            }
          }
        },
        {
          provide: OrangeMoneyService, useValue: {
            getUserStatus: () => {
              return of()
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistanceHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
