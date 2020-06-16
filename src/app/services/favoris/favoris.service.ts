import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { OM_FAVORITES_ENDPOINT } from '../utils/om.endpoints';

@Injectable({
  providedIn: 'root',
})
export class FavorisService {
  constructor(private http: HttpClient) {}

  fetchFavorites(typeFavoris: string) {
    let result = {
      content: {
        data: {
          message: 'SUCCESS',
          status: '200',
          type_favoris: [
            {
              label: 'compteur',
              liste_favoris: [
                {
                  service_code: 'WOYOFAL',
                  ref_num: '14254564108',
                  ref_label: 'Woyofal Scatt',
                  creation_gen_id: '781210942235046',
                },
                {
                  service_code: 'WOYOFAL',
                  ref_num: '14254564108',
                  ref_label: 'Kebe Ab',
                  creation_gen_id: '781210942235046',
                },

                {
                  service_code: 'WOYOFAL',
                  ref_num: '14254564108',
                  ref_label: 'Karim Messi',
                  creation_gen_id: '781210942235046',
                },
              ],
            },
            {
              label: 'marchand',
              liste_favoris: [
                {
                  service_code: 'MARCHAND',
                  ref_num: '123456',
                  ref_label: 'Auchan Nord Foire',
                  creation_gen_id: '781210942235046',
                },
                {
                  service_code: 'MARCHAND',
                  ref_num: '234567',
                  ref_label: 'Auchan Ouest Foire',
                  creation_gen_id: '781210942235046',
                },

                {
                  service_code: 'MARCHAND',
                  ref_num: '345678',
                  ref_label: 'Auchan Sud Foire',
                  creation_gen_id: '781210942235046',
                },
              ],
            },
          ],
        },
      },
      act_app_vers: 'v1.0',
      act_conf_vers: 'v1.0',
      status_code: 'Success-001',
      status_wording: 'Transaction successfuls',
      conf_string: null,
      nb_notif: 0,
    };
    return this.http.get(`${OM_FAVORITES_ENDPOINT}/${typeFavoris}`).pipe(
      map((r: any) => {
        let error: boolean = !(
          r &&
          (r.status_code === 'Success-001' || r.content.data.status === '200')
        );

        if (error) return [];

        let typeFavoris: any = r.content.data.type_favoris;
        return typeFavoris.length > 0 ? typeFavoris[0].liste_favoris : [];
      }),
      catchError((_) => {
        return of(result.content.data.type_favoris[0].liste_favoris);
      })
    );
  }
}
