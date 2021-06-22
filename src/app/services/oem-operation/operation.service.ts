import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  CategoryOffreServiceModel,
  OffreService,
} from 'src/app/models/offre-service.model';
import { SubscriptionModel } from 'src/shared';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { FILE_DOWNLOAD_ENDPOINT } from '../utils/file.endpoints';

import {
  OFFRE_SERVICES_ENDPOINT,
  ALL_SERVICES_ENDPOINT,
  OFFER_SERVICE_BY_CODE,
} from '../utils/services.endpoints';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  offresServices: any[];
  FILE_MANAGER_BASE_URL = FILE_DOWNLOAD_ENDPOINT;
  static AllOffers: OffreService[] = [];

  constructor(
    private http: HttpClient,
    private appVersion: AppVersion,
    private dashboardService: DashboardService,
    private authenticationService: AuthenticationService
  ) {}

  initServicesData(codeFormule?: string) {
    let endpointOffresServices = OFFRE_SERVICES_ENDPOINT;
    if (codeFormule) {
      endpointOffresServices += `/${codeFormule}?typeResearch=FORMULE`;
    }
    return this.http.get(endpointOffresServices).pipe(
      switchMap((subcategories: CategoryOffreServiceModel[]) => {
        return this.getServicesByFormule().pipe(
          map((services) => {
            let categories: CategoryOffreServiceModel[];
            // get array of array of parent categories (eg: [[cat1], [cat2], [cat3]])
            const categoriesArray = subcategories.map((sub) => {
              return sub.categorieOffreServices;
            });

            // concat to get parent categories like [cat1, cat2, cat3]
            categories = [].concat.apply([], categoriesArray);

            // filter to remove duplicates
            categories = categories.filter(
              (category, categoryIndex, array) =>
                array.findIndex((t) => t.id === category.id) === categoryIndex
            );

            // insert into every parent category its subcategories
            categories.forEach((element) => {
              element.categorieOffreServices = [];
              for (let subCategory of subcategories) {
                if (
                  subCategory.categorieOffreServices &&
                  subCategory.categorieOffreServices
                    .map((s) => s.id)
                    .includes(element.id)
                ) {
                  element.categorieOffreServices.push(subCategory);
                }
              }
            });
            // categories = categories.flat(1);
            return { categories, services };
          })
        );
      })
    );
  }

  sortByOrdre(arr: any[]) {
    return arr.sort((r1, r2) => r1.ordre - r2.ordre);
  }

  getAllServices() {
    return this.http.get(`${ALL_SERVICES_ENDPOINT}?page=0&size=100`);
  }

  getServicesByFormule(category?: string, isBesoinAide?: boolean) {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    return this.authenticationService.getSubscription(msisdn).pipe(
      switchMap((customerOffer: SubscriptionModel) => {
        const versionObservable = from(this.appVersion.getVersionNumber());
        let queryParams = `?code=${customerOffer.code}`;
        if (category) queryParams += `&categorie=${category}`;
        if (isBesoinAide) queryParams += `&besoinAide=${isBesoinAide}`;
        return versionObservable.pipe(
          switchMap((appVersion) => {
            queryParams += `&version=${appVersion}`;
            return this.http
              .get<OffreService[]>(`${OFFER_SERVICE_BY_CODE}${queryParams}`)
              .pipe(
                map((res) => {
                  for (let offerService of res) {
                    this.prefixServiceImgByFileServerUrl(offerService);
                  }
                  return res;
                })
              );
          }),
          catchError(() => {
            return this.http
              .get<OffreService[]>(`${OFFER_SERVICE_BY_CODE}${queryParams}`)
              .pipe(
                map((res) => {
                  for (let offerService of res) {
                    this.prefixServiceImgByFileServerUrl(offerService);
                  }
                  return res;
                })
              );
          })
        );
      })
    );
  }

  prefixServiceImgByFileServerUrl(offerService: OffreService) {
    offerService.icone = offerService.icone
      ? `${this.FILE_MANAGER_BASE_URL}/${offerService.icone}`
      : '';
    offerService.banniere = offerService.banniere
      ? `${this.FILE_MANAGER_BASE_URL}/${offerService.banniere}`
      : '';
    // offerService.iconeBackground = offerService.iconeBackground
    //   ? `${this.FILE_MANAGER_BASE_URL}/${offerService.iconeBackground}`
    //   : '';
  }
}
