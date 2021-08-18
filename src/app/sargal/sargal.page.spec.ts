import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SargalPage } from './sargal.page';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { SargalService } from '../services/sargal-service/sargal.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('SargalPage', () => {
  let component: SargalPage;
  let fixture: ComponentFixture<SargalPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [SargalPage, FormatCurrencyPipe],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: Router,
          },
          {
            provide: AuthenticationService,
            useValue: {
              getLocalUserInfos: () => {
                return {};
              },
            },
          },
          {
            provide: DashboardService,
            useValue: {
              getCurrentPhoneNumber: () => {
                return '';
              },
            },
          },
          {
            provide: SargalService,
            useValue: {
              getSargalBalance: () => {
                return of();
              },
              querySargalGiftCategories: () => {
                return of();
              },
              getCustomerSargalStatus: () => {
                return of();
              },
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SargalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
