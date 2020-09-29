import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DalalTonesGenreModel } from 'src/app/models/dalal-tones-genre.model';
import { DalalTonesModel } from 'src/app/models/dalal-tones.model';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../dashboard-service/dashboard.service';
const { SERVER_API_URL, SERVICES_SERVICE } = environment;
const dalalBaseURL = `${SERVER_API_URL}/${SERVICES_SERVICE}/api`;
const dalalSousGenreEndpoint = `${dalalBaseURL}/sous-genres`;
const dalalTonesEndpoint = `${dalalBaseURL}/dalal-tones`;
const dalalTonesGenresEndpoint = `${dalalBaseURL}/genres`;

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

  activateDalal(dalalTone: DalalTonesModel) {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    const payload = { id: dalalTone.cid, state: 'ACTIVE' };
    return this.http.post(
      `${dalalTonesEndpoint}/activation/${msisdn}`,
      payload
    );
  }
}
