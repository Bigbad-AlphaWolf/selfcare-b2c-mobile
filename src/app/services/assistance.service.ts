import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { DashboardService } from './dashboard-service/dashboard.service';
import { AuthenticationService } from './authentication-service/authentication.service';
import { environment } from 'src/environments/environment';
import { ItemBesoinAide, SubscriptionModel } from 'src/shared';
import { map, switchMap } from 'rxjs/operators';
import { createRequestOption } from '../utils/request-utils';
import { ASSISTANCE_ENDPOINT } from './utils/services.endpoints';
import { DimeloCordovaPlugin } from 'DimeloPlugin/ngx';
import { InfosAbonneModel } from '../models/infos-abonne.model';
import { LocalStorageService } from './localStorage-service/local-storage.service';

const { SERVICES_SERVICE, SERVER_API_URL, ACCOUNT_MNGT_SERVICE } = environment;
// const questionsAnswersEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/besoin-aides/by-profil-formule`;
const tutoViewedEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/account-management/view-tutorial`;
const versionEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/v1/app-version`;

@Injectable({
  providedIn: 'root',
})
export class AssistanceService {
  private isLoadedSubject: Subject<any> = new Subject<any>();
  private listItemBesoinAide: ItemBesoinAide[] = [];
  private userNumber: string;
  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService,
    private authService: AuthenticationService,
    private sdkDimelo: DimeloCordovaPlugin,
    private localStorageService: LocalStorageService
  ) {}

  setUserNumber(msisdn: string) {
    this.userNumber = msisdn;
  }

  fetchHelpItems(req?: any): Observable<ItemBesoinAide[]> {
    const currentMsisdn = this.dashboardService.getCurrentPhoneNumber();
    return this.authService.getSubscription(currentMsisdn).pipe(
      switchMap((sub: SubscriptionModel) => {
        const codeFormule = sub.code;
        if (!codeFormule) return of([]);
        req = { ...req, formule: codeFormule };
        return this.queryBesoinAides(req);
      })
    );
  }

  getListItemBesoinAide() {
    return this.listItemBesoinAide;
  }
  queryBesoinAides(req?: any): Observable<ItemBesoinAide[]> {
    const options = createRequestOption(req);
    return this.http.get<ItemBesoinAide[]>(`${ASSISTANCE_ENDPOINT}`, {
      params: options,
    });
  }

  tutoViewed() {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    return this.http.get(`${tutoViewedEndpoint}/${msisdn}`);
  }

  getStatusLoadingBesoinAideItems() {
    return this.isLoadedSubject.asObservable();
  }

  getAppVersionPublished() {
    return this.http.get(`${versionEndpoint}`);
  }

  openIbouDimeloChat() {
    const user: InfosAbonneModel = this.localStorageService.getFromLocalStorage('userInfos');
    const username = `${user?.givenName} ${user?.familyName}`;
    const msisdn = this.dashboardService.getMainPhoneNumber();

    this.sdkDimelo.openChat(username, msisdn).then(
      () => {
        console.log('chat open');
      },
      err => {
        console.log('chat not open', err);
      }
    );
  }
}
