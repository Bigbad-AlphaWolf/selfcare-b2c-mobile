import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../dashboard-service/dashboard.service';
import {
  CONSO_GAUGE_COLORS,
  InternetConsoModel,
  NewUserConsoModel,
} from './user-conso-service.index';
const { SERVER_API_URL, CONSO_SERVICE } = environment;
const urlConso = `${SERVER_API_URL}/${CONSO_SERVICE}/api/suivi-conso`;
const urlConsoInternet = `${SERVER_API_URL}/${CONSO_SERVICE}/api/history-communication`;
@Injectable({
  providedIn: 'root',
})
export class UserConsoService {
  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService
  ) {}

  getUserCunsomation() {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    let gaugeIndex = 0;
    return this.http.get<NewUserConsoModel[]>(`${urlConso}/${msisdn}`).pipe(
      map((res) => {
        res.forEach((counter, i) => {
          const hasGauge = !!counter.montantTotalBrut;
          if (hasGauge) {
            counter.gaugeColor = CONSO_GAUGE_COLORS[gaugeIndex % 3];
            gaugeIndex++;
          }
          counter.hasGauge = hasGauge;
        });
        return res;
      })
    );
  }

  getUserDataConsumation(lastDays: number) {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    return this.http
      .get<InternetConsoModel[]>(
        `${urlConsoInternet}/${msisdn}/${lastDays}?type=INTERNET`
      )
      .pipe(
        map((res) => {
          res = res.filter((consoItem) => consoItem.chargeType);
          res.forEach((conso) => {
            conso.date = conso.startDate.split('à')[0];
            conso.charge1 = +conso.charge1;
            conso.durationInSeconds = this.mapDurationToSecondsFormat(
              conso.duration
            );
          });
          console.log(res);
          return res;
        })
      );
  }

  // this method transform duration like this 08:00:00 to 28800 s
  mapDurationToSecondsFormat(duration: string) {
    const ar = duration.split(':');
    return +ar[0] * 3600 + +ar[1] * 60 + +ar[2];
  }
}
