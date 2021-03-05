import { Component, OnInit } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { BannierePubModel } from 'src/app/services/dashboard-service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { BillsService } from 'src/app/services/bill-service/bills.service';
import { BanniereService } from 'src/app/services/banniere-service/banniere.service';
import {
  formatDataVolume,
  MAIL_URL,
  months,
  arrangeCompteurByOrdre,
  USER_CONS_CATEGORY_CALL,
  SubscriptionModel,
  WelcomeStatusModel
} from 'src/shared';
import { MatDialog } from '@angular/material';
import { AssistanceService } from '../services/assistance.service';
import { WelcomePopupComponent } from 'src/shared/welcome-popup/welcome-popup.component';

const ls = new SecureLS({ encodingType: 'aes' });
@Component({
  selector: 'app-dashboard-postpaid-fixe',
  templateUrl: './dashboard-postpaid-fixe.page.html',
  styleUrls: ['./dashboard-postpaid-fixe.page.scss']
})
export class DashboardPostpaidFixePage implements OnInit {
  opened = false;
  userInfos: any = {};
  firstName;
  months = months;
  showPromoBarner = true;
  userConsoSummary: any = {};
  userCallConsoSummary: {
    globalCredit: number;
    balance: number;
    isHybrid: boolean;
  } = null;
  bills;
  userConsommations: any;
  userConsommationsCategories = [];
  balance = 0;
  consumedAmount;
  balanceIsAvailable = false;
  isHyBride = false;
  errorConso;
  errorBill;
  dataLoaded = false;
  isConnected = false;
  showHelbBtn = false;
  creditRechargement: number;
  canDoSOS = false;
  lastUpdateOM;
  lastTimeUpdateOM;
  lastUpdateConso;
  creditMensuelle: number;
  pictures = [
    { image: '/assets/images/banniere-promo-mob.png' },
    { image: '/assets/images/banniere-promo-fibre.png' }
  ];
  sosEligible = true;
  listBanniere: BannierePubModel[] = [];
  isBanniereLoaded: boolean;
  slideOpts = {
    speed: 400,
    slidesPerView: 1.5,
    slideShadows: true
  };
  lastSlip;
  bordereau;
  currentNumber: string;
  clientId: string;
  constructor(
    private dashbordServ: DashboardService,
    private router: Router,
    private authServ: AuthenticationService,
    private billsService: BillsService,
    private banniereServ: BanniereService,
    private shareDialog: MatDialog,
    private assistanceService: AssistanceService
  ) {}

  ngOnInit() {
    this.getUserInfos();
    this.getWelcomeStatus();
    this.banniereServ
      .getListBanniereByFormuleByZone()
      .subscribe((res: any) => {
          this.listBanniere = res;
      });
  }

  getUserInfos() {
    const user = ls.get('user');
    this.firstName = user.firstName;
  }

  ionViewWillEnter() {
    this.getConso();
    this.bordereau = true;
    this.currentNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.getSubscription();
    this.getBills();
  }

  getSubscription() {
    this.authServ.getSubscription(this.currentNumber).subscribe(
      (res: SubscriptionModel) => {
        this.clientId = res.clientCode;
        this.errorBill = false;
        this.subscribeBillServices(this.clientId);
      },
      () => {
        this.errorBill = true;
      }
    );
  }

  subscribeBillServices(clientId: string) {
    this.errorBill = false;
    this.billsService.getBillsPackage(clientId).subscribe(
      res => {
        // this.loading = false;
        this.errorBill = false;
        this.bills = res;
        this.lastSlip =
          this.bills && this.bills.length > 0 ? this.bills[0] : null;
      },
      () => {
        this.errorBill = true;
      }
    );
  }

  getConso() {
    this.errorConso = false;
    this.dataLoaded = false;
    this.dashbordServ.getUserConsoInfosByCode().subscribe(
      (res: any) => {
        this.dataLoaded = true;
        if (res.length) {
          res = arrangeCompteurByOrdre(res);
          const appelConso = res.length
            ? res.find(x => x.categorie === USER_CONS_CATEGORY_CALL)
                .consommations
            : null;
          this.creditMensuelle =
            appelConso && appelConso.length > 0
              ? appelConso.find((x: any) => {
                  return x.code === 8;
                }).montant
              : 0;
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

  computeUserConso(userconsommations: any) {
    if (userconsommations) {
      const totalVoix = userconsommations.iinitalAmount;
      let totalData = userconsommations.ivolumeInitialGprs;
      this.consumedAmount = userconsommations.iusedAmount;
      const conso = [];
      const consoVoix = userconsommations.iremainingAmount;
      const consoInt = totalData - userconsommations.iusedvolume;
      const percentConsoVoix = Math.round((consoVoix * 100) / totalVoix);
      const percentConsoInt = Math.round((consoInt * 100) / totalData);
      let formatConsoInt = formatDataVolume(consoInt);
      totalData = formatDataVolume(totalData).substring(0, 5);
      let consoDataTitle = 'Restant Conso Internet';
      if (consoInt < 0) {
        formatConsoInt = formatDataVolume(userconsommations.iusedvolume);
        consoDataTitle = 'Conso Internet';
      }
      conso.push({
        compteur: 'Solde Restant Voix',
        amount: consoVoix,
        percent: percentConsoVoix,
        total: totalVoix,
        unit: 'F'
      });
      conso.push({
        compteur: consoDataTitle,
        amount: formatConsoInt,
        percent: percentConsoInt,
        total: totalData,
        dataFinished: consoInt < 0
      });
      return conso;
    }
  }

  logOut() {
    this.authServ.logout();
    this.router.navigate(['/']);
  }

  hidePromoBarner() {
    this.showPromoBarner = false;
  }

  getBills() {
    this.billsService.getBillsPackage(this.clientId).subscribe((res: any) => {
      res === 'error' ? (this.errorBill = true) : (this.bills = res);
      this.lastSlip = this.bills.length > 0 ? this.bills[0] : null;
    });
  }

  downloadBill(bill: any) {
    this.billsService.downloadBill(bill);
  }

  mailToCustomerService() {
    window.open(MAIL_URL);
  }

  getLastConsoUpdate() {
    const date = new Date();
    const lastDate = `${('0' + date.getDate()).slice(-2)}/${(
      '0' +
      (date.getMonth() + 1)
    ).slice(-2)}/${date.getFullYear()}`;
    const lastDateTime =
      `${date.getHours()}h` +
      (date.getMinutes() < 10 ? '0' : '') +
      date.getMinutes();
    this.lastUpdateConso = `${lastDate} à ${lastDateTime}`;
  }

  goDetailsCom(phoneNumber?: number) {
    phoneNumber = phoneNumber;
    this.router.navigate(['/details-conso']);
  }

  goToTransfertOM() {
    this.router.navigate(['/transfer/orange-money']);
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
}
