import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { DataVolumePipe } from 'src/shared/pipes/data-volume.pipe';
import { IlliflexVoicePipe } from 'src/shared/pipes/illiflex-voice.pipe';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { IlliflexService } from '../services/illiflex-service/illiflex.service';

import { IlliflexBudgetConfigurationPage } from './illiflex-budget-configuration.page';

describe('IlliflexBudgetConfigurationPage', () => {
  let component: IlliflexBudgetConfigurationPage;
  let fixture: ComponentFixture<IlliflexBudgetConfigurationPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          IlliflexBudgetConfigurationPage,
          DataVolumePipe,
          IlliflexVoicePipe,
        ],
        providers: [
          {
            provide: Location,
          },
          {
            provide: ModalController,
          },
          {
            provide: UrlSerializer,
            useValue: {
              serialize: () => {},
            },
          },
          {
            provide: IlliflexService,
            useValue: {
              getIlliflexPaliers: () => {
                return of();
              },
              getBestOffer: () => {
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
          {
            provide: AuthenticationService,
            useValue: {
              getSubscription: () => {
                return of();
              },
            },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IlliflexBudgetConfigurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
