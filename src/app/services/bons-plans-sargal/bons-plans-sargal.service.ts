import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { BonPlanSargalCategoryModel, BonPlanSargalModel } from 'src/app/models/bons-plans-sargal.model';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { DashboardService } from '../dashboard-service/dashboard.service';
const { SARGAL_SERVICE, SERVER_API_URL } = environment;

const BONS_PLANS_SARGAL_BASE_URL = `${SERVER_API_URL}/${SARGAL_SERVICE}/api`;
const BONS_PLANS_SARGAL_CAT_BASE_URL = `${BONS_PLANS_SARGAL_BASE_URL}/category-partners`;
const BONS_PLANS_SARGAL_URL = `${BONS_PLANS_SARGAL_BASE_URL}/bon-plan-sargal`;
@Injectable({
  providedIn: 'root',
})
export class BonsPlansSargalService {
  constructor(private http: HttpClient, private dashboardService: DashboardService, private authService: AuthenticationService) {}

  getBonsPlansSargal(categoryId?) {
    const categoryQueryParam = categoryId ? `&category=${categoryId}` : "";
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    return this.authService.getSubscription(msisdn).pipe(
      switchMap(sub => {
        return this.http.get<BonPlanSargalModel[]>(`${BONS_PLANS_SARGAL_URL}/${msisdn}/all?formules=${sub?.code}${categoryQueryParam}`);
      })
    );
  }

  getBonsPlansSargalCategories() {
    return this.http.get<BonPlanSargalCategoryModel[]>(`${BONS_PLANS_SARGAL_CAT_BASE_URL}?size=30`);
  }
}
