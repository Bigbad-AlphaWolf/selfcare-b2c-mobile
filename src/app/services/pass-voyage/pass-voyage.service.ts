import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CONSO_PASS_COUNTRIES_ENDPOINT, CONSO_PASS_VOYAGE_PATH } from "../utils/pass-voyage.endpoints";
import { CountryPass } from "src/app/models/country-pass.model";
import { SessionOem } from "../session-oem/session-oem.service";
import { of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PassVoyageService {
  constructor(private http: HttpClient) {}

  fetchPassVoyage(country: CountryPass, type: string) {
    // return of([
    //   {
    //     pass: {
    //       actif: true,
    //       bonus: null,
    //       categoriePass: { id: 1, libelle: "Jour", ordre: 1 },
    //       code_long_credit: null,
    //       code_long_om: null,
    //       description: "300Mo en 3G;",
    //       dureeAppel: "60mn",
    //       dureeAppelEntrant: "30mn",
    //       nom: "Scool 500",
    //       nombreSms: "100",
    //       price_plan_index: 51000,
    //       price_plan_index_om: 51000,
    //       profils: [],
    //       promos: null,
    //       tarif: "500",
    //       type: "pass_illimix",
    //       typePassIllimix: { id: 1, libelle: "Simple" },
    //       id: 1,
    //       libelle: "Simple",
    //       validitePass: null,
    //       volumeInternet: null,
    //     },
    //     promoPass: null,
    //   },
    //   {
    //     pass: {
    //       actif: true,
    //       bonus: null,
    //       categoriePass: { id: 1, libelle: "Mois", ordre: 1 },
    //       code_long_credit: null,
    //       code_long_om: null,
    //       description: "300Mo en 3G;",
    //       dureeAppel: "50mn",
    //       dureeAppelEntrant: "10mn",
    //       nom: "Scool 500",
    //       nombreSms: "300",
    //       price_plan_index: 51000,
    //       price_plan_index_om: 51000,
    //       profils: [],
    //       promos: null,
    //       tarif: "200",
    //       type: "pass_illimix",
    //       typePassIllimix: { id: 1, libelle: "Simple" },
    //       id: 1,
    //       libelle: "Simple",
    //       validitePass: null,
    //       volumeInternet: null,
    //     },
    //     promoPass: null,
    //   },
    // ]);
    return this.http.get(
      `${CONSO_PASS_VOYAGE_PATH}?countryID=${country.id}&passVoyageType=${type}`
    );
  }
  fetchPassInternet(country: CountryPass, codeFormule: any) {
    return of([
      {
        pass: {
          actif: true,
          bonus: null,
          categoriePass: { id: 1, libelle: "Jour", ordre: 1 },
          code_long_credit: null,
          code_long_om: null,
          description: "300Mo en 3G;",
          dureeAppel: null,
          dureeAppelEntrant: null,
          nom: "Scool 500",
          nombreSms: null,
          price_plan_index: 51000,
          price_plan_index_om: 51000,
          profils: [],
          promos: null,
          tarif: "500",
          type: "pass_illimix",
          typePassIllimix: { id: 1, libelle: "Simple" },
          id: 1,
          libelle: "Simple",
          validitePass: null,
          volumeInternet: '500Mo',
        },
        promoPass: null,
      },
      {
        pass: {
          actif: true,
          bonus: null,
          categoriePass: { id: 1, libelle: "Mois", ordre: 1 },
          code_long_credit: null,
          code_long_om: null,
          description: "300Mo en 3G;",
          dureeAppel: null,
          dureeAppelEntrant: null,
          nom: "Scool 500",
          nombreSms: null,
          price_plan_index: 51000,
          price_plan_index_om: 51000,
          profils: [],
          promos: null,
          tarif: "200",
          type: "pass_illimix",
          typePassIllimix: { id: 1, libelle: "Simple" },
          id: 1,
          libelle: "Simple",
          validitePass: null,
          volumeInternet: '300Mo',
        },
        promoPass: null,
      },
    ]);
    return this.http.get(
      `${CONSO_PASS_COUNTRIES_ENDPOINT}/${SessionOem.CODE_FORMULE}`
    );
  }

  fetchCountries() {
    return this.http.get(`${CONSO_PASS_COUNTRIES_ENDPOINT}`);
  }
}
