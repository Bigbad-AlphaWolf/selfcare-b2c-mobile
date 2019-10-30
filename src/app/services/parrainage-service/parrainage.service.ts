import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const { SERVER_API_URL, ACCOUNT_MNGT_SERVICE } = environment;
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { SponseeModel } from 'src/shared';
const isSponsorEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/sponsors`;
const createSponsorEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/sponsees`;
const sendSMSRappelEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/sponsees/send-sms`;
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
  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService
  ) {}

  isSponsor() {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    return this.http.get(`${isSponsorEndpoint}/${msisdn}/check`);
  }

  createSponsor(msisdn: string) {
    const msisdnSponsor = this.dashboardService.getCurrentPhoneNumber();
    const payload = { msisdn, msisdnSponsor };
    // return of('').pipe(delay(2000));
    return this.http.post(`${createSponsorEndpoint}`, payload);
  }

  sendSMSRappel(dMsisdn: string) {
    const sMsisdn = this.dashboardService.getCurrentPhoneNumber();
    const payload = { sMsisdn, dMsisdn };
    // return of('').pipe(delay(2000));
    return this.http.post(`${sendSMSRappelEndpoint}`, payload);
  }

  getCurrentMsisdnSponsees() {
    const currentMsisdn = this.dashboardService.getCurrentPhoneNumber();
    // return of(mockSponsees);
    return this.http.get(`${createSponsorEndpoint}/${currentMsisdn}`);
  }
}
