import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { BanniereService } from 'src/app/services/banniere-service/banniere.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OperationService } from 'src/app/services/oem-operation/operation.service';

import { OffresServicesPage } from './offres-services.page';

describe('OffresServicesPage', () => {
  let component: OffresServicesPage;
  let fixture: ComponentFixture<OffresServicesPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OffresServicesPage],
        imports: [RouterTestingModule],
        providers: [
          {
            provide: BanniereService,
            useValue: {
              queryListBanniereByFormule: () => {
                return of();
              },
            },
          },
          {
            provide: OperationService,
            useValue: {
              initServicesData: () => {
                return of();
              },
            },
          },
          {
            provide: AuthenticationService,
            useValue: {
              initServicesData: () => {
                return of();
              },
              getSubscription: () => {
                return of();
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
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OffresServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
