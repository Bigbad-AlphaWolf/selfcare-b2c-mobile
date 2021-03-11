import { Component, OnInit } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { BannierePubModel } from 'src/app/services/dashboard-service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { BillsService } from 'src/app/services/bill-service/bills.service';
import { BanniereService } from 'src/app/services/banniere-service/banniere.service';
import {
  arrangeCompteurByOrdre,
  USER_CONS_CATEGORY_CALL,
  SubscriptionModel,
  WelcomeStatusModel
} from 'src/shared';
import { MatDialog } from '@angular/material';
import { AssistanceService } from '../services/assistance.service';
import { WelcomePopupComponent } from 'src/shared/welcome-popup/welcome-popup.component';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { previousMonths } from '../utils/utils';
import { Observable, of } from 'rxjs';
import { InvoiceOrange } from '../models/invoice-orange.model';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';

const ls = new SecureLS({ encodingType: 'aes' });
@Component({
  selector: 'app-dashboard-postpaid-fixe',
  templateUrl: './dashboard-postpaid-fixe.page.html',
  styleUrls: ['./dashboard-postpaid-fixe.page.scss']
})
export class DashboardPostpaidFixePage implements OnInit {
  firstName;
  showPromoBarner = true;
  errorConso: boolean;
  dataLoaded = false;
  creditMensuelle: number;
  listBanniere: BannierePubModel[] = [];
  isBanniereLoaded: boolean;
  currentNumber: string;
  dateExpiration: any;
  bordereau$: Observable<InvoiceOrange>;
  hasErrorBordereau: boolean;
  customerOfferInfos: SubscriptionModel;
  isNumberActivated: boolean;
  constructor(
    private dashbordServ: DashboardService,
    private router: Router,
    private authServ: AuthenticationService,
    private billsService: BillsService,
    private banniereServ: BanniereService,
    private shareDialog: MatDialog,
    private assistanceService: AssistanceService,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.getUserInfos();
    this.getWelcomeStatus();
    this.banniereServ
      .getListBanniereByFormuleByZone()
      .subscribe((res: any) => {
          this.listBanniere = res;
      });
    this.dashbordServ.getFixPostpaidInfos().pipe(tap((status: string) => {
      if(status === 'ACTIVATED') {
        this.isNumberActivated = true;
      }
    })).subscribe()
  }

  getUserInfos() {
    const user = ls.get('user');
    this.firstName = user.firstName;
  }

  ionViewWillEnter() {
    this.getConso();
    this.currentNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.getBordereau();
  }

  getBordereau() {
    this.authServ.getSubscription(this.currentNumber).pipe(switchMap((res: SubscriptionModel) => {
      this.customerOfferInfos = res;
      return this.initData(res.clientCode)
    })).subscribe();
  }


  getConso() {
    this.errorConso = false;
    this.dataLoaded = false;
    this.dashbordServ.getUserConsoInfosByCode().subscribe(
      (res: any[]) => {
        this.dataLoaded = true;
        if (res.length) {
          res = arrangeCompteurByOrdre(res);
          const appelConso = res.length
            ? res.find(x => x.categorie === USER_CONS_CATEGORY_CALL)
                .consommations
            : null;
          const CMO_INFOS = appelConso.find((x: any) => {
            return x.code === 8;
          })
          this.creditMensuelle = CMO_INFOS ? CMO_INFOS.montant : 0
          this.dateExpiration = CMO_INFOS ? CMO_INFOS.dateExpiration : null
          console.log('credit', this.creditMensuelle, 'date', this.dateExpiration);

        } else {
          this.errorConso = true;
        }
      },
      () => {
        this.dataLoaded = true;
        this.errorConso = true;
      }
    );
  }

  hidePromoBarner() {
    this.showPromoBarner = false;
  }






  goDetailsCom() {
    this.router.navigate(['/details-conso']);
  }


  onError(input: { el: HTMLElement; display: boolean }[]) {
    input.forEach((item: { el: HTMLElement; display: boolean }) => {
      item.el.style.display = item.display ? 'block' : 'none';
    });
  }

  showWelcomePopup(data: WelcomeStatusModel) {
    const dialog = this.shareDialog.open(WelcomePopupComponent, {
      data,
      panelClass: 'gift-popup-class'
    });
    dialog.afterClosed().subscribe(() => {
      this.assistanceService.tutoViewed().subscribe(() => {});
    });
  }

  getWelcomeStatus() {
    const number = this.dashbordServ.getMainPhoneNumber();
    this.dashbordServ.getAccountInfo(number).subscribe(
      (resp: any) => {
        ls.set('user', resp);
        if (!resp.tutoViewed) {
          this.dashbordServ.getWelcomeStatus().subscribe(
            (res: WelcomeStatusModel) => {
              if (res.status === 'SUCCESS') {
                this.showWelcomePopup(res);
              }
            },
            () => {}
          );
        }
      },
      () => {}
    );
  }

  async initData(codeClient: string) {
    const invoiceType = 'LANDLINE';
    const moisDispo = await this.billsService.moisDisponible(
        codeClient,
        invoiceType,
        this.currentNumber
      );
    this.hasErrorBordereau = false;
    if (moisDispo) {
      const months = previousMonths(moisDispo);
      const last_month = months[0];

      this.bordereau$ = this.billsService
        .bordereau(codeClient, invoiceType, this.currentNumber, last_month)
        .pipe(
          tap((res: any) => {
            console.log('res', res);

          }),
          catchError((err: any) => {
          this.hasErrorBordereau = true;
          return of(err)
        }));
    } else {
      this.hasErrorBordereau = true;
      console.log('hasErr', this.hasErrorBordereau);

    }
  }

  goFacture() {
    this.router.navigate(['/bills']);
    this.followAnalyticsService.registerEventFollow(
      'Dashboard_Fixe_Mobile',
      'event',
      'clicked'
    );
  }
}
