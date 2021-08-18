import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HistoriqueAchatComponent } from './historique-achat.component';
import { MatMenuModule } from '@angular/material';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { of } from 'rxjs';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';

describe('HistoriqueAchatComponent', () => {
  let component: HistoriqueAchatComponent;
  let fixture: ComponentFixture<HistoriqueAchatComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HistoriqueAchatComponent],
        providers: [
          AngularDelegate,
          {
            provide: ModalController,
          },
          {
            provide: OrangeMoneyService,
            useValue: {
              getOmMsisdn: () => {
                return of();
              },
            },
          },
          {
            provide: FollowAnalyticsService,
            useValue: {
              registerEventFollow: () => {
                return {};
              },
            },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        imports: [MatMenuModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
