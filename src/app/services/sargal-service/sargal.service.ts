import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, of, Observable, throwError } from 'rxjs';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { environment } from 'src/environments/environment';
import {
  GiftSargalItem,
  GiftSargalCategoryItem,
  SubscriptionModel,
} from 'src/shared';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { catchError, delay, map, tap } from 'rxjs/operators';
import * as SecureLS from 'secure-ls';
import { OemLoggingService } from '../oem-logging/oem-logging.service';
const ls = new SecureLS({ encodingType: 'aes' });

const { SARGAL_SERVICE, SERVER_API_URL } = environment;

// Endpoint to get sargal balance
const sargalBalanceEndpoint = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/sargal/v1/subscription-status`;
const sargalCategorieGiftEndpoint = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/categorie-gifts`;
const listSargalGiftsByCategoryEndpoint = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/gift-sargal`;
const listAllSargalGiftsEndpoint = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/gift-sargals-by-formule`;
const convertGiftEndpoint = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/sargal/v1/loyaltypoints-gift`;
const registerSargalEndpoint = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/sargal/v1/suscribe`;
const customerSargalStatusEndpoint = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/client-sargals-profile`;

// Endpoint Light get Sargal Balance
const sargalBalanceEndpointLight = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/sargal/v1/light/subscription-status`;

const fellowsMsisdnEndpoint = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/fellows/v1`;

@Injectable({
  providedIn: 'root',
})
export class SargalService {
  private userPhoneNumber: string;

  private listGiftSargal: GiftSargalItem[] = [];

  private listCategoryGiftSargal: GiftSargalCategoryItem[] = [];

  private listGiftSargalShown: any;

  dataLoaded: boolean;

  dataLoadedSubject: Subject<any> = new Subject<any>();
  categoryDataSubject: Subject<any> = new Subject<any>();
  hasError: boolean;

  hasErrorSubject: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient,
    private dashbService: DashboardService,
    private authServ: AuthenticationService,
    private oemLoggingService: OemLoggingService
  ) {}

  getFellowsMsisdn() {
    const msisdn = this.dashbService.getCurrentPhoneNumber();
    return this.http.get(`${fellowsMsisdnEndpoint}/${msisdn}/list`);
  }

  getSargalBalance(msisdn: string, hmac?: string) {
    let queryParam = '';
    let endpoint = sargalBalanceEndpoint;
    if (hmac) {
      endpoint = sargalBalanceEndpointLight;
      queryParam += `?hmac=${hmac}`;
    }
    return this.http.get(`${endpoint}/${msisdn}${queryParam}`).pipe(
      map(
        (sargalStatus) => {
          ls.set(`lastSargalData_${msisdn}`, sargalStatus);
          return sargalStatus;
        },
        (err) => {
          const sargalData = ls.get(`lastSargalData_${msisdn}`);
          return sargalData;
        }
      )
    );
  }

  querySargalGiftCategories() {
    return this.http.get(`${sargalCategorieGiftEndpoint}`);
  }

  setUserPhoneNumber(msisdn: string) {
    this.userPhoneNumber = msisdn;
  }

  getAllSargalCategories(listSargalGift: GiftSargalItem[]) {
    let listCategory = [];

    if (listSargalGift) {
      listCategory = [
        ...new Set(
          listSargalGift.map((item: GiftSargalItem) => {
            return item.categorieGift.nom;
          })
        ),
      ];
    }

    return listCategory;
  }

  getAllGiftSargalUser(codeFormule: string) {
    return this.http.get(`${listAllSargalGiftsEndpoint}/${codeFormule}`);
  }

  getListCategoryGiftSargal() {
    return this.listCategoryGiftSargal;
  }

  getListGiftSargalOfUser() {
    return this.listGiftSargal;
  }

  getStatusDataLoaded() {
    return this.dataLoadedSubject.asObservable();
  }

  setListGiftSargalAndCategoryOfUserByQuery() {
    this.dataLoadedSubject.next({ status: false, error: false });
    this.listGiftSargal = [];
    this.listCategoryGiftSargal = [];
    this.authServ.getSubscription(this.userPhoneNumber).subscribe(
      (res: SubscriptionModel) => {
        if (res && res.code && res.profil) {
          this.getAllGiftSargalUser(res.code).subscribe(
            (resp: any[]) => {
              this.listGiftSargal = resp.filter((item: GiftSargalItem) => {
                if (item) {
                  return item;
                }
              });
              // Order by asc price giftSargal by default
              this.listGiftSargal.sort(
                (item1: GiftSargalItem, item2: GiftSargalItem) =>
                  +item1.prix - +item2.prix
              );
              this.querySargalGiftCategories().subscribe(
                (listCategory: GiftSargalCategoryItem[]) => {
                  this.listCategoryGiftSargal = listCategory;
                  this.dataLoadedSubject.next({ status: true, error: false });
                },
                (err: any) => {}
              );
            },
            () => {
              this.dataLoadedSubject.next({ status: true, error: true });
            }
          );
        }
      },
      (err: any) => {
        this.dataLoadedSubject.next({ status: true, error: true });
      }
    );
  }

  filterGiftItemByCategory(
    category: GiftSargalCategoryItem,
    listGiftSargal: GiftSargalItem[]
  ) {
    let res;
    if (category) {
      res = listGiftSargal.filter((item: GiftSargalItem) => {
        return item.categorieGift.id === category.id;
      });
    }
    return res ? res : listGiftSargal;
  }

  getGiftSargalItemsByCategory(
    codeCategory: any,
    codeFormule: string,
    ordre: string
  ) {
    return this.http.get(
      `${listSargalGiftsByCategoryEndpoint}/formule/${codeFormule}/categorie/${codeCategory}?ordre=${ordre}`
    );
  }

  convertToGift(gift: GiftSargalItem, numerosIllimite: string[]) {
    const msisdn = this.dashbService.getCurrentPhoneNumber();
    const numeros = numerosIllimite ? numerosIllimite.join() : null;
    return this.http
      .post(
        `${convertGiftEndpoint}/${msisdn}?giftId=${gift.giftId}&fellowType=${gift.fellowType}&fellowNumbers=${numeros}&serviceId=${gift.serviceId}`,
        null
      )
      .pipe(
        tap((res) => {
          this.oemLoggingService.registerEvent('sargal_convert_success', [
            { dataName: 'msisdn', dataValue: msisdn },
            { dataName: 'giftId', dataValue: gift.id },
            { dataName: 'giftName', dataValue: gift.nom },
            { dataName: 'giftPrice', dataValue: gift.prix },
          ]);
        }),
        catchError((err) => {
          this.oemLoggingService.registerEvent('sargal_convert_error', [
            { dataName: 'msisdn', dataValue: msisdn },
            { dataName: 'giftId', dataValue: gift.id },
            { dataName: 'giftName', dataValue: gift.nom },
            { dataName: 'giftPrice', dataValue: gift.prix },
          ]);
          return throwError(err);
        })
      );
  }

  registerToSargal(msisdn: string) {
    return this.http.post(`${registerSargalEndpoint}/${msisdn}`, null);
  }

  getCustomerSargalStatus() {
    const msisdn = this.dashbService.getCurrentPhoneNumber();
    // return of({ valid: true, profilClient: 'GOLD' }).pipe(delay(5000));
    return this.http.get(`${customerSargalStatusEndpoint}/${msisdn}`);
  }
}
