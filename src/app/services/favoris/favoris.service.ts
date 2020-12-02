import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import {
  OM_FAVORITES_ENDPOINT,
  OM_SAVE_RAPIDO_FAVORITES_ENDPOINT,
} from '../utils/om.endpoints';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';

@Injectable({
  providedIn: 'root',
})
export class FavorisService {
  constructor(
    private http: HttpClient,
    private omService: OrangeMoneyService
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
}
