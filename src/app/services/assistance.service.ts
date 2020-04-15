import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { DashboardService } from './dashboard-service/dashboard.service';
import { AuthenticationService } from './authentication-service/authentication.service';
import { environment } from 'src/environments/environment';
import { ItemBesoinAide, SubscriptionModel } from 'src/shared';

const { SERVICES_SERVICE, SERVER_API_URL, ACCOUNT_MNGT_SERVICE } = environment;
const questionsAnswersEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/besoin-aides/by-profil-formule`;
const tutoViewedEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/account-management/view-tutorial`;
const versionEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/v1/app-version`;

@Injectable({
  providedIn: 'root'
})
export class AssistanceService {
  private isLoadedSubject: Subject<any> = new Subject<any>();
  private listItemBesoinAide: ItemBesoinAide[] = [];
  private userNumber: string;
  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService,
    private authService: AuthenticationService
  ) {}

  setUserNumber(msisdn: string) {
    this.userNumber = msisdn;
  }

  setListItemBesoinAide() {
    this.listItemBesoinAide = [];
    this.authService
      .getSubscription(this.userNumber)
      .subscribe((sub: SubscriptionModel) => {
        const codeFormule = sub.code;
        if (codeFormule !== 'error') {
          this.getAssistanceFAQ(codeFormule).subscribe(
            (res: ItemBesoinAide[]) => {
              if (res.length) {
                res.sort((item1: ItemBesoinAide, item2: ItemBesoinAide) => {
                  if (item1 && item2) {
                    return item2.priorite - item1.priorite;
                  }
                });
                this.listItemBesoinAide = res.filter(x => {
                  if (x) {
                    return x.actif;
                  }
                });
              }
              this.isLoadedSubject.next(true);
            },
            (err: any) => {
              this.isLoadedSubject.next(true);
            }
          );
        }
      });
  }

  getListItemBesoinAide() {
    return this.listItemBesoinAide;
  }
  getAssistanceFAQ(codeFormule: string) {
    return this.http.get(`${questionsAnswersEndpoint}/formule/${codeFormule}`);
  }

  tutoViewed() {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    return this.http.get(`${tutoViewedEndpoint}/${msisdn}`);
  }

  getStatusLoadingBesoinAideItems() {
    return this.isLoadedSubject.asObservable();
  }

  getAppVersionPublished(){
    return this.http.get(`${versionEndpoint}`);
  }
}
