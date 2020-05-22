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
  mockDataPlans: OfferPlan[] = [
    {
        "bpTarget": "Pass internet 75 Mo 250F",
        "bpValidityDurability": " 100% bonus sous 4h",
        "typeMPO": "INTERNET",
        "price": {
            "currencyCode": "CFA",
            "taxIncludedAmount": "0.0"
        },
        "productOfferingId": "75Mo_100%bonus_14052020",
        "canBeSubscribed": true,
        "description": "Bonjour cher client, jusqu a demain , protitez de 100% de bonus sous 4h pour tout achat d'un pass internet 75Mo. #144#4*1*3*4# & #1234#1*1*1*1#",
        "productOfferingName": "Pass internet 75 Mo 250F= 100% bonus sous 4h"
    },
    {
        "bpTarget": "Pass internet 75 Mo 250F",
        "bpValidityDurability": " 100% bonus sous 4h",
        "typeMPO": "ILLIMIX",
        "price": {
            "currencyCode": "CFA",
            "taxIncludedAmount": "0.0"
        },
        "productOfferingId": "75Mo_100%bonus_14052020",
        "canBeSubscribed": true,
        "description": "Bonjour cher client, jusqu a demain , protitez de 100% de bonus sous 4h pour tout achat d'un pass internet 75Mo. #144#4*1*3*4# & #1234#1*1*1*1#",
        "productOfferingName": "Pass internet 75 Mo 250F= 100% bonus sous 4h"
    },
    {
        "bpTarget": "Pass internet 75 Mo 250F",
        "bpValidityDurability": " 100% bonus sous 4h",
        "typeMPO": "SARGAL",
        "price": {
            "currencyCode": "CFA",
            "taxIncludedAmount": "0.0"
        },
        "productOfferingId": "75Mo_100%bonus_14052020",
        "canBeSubscribed": true,
        "description": "Bonjour cher client, jusqu a demain , protitez de 100% de bonus sous 4h pour tout achat d'un pass internet 75Mo. #144#4*1*3*4# & #1234#1*1*1*1#",
        "productOfferingName": "Pass internet 75 Mo 250F= 100% bonus sous 4h"
    },
    {
        "bpTarget": "Pass internet 5 Mo 250F",
        "bpValidityDurability": " 100% bonus sous 4h",
        "typeMPO": "INTERNET",
        "price": {
            "currencyCode": "CFA",
            "taxIncludedAmount": "0.0"
        },
        "productOfferingId": "75Mo_100%bonus_14052020",
        "canBeSubscribed": true,
        "description": "Bonjour cher client, jusqu a demain , protitez de 100% de bonus sous 4h pour tout achat d'un pass internet 75Mo. #144#4*1*3*4# & #1234#1*1*1*1#",
        "productOfferingName": "Pass internet 75 Mo 250F= 100% bonus sous 4h"
    },
    {
        "bpTarget": "Inscription SARGAL",
        "bpValidityDurability": "1000F bonus sous 4h",
        "typeMPO": "AUTRES",
        "price": {
            "currencyCode": "CFA",
            "taxIncludedAmount": "0.0"
        },
        "productOfferingId": "InscriptionSARGAL_1000Fbonus_14052020",
        "canBeSubscribed": true,
        "description": "Bonjour cher client, jusqu a demain , inscrivez-vous sur SARGAL et gagnez 1000F de bonus sous 4h credit. #221#1#",
        "productOfferingName": "Inscription SARGAL=1000F bonus sous 4h"
    }
];
  constructor(private http: HttpClient, private dashbServ: DashboardService) { }

  getCurrentUserOfferPlans(){
    const msisdn = this.dashbServ.getCurrentPhoneNumber();
    return of(this.mockDataPlans);
    // return this.http.get(`${getCurrentUserOfferPlansEndpoint}/${msisdn}`);
  }
}
