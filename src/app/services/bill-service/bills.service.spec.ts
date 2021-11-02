import {TestBed, inject} from '@angular/core/testing';
import {BillsService} from './bills.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {Router, ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';

import {of} from 'rxjs';
import {DashboardService} from '../dashboard-service/dashboard.service';
import {File} from '@ionic-native/file/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {SharedModule} from 'src/shared/shared.module';
import {FollowAnalyticsService} from '../follow-analytics/follow-analytics.service';

describe('BillsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule],
      providers: [
        {provide: Router, useValue: {}},
        {provide: ActivatedRoute, useValue: {}},
        {provide: MatDialog},
        {
          provide: HttpClient,
          useValue: {
            get: () => {
              const bills = [
                {
                  numeroTelephone: '776440968',
                  numeroFacture: '776440968P1904003067',
                  dateFacture: '2019-05-06',
                  numeroClient: 'A0000071639',
                  compteClient: 'B0000365408',
                  mois: 4,
                  annee: 19,
                  dateEcheance: '2019-05-27',
                  montantFacture: 21000,
                  montantTVA: 3194,
                  statutFacture: 'NON PAYEE'
                }
              ];
              return of(bills);
            }
          }
        },
        FormBuilder,
        {provide: Validators, useValue: {}},
        {provide: FormGroup, useValue: {}},
        {provide: MatDialogRef, useValue: {}},
        {
          provide: FollowAnalyticsService,
          useValue: {
            registerEventFollow: () => {}
          }
        },
        {
          provide: DashboardService,
          useValue: {
            getBills: () => {
              return {subscribe: () => {}};
            },
            getCurrentPhoneNumber: () => {
              return {subscribe: () => {}};
            }
          }
        },
        {
          provide: File
        },
        {
          provide: InAppBrowser
        }
      ]
    });
  });

  it(
    'should be created',
    inject([BillsService], (service: BillsService) => {
      expect(service).toBeDefined();
    })
  );
  // it('download UserBill should work', inject(
  // 	[BillsService],
  // 	(service: BillsService) => {
  // 		const bill = {
  // 			url: null,
  // 			status: 1,
  // 			file: 'JVBERi0xLjQNCiWTjIueIFJlcG9ydExhYiBHZW',
  // 			typefile: null,
  // 			downloading: true
  // 		};
  // 		service.downloadUserBill(bill);
  // 		expect(bill.downloading).toEqual(true);
  // 	}
  // ));
});
