import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Platform } from '@ionic/angular';
import { from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { OffreService } from 'src/app/models/offre-service.model';
import { DATA_OFFRES_SERVICES } from 'src/app/utils/data';
import { SubscriptionModel } from 'src/shared';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { DashboardService } from '../dashboard-service/dashboard.service';

import {
  OFFRE_SERVICES_ENDPOINT,
  ALL_SERVICES_ENDPOINT,
  OFFER_SERVICE_BY_CODE,
} from '../utils/services.endpoints';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  offresServices: any[];
  static AllOffers: OffreService[] = [];
  mockOfferService = [
    {
      activated: false,
      categorieOffreServices: [
        {
          categorieOffreServices: null,
          libelle: 'Mobile',
          niveau: '1',
          ordre: 1,
        },
        {
          categorieOffreServices: null,
          libelle: 'Mobile',
          niveau: '1',
          ordre: 1,
        },
      ],
      code: '1121',
      description: 'woyofal pour vous servir',
      fullDescription: 'woyofal pour vous servir',
      icone: 'woyofal_3x.png',
      ordre: 1,
      reasonDeactivation: null,
      shortDescription: "faire le plein d'electricité.",
      titre: 'Woyofal',
    },
    {
      activated: false,
      categorieOffreServices: [
        {
          categorieOffreServices: null,
          libelle: 'Mobile',
          niveau: '1',
          ordre: 1,
        },
        {
          categorieOffreServices: null,
          libelle: 'Mobile',
          niveau: '1',
          ordre: 1,
        },
      ],
      code: '1121',
      description: 'woyofal pour vous servir',
      fullDescription: 'woyofal pour vous servir',
      icone: 'woyofal_3x.png',
      ordre: 1,
      reasonDeactivation: null,
      shortDescription: "faire le plein d'electricité.",
      titre: 'Woyofal',
    },
    {
      activated: false,
      categorieOffreServices: [
        {
          categorieOffreServices: null,
          libelle: 'Mobile',
          niveau: '1',
          ordre: 1,
        },
        {
          categorieOffreServices: null,
          libelle: 'Mobile',
          niveau: '1',
          ordre: 1,
        },
      ],
      code: '1121',
      description: 'woyofal pour vous servir',
      fullDescription: 'woyofal pour vous servir',
      icone: 'woyofal_3x.png',
      ordre: 1,
      reasonDeactivation: null,
      shortDescription: "faire le plein d'electricité.",
      titre: 'Woyofal',
    },
  ];

  constructor(
    private http: HttpClient,
    private appVersion: AppVersion,
    private platform: Platform,
    private dashboardService: DashboardService,
    private authenticationService: AuthenticationService
  ) {}

  initServicesData(codeFormule?: string) {
    let endpointOffresServices = OFFRE_SERVICES_ENDPOINT;
    if (codeFormule) {
      endpointOffresServices += `/${codeFormule}?typeResearch=FORMULE`;
    }
    return this.http.get(endpointOffresServices).pipe(
      switchMap((categories) => {
        return this.getServicesByFormule().pipe(
          map((services) => {
            return { categories, services };
          })
        );
      })
      // map((r: any[]) => {
      //   this.offresServices = r;
      //   return r;
      // })
    );
  }

  sortByOrdre(arr: any[]) {
    return arr.sort((r1, r2) => r1.ordre - r2.ordre);
  }

  getAllServices() {
    return this.http.get(`${ALL_SERVICES_ENDPOINT}?page=0&size=100`);
  }

  getServicesByFormule(hub?: string) {
    // return this.http.get(`${OFFER_SERVICE_BY_CODE}/9131?hub=${hub}`);
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    return this.authenticationService.getSubscription(msisdn).pipe(
      switchMap((customerOffer: SubscriptionModel) => {
        const versionObservable = from(this.appVersion.getVersionNumber());
        let queryParams = `?${hub ? 'hub=' + hub : ''}`;
        return versionObservable.pipe(
          switchMap((appVersion) => {
            queryParams += `?${
              this.platform.is('ios') ? '&iosVersion=' : '&androidVersion='
            }${appVersion}`;
            return this.http.get<OffreService[]>(
              `${OFFER_SERVICE_BY_CODE}/${customerOffer.code}${queryParams}`
            );
          }),
          catchError(() => {
            return this.http.get<OffreService[]>(
              `${OFFER_SERVICE_BY_CODE}/${customerOffer.code}${queryParams}`
            );
          })
        );
      })
    );
  }
}
