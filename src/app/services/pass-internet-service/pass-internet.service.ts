import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { AuthenticationService } from '../authentication-service/authentication.service';
import {
  PassInfoModel,
  PromoPassModel,
  PassInternetModel,
  getOrderedListCategory,
  getListPassFilteredByLabelAndPaymentMod
} from 'src/shared';
import { SubscriptionModel } from 'src/app/dashboard';

@Injectable({
  providedIn: 'root'
})
export class PassInternetService {
  private userPhoneNumber: string;
  private paymentMod: string;
  private listPassInternet: (PassInfoModel | PromoPassModel)[] = [];
  private listCategoryPassInternet: any;
  private listPassInternetShown: any;
  passLoaded: boolean;
  passLoadedSubject: Subject<any> = new Subject<any>();
  hasError: boolean;
  hasErrorSubject: Subject<any> = new Subject<any>();
  constructor(private dashbService: DashboardService, private authService: AuthenticationService) {}

  setPaymentMod(paymentMod: string) {
    this.paymentMod = paymentMod;
  }
  setUserPhoneNumber(msisdn: string) {
    this.userPhoneNumber = msisdn;
  }

  getUserPhoneNumber() {
    return this.userPhoneNumber;
  }

  setListPassInternetOfUserByQuery() {
    this.setListPassInternetOfUser([]);
    this.authService.getSubscription(this.userPhoneNumber).subscribe((res: SubscriptionModel) => {
      if (res && res.code && res.profil) {
        this.dashbService.getListPassInternet(res.code).subscribe(
          (resp: any) => {
            resp.forEach((x: PassInternetModel) => {
              if (x.pass) {
                this.listPassInternet.push(x.pass);
              } else if (x.promoPass) {
                this.listPassInternet.push(x.promoPass);
              }
            });
            // this.listUserPassInternet.sort((a, b) => (+a.tarif > +b.tarif ? 1 : +b.tarif > +a.tarif ? -1 : 0));
            // get from all pass the diffent categories
            const list = resp.map(x => {
              if (x.pass) {
                return x.pass.categoriePass;
              } else if (x.promoPass) {
                return x.promoPass.passPromo.categoriePass;
              }
            });
            this.listCategoryPassInternet = getOrderedListCategory(list);
            this.listPassInternetShown = getListPassFilteredByLabelAndPaymentMod(
              this.listCategoryPassInternet[0],
              this.listPassInternet,
              this.paymentMod
            );
            this.passLoadedSubject.next(true);
          },
          () => {
            this.passLoadedSubject.next(true);
          }
        );
      }
    });
  }

  getListPassInternetShown() {
    return this.listPassInternetShown;
  }
  getListPassInternetOfUser() {
    return this.listPassInternet;
  }

  getListCategoryPassInternet() {
    return this.listCategoryPassInternet;
  }

  setListPassInternetOfUser(listPassInternet: any) {
    this.listPassInternet = listPassInternet;
  }

  setListCategoryPassInternet(listCategoryPass: any) {
    this.listCategoryPassInternet = listCategoryPass;
  }

  getStatusPassLoaded() {
    return this.passLoadedSubject.asObservable();
  }
}
