import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { OM_FAVORITES_ENDPOINT } from '../utils/om.endpoints';
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
    const omPhonenumber = this.omService.getOrangeMoneyNumber();
    return this.http
      .get(`${OM_FAVORITES_ENDPOINT}?msisdn=${omPhonenumber}`)
      .pipe(
        map((r: any) => {
          let error: boolean = !(
            r &&
            (r.status_code === 'Success-001' || r.content.data.status === '200')
          );
          if (error) return [];

          let typeFavoris: any = r.content.data.type_favoris;
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
  }
}
