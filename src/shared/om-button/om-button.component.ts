import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import * as SecureLS from 'secure-ls';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { formatCurrency, HUB_OM_TAB } from 'src/shared';
const ls = new SecureLS({ encodingType: 'aes' });
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { ModalController } from '@ionic/angular';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { GetBalanceTypeEnum, GetBalanceWalletEnum, GetBalanceWPPayloadModel } from 'src/app/services/orange-money-service';

@Component({
  selector: 'app-om-button',
  templateUrl: './om-button.component.html',
  styleUrls: ['./om-button.component.scss'],
})
export class OmButtonComponent implements OnInit, OnDestroy {
  balanceAvailableSub: Subscription;
  balanceIsAvailable: boolean;
  balance: number;
  lastUpdateOM: string;
  lastTimeUpdateOM: string;
  balanceStateSubscription: Subscription;
  @Input() isKirene: boolean;
  @Input() isFullWidthButton: boolean;
  loadingBalance: boolean;
  constructor(private omServ: OrangeMoneyService, private oemLogging: OemLoggingService, private modalController: ModalController, private dashboardService: DashboardService) {}

  ngOnInit() {
    this.initOMBalance();
    this.balanceAvailableSub = this.dashboardService.balanceAvailableSubject.subscribe((solde: any) => {
      this.showSolde(solde);
    });
    this.balanceStateSubscription = this.omServ.balanceVisibilityEMitted().subscribe(showSolde => {
      this.balanceIsAvailable = showSolde;
    });
  }

  initOMBalance() {
    const phoneNumber = ls.get('nOrMo');
    if (phoneNumber) {
      const omuser = this.omServ.GetOrangeMoneyUser(phoneNumber);
      this.balanceIsAvailable = omuser.showSolde;
      this.balance = omuser.solde;
      this.lastUpdateOM = omuser.lastUpdate;
      this.lastTimeUpdateOM = omuser.lastUpdateTime;
    }
  }

  showSoldeOM() {
    if (this.loadingBalance) {
      return;
    }
    const phoneNumber = ls.get('nOrMo');
    if (this.balanceIsAvailable) {
      this.oemLogging.registerEvent('dashboard_solde_om_hide_click', [{ dataName: 'msisdn', dataValue: phoneNumber }]);
      this.hideSolde();
    } else {
      this.getSoldeOM();
      this.oemLogging.registerEvent('Click_Voir_solde_OM_dashboard', [{ dataName: 'msisdn', dataValue: phoneNumber }]);
    }
  }

  getSoldeOM() {
    this.loadingBalance = true;
    this.omServ
      .getOmMsisdn()
      .pipe(
        switchMap(msisdn => {
          if (msisdn === 'error') {
            this.openPinpad();
            this.loadingBalance = false;
            return;
          }
          const payload: GetBalanceWPPayloadModel = {
            msisdn,
            type: GetBalanceTypeEnum.CUSTOMER,
            walletType: GetBalanceWalletEnum.PRINCIPAL,
          };
          return this.omServ.getOMBalanceWithoutPin(payload);
        }),
        tap((res: any) => {
          this.loadingBalance = false;
          const phoneNumber = ls.get('nOrMo');
          const omuser = this.omServ.GetOrangeMoneyUser(phoneNumber);
          const date = new Date();
          const lastDate = `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
          const lastDateTime = `${date.getHours()}h` + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
          omuser.msisdn = phoneNumber;
          omuser.solde = res?.balance;
          omuser.lastUpdate = lastDate;
          omuser.lastUpdateTime = lastDateTime;
          this.omServ.SaveOrangeMoneyUser(omuser);
          this.dashboardService.balanceAvailableSubject.next(res?.balance);
          this.showSolde(res?.balance);
        }),
        catchError(err => {
          this.loadingBalance = false;
          return throwError(err);
        })
      )
      .subscribe();
  }

  showSolde(solde) {
    this.omServ.showBalance(true);
    this.balance = solde ? formatCurrency(solde) : solde;
    const phoneNumber = ls.get('nOrMo');
    this.oemLogging.registerEvent('dashboard_solde_om_success', [{ dataName: 'msisdn', dataValue: phoneNumber }]);
    const omuser = this.omServ.GetOrangeMoneyUser(phoneNumber);
    if (omuser) {
      this.lastUpdateOM = omuser.lastUpdate;
      this.lastTimeUpdateOM = omuser.lastUpdateTime;
    }
  }

  hideSolde() {
    this.omServ.showBalance(false);
  }

  goHubOM(e: MouseEvent) {
    if (!this.isKirene) {
      e.stopPropagation();
      this.dashboardService.menuOptionClickEmit(HUB_OM_TAB);
    }
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
    });
    modal.onDidDismiss().then(response => {
      if (response.data && response.data.success) {
        this.showSolde(response.data.balance);
      }
    });
    return await modal.present();
  }

  ngOnDestroy() {
    if (this.balanceStateSubscription) {
      this.balanceStateSubscription.unsubscribe();
    }
  }
}
