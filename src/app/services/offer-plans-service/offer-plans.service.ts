import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { OfferPlan } from 'src/shared/models/offer-plan.model';
import { of } from 'rxjs';
import { LIST_CATEGORY_BONS_PLANS } from 'src/shared';
import { switchMap, catchError } from 'rxjs/operators';
const { PURCHASES_SERVICE, SERVER_API_URL, SARGAL_SERVICE } = environment;

const getCurrentUserOfferPlansEndpoint = `${SERVER_API_URL}/${PURCHASES_SERVICE}/api/get-mpo`;
const mpoProductOrderEndpoint = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/mpo-product-order`;

@Injectable({
  providedIn: 'root',
})
export class OfferPlansService {
  constructor(private http: HttpClient, private dashbServ: DashboardService) {}

  getCurrentUserOfferPlans() {
    const msisdn = this.dashbServ.getCurrentPhoneNumber();
    return this.http.get(`${getCurrentUserOfferPlansEndpoint}/${msisdn}`);
  }

  orderBonPlanProduct(productOfferingId: string) {
    let msisdn = this.dashbServ.getCurrentPhoneNumber();
    const payload = { msisdn, productOfferingId };
    return this.http.post(`${mpoProductOrderEndpoint}`, payload);
  }

  getUserTypeOfferPlans() {
    let result: {
      hasRecharge: boolean;
      hasPassInternet: boolean;
      hasPassIllimix: boolean;
    } = {
      hasPassIllimix: null,
      hasPassInternet: null,
      hasRecharge: null,
    };
    return this.getCurrentUserOfferPlans().pipe(
      switchMap((res: OfferPlan[]) => {
        const hasRechargeBonPlan = this.findBonPlanOfType(
          res,
          LIST_CATEGORY_BONS_PLANS.recharge
        )
          ? true
          : false;
        const hasPassIllimixBonPlan = this.findBonPlanOfType(
          res,
          LIST_CATEGORY_BONS_PLANS.illimix
        )
          ? true
          : false;
        const hasPassInternetBonPlan = this.findBonPlanOfType(
          res,
          LIST_CATEGORY_BONS_PLANS.internet
        )
          ? true
          : false;
        result.hasRecharge = hasRechargeBonPlan;
        result.hasPassIllimix = hasPassIllimixBonPlan;
        result.hasPassInternet = hasPassInternetBonPlan;

        return of(result);
      }),
      catchError((err: any) => {
        return of(result);
      })
    );
  }

  findBonPlanOfType(listBonsPlan: OfferPlan[], bonPlanType: string) {
    return listBonsPlan.find((item: OfferPlan) => {
      return item.typeMPO.toLowerCase() === bonPlanType.toLowerCase();
    });
  }

  addPrefixOnNumber(phoneNumber: string, prefix: string) {
    if (phoneNumber.length === 9 && !phoneNumber.startsWith(prefix)) {
      return prefix + phoneNumber;
    }
    return phoneNumber;
  }
}
