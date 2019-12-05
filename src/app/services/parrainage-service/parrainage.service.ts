import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const { SERVER_API_URL, ACCOUNT_MNGT_SERVICE } = environment;
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { SponseeModel } from 'src/shared';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
const isSponsorEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/sponsors`;
const createSponseeEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/sponsees`;
const getSponseesByMsisdnEndpoint = `${createSponseeEndpoint}/by-account`;
const sendSMSRappelEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/sponsees/send-sms`;
const mockSponsees: SponseeModel[] = [
  {
    id: 1,
    msisdn: '775896287',
    firstName: 'Pape Abdoulaye',
    lastName: 'KEBE',
    effective: true,
    createdDate: '',
    enabled: true
  },
  {
    id: 2,
    msisdn: '771331225',
    firstName: 'Momar',
    lastName: 'KEBE',
    effective: false,
    createdDate: '',
    enabled: true
  },
  {
    id: 3,
    msisdn: '775109027',
    firstName: 'Mor Talla',
    lastName: 'KEBE',
    effective: true,
    createdDate: '',
    enabled: true
  },
  {
    id: 4,
    msisdn: '771022835',
    firstName: 'Fatou Bintou',
    lastName: 'KEBE',
    effective: false,
    createdDate: '',
    enabled: true
  },
  {
    id: 5,
    msisdn: '777559155',
    firstName: 'Ndeye Astou',
    lastName: 'KEBE',
    effective: true,
    createdDate: '',
    enabled: true
  }
];
@Injectable({
  providedIn: 'root'
})
export class ParrainageService {
  isSponsorSubject: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService
  ) {}

  get isSponsorEvent() {
    return this.isSponsorSubject.asObservable();
  }

  isSponsor() {
    const msisdn = this.dashboardService.getMainPhoneNumber();
    return this.http.get(`${isSponsorEndpoint}/${msisdn}/check`).pipe(
      map(res => {
        if (res) {
          this.isSponsorSubject.next();
        }
      })
    );
  }

  createSponsee(params: { msisdn: string; firstName: string }) {
    const msisdnSponsor = this.dashboardService.getMainPhoneNumber();
    const payload = Object.assign({}, params, { msisdnSponsor });
    // return of('').pipe(delay(2000));
    return this.http.post(`${createSponseeEndpoint}`, payload);
  }

  sendSMSRappel(dMsisdn: string) {
    const sMsisdn = this.dashboardService.getMainPhoneNumber();
    return this.http.post(
      `${sendSMSRappelEndpoint}?sMsisdn=${sMsisdn}&dMsisdn=${dMsisdn}`,
      {}
    );
  }

  getCurrentMsisdnSponsees() {
    const currentMsisdn = this.dashboardService.getMainPhoneNumber();
    return this.http.get(`${getSponseesByMsisdnEndpoint}/${currentMsisdn}`);
    // return of(mockSponsees);
  }
}
