import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FormuleMobileModel } from 'src/shared';
const { CONSO_SERVICE, SERVICES_SERVICE, SERVER_API_URL } = environment;
const formuleEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/formule-mobiles-by-profil`;
const changerFormuleJamonoEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/v1/change-formule`;
const zoningTarifsEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/countries`;
@Injectable({
  providedIn: 'root'
})
export class FormuleService {
  constructor(private http: HttpClient) {}

  getformules(profile: string) {
    return this.http.get(`${formuleEndpoint}/${profile}`);
  }

  changerFormuleJamono(msisdn: string, formule: FormuleMobileModel) {
    return this.http.put(
      `${changerFormuleJamonoEndpoint}/${msisdn}/${formule.code}`,
      null
    );
  }

  getAllCountriesWithTarifs(){
    return this.http.get(`${zoningTarifsEndpoint}?size=400`)
  }
}
