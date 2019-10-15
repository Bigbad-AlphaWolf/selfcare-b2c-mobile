import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  PassIllimModel,
  PromoPassIllimModel,
  PassIllimixModel,
  getOrderedListCategory,
  getListPassFilteredByLabelAndPaymentMod
} from 'src/shared';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { SubscriptionModel } from 'src/app/dashboard';

@Injectable({
  providedIn: 'root'
})
export class PassIllimixService {
  private phoneNumber: string;
  private listPassIllimix: (PassIllimModel | PromoPassIllimModel)[] = [];
  private listPassIllimixShown: (PassIllimModel | PromoPassIllimModel)[];
  private listCategoryPass: any;
  private paymentMod: string;
  private passLoadedSubject: Subject<any> = new Subject<any>();
  constructor(private dashbService: DashboardService, private authServ: AuthenticationService) {}

  setPaymentMod(paymentMod: string) {
    this.paymentMod = paymentMod;
  }
  setPhoneNumber(msisdn: string) {
    this.phoneNumber = msisdn;
  }

  setListPassIllimix() {
    this.listPassIllimix = [];
    this.authServ.getSubscription(this.phoneNumber).subscribe((res: SubscriptionModel) => {
      if (res && res.code && res.profil) {
        this.dashbService.getListPassIllimix(res.code).subscribe(
          (res: PassIllimixModel[]) => {
            res.forEach(x => {
              if (x.pass) {
                this.listPassIllimix.push(x.pass);
              } else if (x.promoPass) {
                this.listPassIllimix.push(x.promoPass);
              }
            });
            // get from all pass the different categories
            const list = res.map(x => {
              if (x.pass) {
                return x.pass.categoriePass;
              } else if (x.promoPass) {
                return x.promoPass.passPromo.categoriePass;
              }
            });
            this.listCategoryPass = getOrderedListCategory(list);
            this.listPassIllimixShown = getListPassFilteredByLabelAndPaymentMod(
              this.listCategoryPass[0],
              this.listPassIllimix,
              this.paymentMod
            );
            this.passLoadedSubject.next(true);
          },
          (err: any) => {
            this.passLoadedSubject.next(true);
          }
        );
      }
    });
  }

  getCategoryListPassIllimix() {
    return this.listCategoryPass;
  }
  getListPassIllimix() {
    return this.listPassIllimix;
  }

  getListPassIllimixShown() {
    return this.listPassIllimixShown;
  }
  getStatusLoadingPass() {
    return this.passLoadedSubject.asObservable();
  }
}
