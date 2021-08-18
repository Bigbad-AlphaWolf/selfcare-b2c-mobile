import { TestBed, inject } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { of } from 'rxjs';
import { BoosterService } from '../booster.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AngularDelegate,
        { provide: HttpClient },
        { provide: HttpHandler },
        {
          provide: ModalController,
        },
        {
          provide: AuthenticationService,
          useValue: {
            currentPhoneNumberSetSubject: of(),
            getLocalUserInfos: () => {
              return {};
            },
            getUserMainPhoneNumber: () => {
              return '';
            },
          },
        },
        {
          provide: BoosterService,
          useValue: {
            getBoosters: () => {
              return of();
            },
          },
        },
      ],
    });
  });

  it('should be created', inject(
    [DashboardService],
    (service: DashboardService) => {
      expect(service).toBeDefined();
    }
  ));
});
