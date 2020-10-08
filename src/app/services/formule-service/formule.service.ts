import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  FormuleMobileModel,
  LOCAL_ZONE,
  TarifZoningByCountryModel,
} from 'src/shared';
import { map } from 'rxjs/operators';
const { CONSO_SERVICE, SERVICES_SERVICE, SERVER_API_URL } = environment;
const formuleEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/formule-mobiles-by-profil`;
const changerFormuleJamonoEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/v1/change-formule`;
const zoningTarifsEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/countries`;
@Injectable({
  providedIn: 'root',
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

  getAllCountriesWithTarifs() {
    return this.http.get(`${zoningTarifsEndpoint}?size=400`).pipe(
      map((res: TarifZoningByCountryModel[]) => {
        // logic to bring local zone country at first index
        let countriesArray = res;
        const local_zone_country = res.find(
          (country) => country.zone.name === LOCAL_ZONE
        );
        if (local_zone_country) {
          const index = res
            .map((pays) => pays.name)
            .indexOf(local_zone_country.name);
          countriesArray.splice(index, 1);
          countriesArray.unshift(local_zone_country);
        }
        return countriesArray;
      })
    );
  }
}
