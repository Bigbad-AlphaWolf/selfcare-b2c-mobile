import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { BonusTransferThresholdModel, BONUS_TRANSFER_THRESHOLD_STORAGE_KEY, DEFAULT_BONUS_TRANSFER_THRESHOLD } from 'src/app/models/bonus-transfer-threshold.model';
import {
  CategoryOffreServiceModel,
  OffreService,
} from 'src/app/models/offre-service.model';
import { mapOffreServiceWithCodeOM } from 'src/app/utils/bills.util';
import { checkStorageElementHasExpired, SubscriptionModel } from 'src/shared';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { FILE_DOWNLOAD_ENDPOINT } from '../utils/file.endpoints';

import {
  OFFRE_SERVICES_ENDPOINT,
  ALL_SERVICES_ENDPOINT,
  OFFER_SERVICE_BY_CODE,
  TRANSFER_BONUS_THRESHOLD_ENDPOINT
} from '../utils/services.endpoints';
import * as SecureLS from 'secure-ls';
import { LocalStorageService } from '../localStorage-service/local-storage.service';
const ls = new SecureLS({ encodingType: 'aes' });
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
    private authenticationService: AuthenticationService,
    private localStorageService: LocalStorageService
  ) {}

  initServicesData(codeFormule?: string, getFromLocalStorage?: boolean){
    let endpointOffresServices = OFFRE_SERVICES_ENDPOINT;
    if (codeFormule) {
      endpointOffresServices += `/${codeFormule}?typeResearch=FORMULE`;
    }
    return this.http.get(endpointOffresServices).pipe(
      switchMap((subcategories: CategoryOffreServiceModel[]) => {
        return this.getServicesByFormule(null, null, getFromLocalStorage).pipe(
          map(services => {
            let categories: CategoryOffreServiceModel[];
            // get array of array of parent categories (eg: [[cat1], [cat2], [cat3]])
            const categoriesArray = subcategories.map(sub => {
              return sub.categorieOffreServices;
            });

            // concat to get parent categories like [cat1, cat2, cat3]
            categories = [].concat.apply([], categoriesArray);

            // filter to remove duplicates
            categories = categories.filter(
              (category, categoryIndex, array) => array.findIndex(t => t.id === category.id) === categoryIndex
            );

            // insert into every parent category its subcategories
            categories.forEach(element => {
              element.categorieOffreServices = [];
              for (let subCategory of subcategories) {
                if (subCategory.categorieOffreServices && subCategory.categorieOffreServices.map(s => s.id).includes(element.id)) {
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

  getServicesByFormule(category?: string, isBesoinAide?: boolean, getFromLocalStorage?: boolean) {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    const key = `${msisdn}_${category ? category : ''}_${isBesoinAide ? 'ASSISTANCE_' : ''}OFFERS_SERVICES_STORAGE_KEY`;
    const dataFromStorage = this.localStorageService.getFromLocalStorage(key);
    const hasExpired = checkStorageElementHasExpired(key, 10 * 60 * 1000);
    if ((getFromLocalStorage && dataFromStorage) || !hasExpired) {
      return of(dataFromStorage);
    }
    return this.authenticationService.getSubscription(msisdn).pipe(
      switchMap((customerOffer: SubscriptionModel) => {
        const versionObservable = from(this.appVersion.getVersionNumber());
        let queryParams = `?code=${customerOffer.code}`;
        if (category) queryParams += `&categorie=${category}`;
        if (isBesoinAide) queryParams += `&besoinAide=${isBesoinAide}`;
        return versionObservable.pipe(
          switchMap(appVersion => {
            queryParams += `&version=${appVersion}`;
            return this.http.get<OffreService[]>(`${OFFER_SERVICE_BY_CODE}${queryParams}`).pipe(
              map(res => {
                for (let offerService of res) {
                  this.prefixServiceImgByFileServerUrl(offerService);
                }
                return res;
              }),
              map(res => {
                const resp = res.map((item: OffreService) => {
                  return mapOffreServiceWithCodeOM(item);
                });
                this.localStorageService.saveToLocalStorage(`${key}_last_update`, Date.now());
                this.localStorageService.saveToLocalStorage(key, resp);
                return resp;
              }),
              catchError(err => {
                if (dataFromStorage) return of(dataFromStorage);
                return throwError(err);
              })
            );
          }),
          catchError(() => {
            return this.http.get<OffreService[]>(`${OFFER_SERVICE_BY_CODE}${queryParams}`).pipe(
              map(res => {
                for (let offerService of res) {
                  this.prefixServiceImgByFileServerUrl(offerService);
                }
                return res;
              }),
              map(res => {
                const resp = res.map((item: OffreService) => {
                  return mapOffreServiceWithCodeOM(item);
                });
                this.localStorageService.saveToLocalStorage(`${key}_last_update`, Date.now());
                this.localStorageService.saveToLocalStorage(key, resp);
                return resp;
              })
            );
          })
        );
      })
    );
  }

  prefixServiceImgByFileServerUrl(offerService: OffreService) {
    offerService.icone = offerService.icone ? `${this.FILE_MANAGER_BASE_URL}/${offerService.icone}` : '';
    offerService.banniere = offerService.banniere ? `${this.FILE_MANAGER_BASE_URL}/${offerService.banniere}` : '';
  }

  getTransferBonusMinMaxAmount() {
    const hasThresholdInStorageExpired = checkStorageElementHasExpired(BONUS_TRANSFER_THRESHOLD_STORAGE_KEY);
    const transferBonusThreshold: BonusTransferThresholdModel = ls.get(BONUS_TRANSFER_THRESHOLD_STORAGE_KEY);
    if (!hasThresholdInStorageExpired) {
      return of(transferBonusThreshold);
    }
    return this.http.get<BonusTransferThresholdModel>(TRANSFER_BONUS_THRESHOLD_ENDPOINT).pipe(
      tap((thresholds: BonusTransferThresholdModel) => {
        ls.set(BONUS_TRANSFER_THRESHOLD_STORAGE_KEY, thresholds);
        ls.set(BONUS_TRANSFER_THRESHOLD_STORAGE_KEY + '_last_update', Date.now());
        return thresholds;
      }),
      catchError(err => {
        if (transferBonusThreshold) return of(transferBonusThreshold);
        return of(DEFAULT_BONUS_TRANSFER_THRESHOLD);
      })
    );
  }
}
