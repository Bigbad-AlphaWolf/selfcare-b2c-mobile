import { TestBed } from '@angular/core/testing';

import { AssistanceService } from './assistance.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { DashboardService } from './dashboard-service/dashboard.service';
import { AuthenticationService } from './authentication-service/authentication.service';

describe('AssistanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: HttpClient,
        useValue: {
          get: () => {
            return of()
          }
        }
      },
      {
        provide: DashboardService,
        useValue: {
          getCurrentPhoneNumber: () => {
            return ""
          }
        }
      },
      {
        provide: AuthenticationService,
        useValue: {
          getSubscription: () => {
            return of()
          }
        }
      }
    ]
  }));

  it('should be created', () => {
    const service: AssistanceService = TestBed.get(AssistanceService);
    expect(service).toBeTruthy();
  });
});
