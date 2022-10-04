import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CONSO_PASS_COUNTRIES_ENDPOINT,
  CONSO_PASS_VOYAGE_PATH,
} from '../utils/pass-voyage.endpoints';
import { CountryPass } from 'src/app/models/country-pass.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PassVoyageService {
  constructor(private http: HttpClient) {}

  fetchPassVoyage(country: CountryPass, type?: string, codeFormule?: string) {
		let url = `${CONSO_PASS_VOYAGE_PATH}?countryID=${country?.id}&passVoyageType=${type}`;
		if(codeFormule) {
			url += `&codeFormule=${codeFormule}`;
		}
    return this.http.get(
      `${url}`
    );
  }

  fetchCountries() {
    return this.http.get(`${CONSO_PASS_COUNTRIES_ENDPOINT}`).pipe(
      map((countries: CountryPass[]) => {
        const resp = countries.sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
        return resp;
      })
    );
  }
}
