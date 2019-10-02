import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  DashboardService,
  downloadEndpoint
} from '../dashboard-service/dashboard.service';
import { BannierePubModel } from '../dashboard-service';

const { SERVER_API_URL, CONSO_SERVICE } = environment;

const endpointBanniere = `${SERVER_API_URL}/${CONSO_SERVICE}/api/bannieres-by-formule`;

@Injectable({
  providedIn: 'root'
})
export class BanniereService {
  private listBanniereUserFormule: BannierePubModel[] = [];
  private isLoadedSubject: Subject<any> = new Subject<any>();
  constructor(private http: HttpClient, private dashb: DashboardService) {}

  setListBanniereByFormule() {
    const currentNumber = this.dashb.getCurrentPhoneNumber();
    this.dashb
      .getCodeFormuleOfMsisdn(currentNumber)
      .subscribe((code: string) => {
        if (code !== 'error') {
          this.queryListBanniereByFormule(code).subscribe(
            (res: BannierePubModel[]) => {
              this.listBanniereUserFormule = res;
              this.isLoadedSubject.next(true);
            }
          );
        }
      });
  }

  queryListBanniereByFormule(codeFormule: string) {
    return this.http.get(`${endpointBanniere}/${codeFormule}`);
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
}
