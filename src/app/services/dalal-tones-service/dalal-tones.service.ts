import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActiveDalalToneModel } from 'src/app/models/active-dalal-tone.model';
import { ActiveDalalTonesResponseModel } from 'src/app/models/active-dalal-tones-response.model';
import { DalalTonesGenreModel } from 'src/app/models/dalal-tones-genre.model';
import { DalalTonesModel } from 'src/app/models/dalal-tones.model';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../dashboard-service/dashboard.service';
const { SERVER_API_URL, SERVICES_SERVICE } = environment;
const dalalBaseURL = `${SERVER_API_URL}/${SERVICES_SERVICE}/api`;
const dalalTonesEndpoint = `${dalalBaseURL}/dalal-tones`;
const dalalTonesGenresEndpoint = `${dalalBaseURL}/genres`;
const activeDalalEndpoint = `${dalalTonesEndpoint}/actived`;

@Injectable({
  providedIn: 'root',
})
export class DalalTonesService {
  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService
  ) {}

  fetchDalalGenres(): Observable<DalalTonesGenreModel[]> {
    return this.http.get(dalalTonesGenresEndpoint).pipe(
      map((res: DalalTonesGenreModel[]) => {
        res = res.filter((genre) => {
          return genre.sousGenres && genre.sousGenres.length;
        });
        return res;
      })
    );
  }

  fetchDalalSousGenres() {
    return this.http.get(dalalTonesEndpoint);
  }

  fetchDalalTones(params?) {
    let queryParams = '';
    if (params && typeof params === 'object') {
      for (const param in params) {
        queryParams += `&${param}=${params[param]}`;
      }
    }
    const url =
      queryParams === ''
        ? dalalTonesEndpoint
        : `${dalalTonesEndpoint}?${queryParams}`;
    return this.http.get(url, { observe: 'response' });
  }

  activateDalal(dalalTone: DalalTonesModel, disable?: boolean) {
    const state = disable ? 'INACTIVE' : 'ACTIVE';
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    const payload = { id: dalalTone.cid, state };
    return this.http.post(
      `${dalalTonesEndpoint}/activation/${msisdn}`,
      payload
    );
  }

  disableDalal(activeDalal: ActiveDalalToneModel) {
    const dalal = { cid: activeDalal.serviceId };
    return this.activateDalal(dalal, true);
  }

  getActiveDalal() {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    // const mockDalal = {
    //   cid: 'string',
    //   titre: 'string',
    //   codeDalal: 'string',
    //   actif: true,
    //   statut: 'string',
    //   fournisseur: 'fournisseur',
    //   artiste: { nom: 'string', image: 'string' },
    //   sousGenres: [],
    // };
    // return of(mockDalal);
    return this.http.get(`${activeDalalEndpoint}/${msisdn}`).pipe(
      map((response: any) => {
        response.serviceCharacteristic = response.serviceCharacteristic.map(
          (element) => {
            return {
              cid: element.serviceId,
              titre: element.title,
              date: element.renewdate,
            };
          }
        );
        return response;
      })
    );
  }
}
