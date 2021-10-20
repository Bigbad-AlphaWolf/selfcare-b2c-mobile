import {Injectable} from '@angular/core';
import {of, Subject} from 'rxjs';
import {DashboardService} from '../dashboard-service/dashboard.service';
import {
  PassInfoModel,
  PromoPassModel,
  PassInternetModel,
  getOrderedListCategory,
  getListPassFilteredByLabelAndPaymentMod
} from 'src/shared';
import {environment} from 'src/environments/environment';
const {SERVER_API_URL, CONSO_SERVICE} = environment;
import {HttpClient} from '@angular/common/http';
import {catchError, map, switchMap} from 'rxjs/operators';
import {AuthenticationService} from '../authentication-service/authentication.service';
const passByIdEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/pass-internets`;
const passByPPIEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/pass-by-ppi`;
@Injectable({
  providedIn: 'root'
})
export class PassInternetService {
  private userCodeFormule: string;
  private listPassInternet: (PassInfoModel | PromoPassModel)[] = [];
  private listCategoryPassInternet: any;
  private listPassInternetShown: any;
  passLoaded: boolean;
  passLoadedSubject: Subject<any> = new Subject<any>();
  hasError: boolean;
  hasErrorSubject: Subject<any> = new Subject<any>();
  constructor(private dashbService: DashboardService, private authenticationService: AuthenticationService, private http: HttpClient) {}

  setUserCodeFormule(msisdn: string) {
    this.userCodeFormule = msisdn;
  }

  getUserCodeFormule() {
    return this.userCodeFormule;
  }

  queryListPassInternetOfUser(codeFormule: string, recipientNumber: string, isLighMod?: boolean) {
    this.setListPassInternetOfUser([]);
    return this.dashbService.getListPassInternet(codeFormule, isLighMod).pipe(
      switchMap(async (res: any[]) => {
        const response: any = await this.dashbService.getListPassByMsisdn('INTERNET', recipientNumber).toPromise();
        const result: any[] = [...res, ...response];
        let responseWithoutDuplication = [];
        responseWithoutDuplication = result.filter((item, index, a) => a.findIndex(t => t.pass?.id === item.pass?.id) === index);
        return responseWithoutDuplication;
      }),
      map((resp: any[]) => {
        if (resp instanceof Array) {
          resp.forEach((x: PassInternetModel) => {
            if (x.pass && x.pass.actif) {
              this.listPassInternet.push(x.pass);
            } else if (x.promoPass && x.promoPass.passPromo.actif) {
              this.listPassInternet.push(x.promoPass);
            }
          });
          // this.listUserPassInternet.sort((a, b) => (+a.tarif > +b.tarif ? 1 : +b.tarif > +a.tarif ? -1 : 0));
          // get from all pass the diffent categories
          const list = resp.map(x => {
            if (x.pass) {
              return x.pass?.categoriePass;
            } else if (x.promoPass) {
              return x.promoPass.passPromo?.categoriePass;
            }
          });

          this.listCategoryPassInternet = getOrderedListCategory(list);
          return list;
        }
      })
    );
  }

  getListPassInternetShown() {
    return this.listPassInternetShown;
  }
  getListPassInternetOfUser() {
    return this.listPassInternet;
  }

  getListCategoryPassInternet() {
    return this.listCategoryPassInternet;
  }

  setListPassInternetOfUser(listPassInternet: any) {
    this.listPassInternet = listPassInternet;
  }

  setListCategoryPassInternet(listCategoryPass: any) {
    this.listCategoryPassInternet = listCategoryPass;
  }

  getStatusPassLoaded() {
    return this.passLoadedSubject.asObservable();
  }

  getPassById(id: number) {
    return this.http.get(`${passByIdEndpoint}/${id}`);
  }

  getPassByPPI(ppi: number) {
    return this.http
      .get(`${passByPPIEndpoint}/${ppi}`)
      .pipe(
        catchError(err => {
          return of({error: err.status});
        })
      )
      .toPromise();
  }

  getPassUsage(serviceCode: string, recipient: string) {
    return this.authenticationService.getSubscriptionForTiers(recipient).pipe(
      switchMap(res => {
        return this.dashbService.getListPassInternet(res.code, false, serviceCode).pipe(
          map((listPass: any[]) => {
            return listPass.map(x => x.pass);
          })
        );
      })
    );
  }
}
