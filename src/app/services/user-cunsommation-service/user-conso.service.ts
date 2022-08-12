import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { of, throwError } from 'rxjs';
import {catchError, map, share, tap} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {DashboardService} from '../dashboard-service/dashboard.service';
import { LocalStorageService } from '../localStorage-service/local-storage.service';
import {InternetConsoModel, NewUserConsoModel} from './user-conso-service.index';
const {SERVER_API_URL, CONSO_SERVICE} = environment;
const urlConso = `${SERVER_API_URL}/${CONSO_SERVICE}/api/suivi-conso`;
const urlConsoInternet = `${SERVER_API_URL}/${CONSO_SERVICE}/api/history-communication`;
export const USER_CONSO_STORAGE_KEY = 'USER_CONSO_MSISDN';
export const USER_CONSO_REQUEST_TIMEOUT = 2000;

@Injectable({
  providedIn: 'root',
})
export class UserConsoService {
  static lastUserConsumtionsInfos: any[] = [];
  static lastRechargementCompteurValue: number;
  constructor(private http: HttpClient, private dashboardService: DashboardService, private storageService: LocalStorageService) {}

  getUserCunsomation(msisdn = this.dashboardService.getCurrentPhoneNumber()) {
    const key = `${USER_CONSO_STORAGE_KEY}_${msisdn}`;
    const storedData: NewUserConsoModel[] = this.storageService.getFromLocalStorage(key);
    return this.http.get<NewUserConsoModel[]>(`${urlConso}/${msisdn}`).pipe(
      share(),
      tap((res: NewUserConsoModel[]) => {
        this.storageService.saveToLocalStorage(key, res);
        this.storageService.saveToLocalStorage(`${key}_last_update`, Date.now());
        UserConsoService.lastUserConsumtionsInfos = res;
        UserConsoService.lastRechargementCompteurValue = res.find(elt => {
          return elt.codeCompteur === 1;
        })?.montantRestantBrut;
      }),
      catchError(err => {
        if (storedData) return of(storedData);
        throwError(err);
      })
    );
  }

  getUserDataConsumation(lastDays: number) {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    return this.http.get<InternetConsoModel[]>(`${urlConsoInternet}/${msisdn}/${lastDays}?type=INTERNET`).pipe(
      map(res => {
        res = res.filter(consoItem => consoItem.chargeType);
        res.forEach(conso => {
          conso.date = conso.startDate.split('à')[0];
          conso.charge1 = +conso.charge1;
          conso.durationInSeconds = this.mapDurationToSecondsFormat(conso.duration);
        });
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
