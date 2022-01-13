import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SubscriptionModel } from 'src/shared';
import { SoSModel, SosPayloadModel } from '.';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { OemLoggingService } from '../oem-logging/oem-logging.service';
const { SERVICES_SERVICE, CONSO_SERVICE, SERVER_API_URL } = environment;
const SubscribeSOSEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/emergency-credit`;
const SosListEndPoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/sos-by-formule`;

@Injectable({
  providedIn: 'root',
})
export class SosService {
  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService,
    private authenticationService: AuthenticationService,
    private oemLoggingService: OemLoggingService
  ) {}

  getListSosByFormule(): Observable<SoSModel[]> {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    return this.authenticationService.getSubscription(msisdn).pipe(
      switchMap((subscription: SubscriptionModel) => {
        const codeFormule = subscription.code;
        return this.http.get(`${SosListEndPoint}/${codeFormule}`).pipe(
          map((res: SoSModel[]) => {
            return res;
          })
        );
      })
    );
  }

  subscribeToSos(sosPayload: SosPayloadModel) {
    return this.http.post(SubscribeSOSEndpoint, sosPayload).pipe(
      tap((res) => {
        this.oemLoggingService.registerEvent('sos_subscribe_success', [
          { dataName: 'amount', dataValue: sosPayload?.amount.toString() },
          { dataName: 'msisdn', dataValue: sosPayload?.msisdn },
        ]);
      }),
      catchError((err) => {
        this.oemLoggingService.registerEvent('sos_subscribe_error', []);
        return throwError(err);
      })
    );
  }
}
