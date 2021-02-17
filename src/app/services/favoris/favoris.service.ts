import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import {
  OM_FAVORITES_ENDPOINT,
  OM_SAVE_RAPIDO_FAVORITES_ENDPOINT,
} from '../utils/om.endpoints';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { FAVORITE_PASS_ENDPOINT } from '../utils/conso.endpoint';
import { FavoritePassOemModel } from 'src/app/models/favorite-pass-oem.model';
import { PassInfoModel } from 'src/shared';

@Injectable({
  providedIn: 'root',
})
export class FavorisService {
  constructor(
    private http: HttpClient,
    private omService: OrangeMoneyService,
    private dashbService: DashboardService
  ) {}

  fetchFavorites(service: string) {
    return this.omService.getOmMsisdn().pipe(
      switchMap((omPhonenumber) => {
        return this.http
          .get(`${OM_FAVORITES_ENDPOINT}?msisdn=${omPhonenumber}`)
          .pipe(
            map((r: any) => {
              let error: boolean = !(
                r &&
                (r.status_code === 'Success-001' ||
                  r.content.data.status === '200')
              );
              if (error) return [];

              let typeFavoris: any = r && r.content ? r.content.data.type_favoris : [] ;
              if (typeFavoris) {
                const favoris = typeFavoris.find((favoris) => {
                  return favoris.label === service;
                });
                if (
                  favoris &&
                  favoris.liste_favoris &&
                  favoris.liste_favoris.length
                )
                  return favoris.liste_favoris;
              }
              return [];
            })
          );
      })
    );
  }

  favoritesByService(service: string) {
    return this.omService.getOmMsisdn().pipe(
      switchMap((omPhonenumber) => {
        return this.http
          .get(
            `${OM_FAVORITES_ENDPOINT}/${omPhonenumber.trim()}?service=${service}`
          )
          .pipe(
            map((r: any) => {
              let error: boolean = !(
                r &&
                (r.status_code === 'Success-001' ||
                  r.content.data.status === '200')
              );

              if (error) return [];
              let typeFavoris: any = r && r.content ? r.content.data.type_favoris : [] ;

              return typeFavoris && typeFavoris.length
                ? typeFavoris[0].liste_favoris
                : [];
            })
          );
      })
    );
  }

  saveRapidoFavorite(data: {
    msisdn: string;
    card_num: string;
    card_label: string;
  }) {
    return this.http.post(OM_SAVE_RAPIDO_FAVORITES_ENDPOINT, data);
  }

  getFavoritePass() {
    const userPhoneNumber = this.dashbService.getCurrentPhoneNumber();
    return  this.http.get(`${FAVORITE_PASS_ENDPOINT}/${userPhoneNumber}`).pipe(
      map((res: FavoritePassOemModel) => {
        const result = {passInternets: [], passIllimixes: [] };
        if(res.passInternets.length) {
          result.passInternets = this.returnValidPassItems(res.passInternets)
        }
        if(res.passIllimixes.length) {
          result.passIllimixes = this.returnValidPassItems(res.passIllimixes)
        }
        return result;
      })
    )
  }

  returnValidPassItems(list: any[]) {
    let result: any[] = [];
    if(list.length) {
      result = list.filter((val: any) => {
        return val.actif
      })
    }
    return result
  }
}
