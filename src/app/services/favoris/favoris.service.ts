import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { OM_FAVORITES_ENDPOINT, OM_SAVE_RAPIDO_FAVORITES_ENDPOINT } from '../utils/om.endpoints';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { FAVORITE_PASS_ENDPOINT, FAVORITE_PASS_ENDPOINT_LIGHT } from '../utils/conso.endpoint';
import { FavoritePassOemModel } from 'src/app/models/favorite-pass-oem.model';
import { OPERATION_TYPE_SENEAU_BILLS, OPERATION_TYPE_SENELEC_BILLS } from 'src/app/utils/operations.constants';
import { FavoriteType } from 'src/app/models/enums/om-favori-type.enum';
import { XEWEUL_SAVE_CARD_ENDPOINT } from '../utils/counter.endpoints';
import { LocalStorageService } from '../localStorage-service/local-storage.service';
import { LOCAL_STORAGE_KEYS } from 'src/shared';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
const { FAVORITE_PASS_CACHE_DURATION } = environment;
@Injectable({
  providedIn: 'root',
})
export class FavorisService {
  constructor(
    private http: HttpClient,
    private omService: OrangeMoneyService,
    private dashbService: DashboardService,
    private locStorageService: LocalStorageService
  ) {}

  fetchFavorites(service: string) {
    return this.omService.getOmMsisdn().pipe(
      switchMap(omPhonenumber => {
        return this.http.get(`${OM_FAVORITES_ENDPOINT}?msisdn=${omPhonenumber}`).pipe(
          map((r: any) => {
            const error: boolean = !(r && (r.status_code === 'Success-001' || r.content.data.status === '200'));
            if (error) {
              return [];
            }

            const typeFavoris: any = r && r.content ? r.content.data.type_favoris : [];
            if (typeFavoris) {
              const favoris = typeFavoris.find(favoris => {
                return favoris.label === service;
              });
              if (favoris && favoris.liste_favoris && favoris.liste_favoris.length) {
                return favoris.liste_favoris;
              }
            }
            return [];
          })
        );
      })
    );
  }

  favoritesByService(service: string) {
    return this.omService.getOmMsisdn().pipe(
      switchMap(omPhonenumber => {
        return this.http.get(`${OM_FAVORITES_ENDPOINT}/${omPhonenumber.trim()}?service=${service}`).pipe(
          map((r: any) => {
            const error: boolean = !(r && (r.status_code === 'Success-001' || r.content.data.status === '200'));

            if (error) {
              return [];
            }
            const typeFavoris: any = r && r.content ? r.content.data.type_favoris : [];
            return typeFavoris && typeFavoris.length ? typeFavoris[0].liste_favoris : [];
          })
        );
      })
    );
  }

  saveRapidoFavorite(data: { msisdn: string; card_num: string; card_label: string }) {
    return this.http.post(OM_SAVE_RAPIDO_FAVORITES_ENDPOINT, data);
  }

  saveXeweulFavorite(data: { msisdn: string; card_num: string; card_label: string }) {
    return this.http.post(XEWEUL_SAVE_CARD_ENDPOINT + `/${data.msisdn}`, data);
  }

  saveFavorite(data: { msisdn: string; service_code: string; ref_num: string; ref_label: string }) {
    return this.http.post(`${OM_FAVORITES_ENDPOINT}`, data);
  }

  getFavoritePass() {
    const userPhoneNumber = this.dashbService.getCurrentPhoneNumber();
    let endpointFavoritePass = FAVORITE_PASS_ENDPOINT;
    const favoritePassLastUpdateTime = this.locStorageService.getFromLocalStorage(
      LOCAL_STORAGE_KEYS.FAVORITE_PASS_CACHE_SET_TIME + `_${userPhoneNumber}`
    );
    const favoriteCacheExpired = Date.now() - favoritePassLastUpdateTime > FAVORITE_PASS_CACHE_DURATION;
    if (favoriteCacheExpired) {
      return this.http.get(`${endpointFavoritePass}/${userPhoneNumber}`).pipe(
        map((res: FavoritePassOemModel) => {
          const result = { passInternets: [], passIllimixes: [] };
          if (res.passInternets.length) {
            result.passInternets = this.returnValidPassItems(res.passInternets);
          }
          if (res.passIllimixes.length) {
            result.passIllimixes = this.returnValidPassItems(res.passIllimixes);
          }
          if (result.passInternets.length || result.passIllimixes.length) {
            this.locStorageService.saveToLocalStorage(
              LOCAL_STORAGE_KEYS.FAVORITE_PASS_CACHE_SET_TIME + `_${userPhoneNumber}`,
              Date.now()
            );
            this.locStorageService.saveToLocalStorage(
              LOCAL_STORAGE_KEYS.FAVORITE_PASS_DATA + `_${userPhoneNumber}`,
              result
            );
          }
          return result;
        })
      );
    } else {
      const data = this.locStorageService.getFromLocalStorage(
        LOCAL_STORAGE_KEYS.FAVORITE_PASS_DATA + `_${userPhoneNumber}`
      );
      return of(data);
    }
  }

  returnValidPassItems(list: any[]) {
    let result: any[] = [];
    if (list && list.length) {
      result = list.filter((val: any) => {
        return val.actif;
      });
    }
    return result;
  }

  getFavoriteCode(operation: string) {
    switch (operation) {
      case OPERATION_TYPE_SENELEC_BILLS:
        return FavoriteType.SENELEC;
      case OPERATION_TYPE_SENEAU_BILLS:
        return FavoriteType.SENEAU;
    }
  }
}
