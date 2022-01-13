import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import * as SecureLS from 'secure-ls';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { formatCurrency } from 'src/shared';
const ls = new SecureLS({ encodingType: 'aes' });
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { ModalController } from '@ionic/angular';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';

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

  constructor(
    private dashbordServ: DashboardService,
    private omServ: OrangeMoneyService,
    private modalController: ModalController,
    private oemLogging: OemLoggingService
  ) {}

  ngOnInit() {
    this.balanceAvailableSub =
      this.dashbordServ.balanceAvailableSubject.subscribe((solde: any) => {
        this.showSolde(solde);
      });
    this.balanceStateSubscription = this.omServ
      .balanceVisibilityEMitted()
      .subscribe((showSolde) => {
        this.balanceIsAvailable = showSolde;
      });

    // get omuser and if logintoken show user connected
    const phoneNumber = ls.get('nOrMo');
    const omuser = this.omServ.GetOrangeMoneyUser(phoneNumber);
    // check token contains info
    const balanceVisible = omuser.showSolde;
    let jwt: any;

    if (omuser && omuser.loginToken && omuser.loginToken !== 'string') {
      jwt = jwt_decode(omuser.loginToken);
    }
    const currentTime = new Date().getTime() / 1000;
    if (
      omuser &&
      omuser.loginToken &&
      omuser.loginToken !== 'string' &&
      !(currentTime > jwt.exp)
    ) {
      if (balanceVisible) {
        this.showSolde(omuser.solde);
      }
    }
  }

  showSoldeOM() {
    const phoneNumber = ls.get('nOrMo');
    if (this.balanceIsAvailable) {
      this.oemLogging.registerEvent('dashboard_solde_om_hide_click', [
        { dataName: 'msisdn', dataValue: phoneNumber },
      ]);
      this.hideSolde();
    } else {
      this.openPinpad();
      this.oemLogging.registerEvent('dashboard_solde_om_show_click', [
        { dataName: 'msisdn', dataValue: phoneNumber },
      ]);
    }
  }

  showSolde(solde) {
    this.omServ.showBalance(true);
    const balance = solde;
    this.balance = balance ? formatCurrency(balance) : balance;
    const phoneNumber = ls.get('nOrMo');
    this.oemLogging.registerEvent('dashboard_solde_om_success', [
      { dataName: 'msisdn', dataValue: phoneNumber },
    ]);
    const omuser = this.omServ.GetOrangeMoneyUser(phoneNumber);
    if (omuser) {
      this.lastUpdateOM = omuser.lastUpdate;
      this.lastTimeUpdateOM = omuser.lastUpdateTime;
    }
  }
  hideSolde() {
    this.omServ.showBalance(false);
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
    });
    modal.onDidDismiss().then((response) => {
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
