import { Injectable } from '@angular/core';
import { Subject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DashboardService, downloadEndpoint, downloadAvatarEndpoint } from '../dashboard-service/dashboard.service';
import { BannierePubModel } from '../dashboard-service';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { SubscriptionModel } from 'src/app/dashboard';
import { DATA_BANNIERES, DATA_OFFRES_SERVICES } from 'src/app/utils/data';

const { SERVER_API_URL, CONSO_SERVICE } = environment;

const endpointBanniere = `${SERVER_API_URL}/${CONSO_SERVICE}/api/bannieres-by-formule`;

@Injectable({
  providedIn: 'root'
})
export class BanniereService {
  private listBanniereUserFormule: BannierePubModel[] = [];
  private isLoadedSubject: Subject<any> = new Subject<any>();
  displays : string[] = [];

  constructor(private http: HttpClient, private dashb: DashboardService, private authServ: AuthenticationService) {}

  setListBanniereByFormule() {
    const currentNumber = this.dashb.getCurrentPhoneNumber();
    this.authServ.getSubscription(currentNumber).subscribe((res: SubscriptionModel) => {
      if (res && res.code && res.profil) {
        this.queryListBanniereByFormule(res.code).subscribe((res: BannierePubModel[]) => {
          this.listBanniereUserFormule = res;
          if (res.length) {
            res.map((item: BannierePubModel) => {
              item.image = downloadAvatarEndpoint + item.image;
            });
          }
          this.isLoadedSubject.next(true);
        });
      }
    });
  }

  queryListBanniereByFormule(codeFormule: string, zone_affichage:string='dashboard') {
    // if(zone_affichage !== 'dashboard')
    // return of(DATA_BANNIERES);
    return this.http.get(`${endpointBanniere}/${codeFormule}?zone=${zone_affichage}`);
  }

  getListBanniereByFormule() {
    return this.listBanniereUserFormule;
  }

  getStatusLoadingBanniere() {
    return this.isLoadedSubject.asObservable();
  }

  getFullUrlImage() {
    return downloadEndpoint;
  }

  title(description:string){
    if(!description) return;
    this.displays = description.split(';');
    return this.displays.length > 0 ? this.displays[0] : null;
  }
  details(description:string){
    if(!description) return;
    this.displays = description.split(';');
    return this.displays.length > 1 ? this.displays[1] : null;
  }
  autre(description:string){
    if(!description) return;
    this.displays = description.split(';');
    return this.displays.length > 2 ? this.displays[2] : null;
  }
}
