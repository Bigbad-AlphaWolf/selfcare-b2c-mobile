import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  DashboardService,
  downloadEndpoint,
} from '../dashboard-service/dashboard.service';
import { BannierePubModel } from '../dashboard-service';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { SubscriptionModel } from 'src/app/dashboard';
import { map, switchMap, tap } from 'rxjs/operators';
import { ZoneBanniere } from 'src/app/models/enums/zone-banniere.enum';
import { FILE_DOWNLOAD_ENDPOINT } from '../utils/file.endpoints';

const { SERVER_API_URL, CONSO_SERVICE } = environment;

const endpointBanniere = `${SERVER_API_URL}/${CONSO_SERVICE}/api/bannieres-by-formule`;
// Endpoint Light
const endpointBanniereLight = `${SERVER_API_URL}/${CONSO_SERVICE}/api/light/bannieres-by-formule`;

@Injectable({
  providedIn: 'root',
})
export class BanniereService {
  private listBanniereUserFormule: BannierePubModel[] = [];
  private isLoadedSubject: Subject<any> = new Subject<any>();
  displays: string[] = [];

  bannieres: any[];

  constructor(
    private http: HttpClient,
    private dashb: DashboardService,
    private authServ: AuthenticationService
  ) {}

  setListBanniereByFormule() {
    const currentNumber = this.dashb.getCurrentPhoneNumber();
    this.authServ
      .getSubscriptionForTiers(currentNumber)
      .subscribe((res: SubscriptionModel) => {
        if (res && res.code && res.profil) {
          this.queryListBanniereByFormule(res.code).subscribe(
            (res: BannierePubModel[]) => {
              this.listBanniereUserFormule = res;
              if (res.length) {
                res.map((item: BannierePubModel) => {
                  item.image = FILE_DOWNLOAD_ENDPOINT + '/' + item.image;
                });
              }
              this.isLoadedSubject.next(true);
            }
          );
        }
      });
  }

  queryListBanniereByFormule(
    codeFormule: string,
    zone_affichage: ZoneBanniere = ZoneBanniere.dashboard
  ) {
    return this.http
      .get(`${endpointBanniere}/${codeFormule}?zone=${zone_affichage}`)
      .pipe(
        tap((r: any[]) => {
          if (zone_affichage === ZoneBanniere.offre) this.bannieres = r;
        })
      );
  }

  getListBanniereByFormuleByZone(
    hmac?: string,
    zone_affichage: ZoneBanniere = ZoneBanniere.dashboard
  ) {
    const currentNumber = this.dashb.getCurrentPhoneNumber();
    let queryParams = '';
    let endpoint = endpointBanniere
    if(hmac && hmac !== '') {
      endpoint = endpointBanniereLight
      queryParams += `&hmac=${hmac}&msisdn=${currentNumber}`
    }
    return this.authServ
      .getSubscriptionForTiers(currentNumber).pipe(switchMap((userInfos: SubscriptionModel) => {
        return this.http
        .get(`${endpoint}/${userInfos.code}?zone=${zone_affichage}${queryParams}`)
        .pipe(
          map((res: any []) => {
            if (res.length) {
              return res.map((item: BannierePubModel) => {
                item.image = FILE_DOWNLOAD_ENDPOINT + '/' + item.image;
                return item;
              });
            }
          }),
          tap((r: any[]) => {
            if (zone_affichage === ZoneBanniere.offre) this.bannieres = r;
          })
        );
      }))
  }


  getStatusLoadingBanniere() {
    return this.isLoadedSubject.asObservable();
  }

  getFullUrlImage() {
    return downloadEndpoint;
  }

  title(description: string) {
    if (!description) return;
    this.displays = description.split(';');
    return this.displays.length > 0 ? this.displays[0] : null;
  }
  details(description: string) {
    if (!description) return;
    this.displays = description.split(';');
    return this.displays.length > 1 ? this.displays[1] : null;
  }
  autre(description: string) {
    if (!description) return;
    this.displays = description.split(';');
    return this.displays.length > 2 ? this.displays[2] : null;
  }
}
