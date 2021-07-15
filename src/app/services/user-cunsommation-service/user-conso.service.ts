import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../dashboard-service/dashboard.service';
import {
  CONSO_GAUGE_COLORS,
  NewUserConsoModel,
} from './user-conso-service.index';
const { SERVER_API_URL, CONSO_SERVICE } = environment;
const urlConso = `${SERVER_API_URL}/${CONSO_SERVICE}/api/suivi-conso`;
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
}
