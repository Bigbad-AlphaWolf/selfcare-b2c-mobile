import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONSO_PASS_COUNTRIES_ENDPOINT } from '../utils/pass-voyage.endpoints';
import { CountryPass } from 'src/app/models/country-pass.model';
import { SessionOem } from '../session-oem/session-oem.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassVoyageService {
  
  constructor(private http: HttpClient) { }
  
  fetchPassAppel(country: CountryPass, codeFormule: any) {
    return this.http.get(`${CONSO_PASS_COUNTRIES_ENDPOINT}/${SessionOem.CODE_FORMULE}`);

  }
  fetchPassInternet(country: CountryPass, codeFormule: any) {
    return this.http.get(`${CONSO_PASS_COUNTRIES_ENDPOINT}/${SessionOem.CODE_FORMULE}`);

  }
  fetchPassIllimix(country: CountryPass, codeFormule: any) {
    return this.http.get(`${CONSO_PASS_COUNTRIES_ENDPOINT}/${SessionOem.CODE_FORMULE}`);

  }
  fetchCountries() {
    return of([{name:'France', code:'fr'}, {name:'Togo', code:'tg'}])
    return this.http.get(`${CONSO_PASS_COUNTRIES_ENDPOINT}`);
  }
}
