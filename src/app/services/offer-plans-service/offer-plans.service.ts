import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { OfferPlan } from 'src/shared/models/offer-plan.model';
import { of } from 'rxjs';
const { CONSO_SERVICE, SERVER_API_URL } = environment;


const getCurrentUserOfferPlansEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/get-mpo`;

@Injectable({
  providedIn: 'root'
})
export class OfferPlansService {
  constructor(private http: HttpClient, private dashbServ: DashboardService) { }

  getCurrentUserOfferPlans(){
    const msisdn = this.dashbServ.getCurrentPhoneNumber();
     return this.http.get(`${getCurrentUserOfferPlansEndpoint}/${msisdn}`);
  }
}
