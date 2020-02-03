import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import * as SecureLS from 'secure-ls';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { formatCurrency } from 'src/shared';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-om-button',
  templateUrl: './om-button.component.html',
  styleUrls: ['./om-button.component.scss']
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
    private router: Router,
    private dashbordServ: DashboardService,
    private omServ: OrangeMoneyService
  ) {}

  ngOnInit() {
    this.balanceAvailableSub = this.dashbordServ.balanceAvailableSubject.subscribe(
      (solde: any) => {
        this.showSolde(solde);
      }
    );
    this.balanceStateSubscription = this.omServ
      .balanceVisibilityEMitted()
      .subscribe(showSolde => {
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
    if (this.balanceIsAvailable) {
      // FollowAnalytics.logEvent('Click_cacher_solde_OM_dashboard', 'clicked');
      this.hideSolde();
    } else {
      this.router.navigate(['see-solde-om']);
      // FollowAnalytics.logEvent('Click_Voir_solde_OM_dashboard', 'clicked');
    }
  }

  showSolde(solde) {
    this.omServ.showBalance(true);
    const balance = solde;
    this.balance = balance ? formatCurrency(balance) : balance;
    const phoneNumber = ls.get('nOrMo');
    const omuser = this.omServ.GetOrangeMoneyUser(phoneNumber);
    if (omuser) {
      this.lastUpdateOM = omuser.lastUpdate;
      this.lastTimeUpdateOM = omuser.lastUpdateTime;
    }
  }
  hideSolde() {
    this.omServ.showBalance(false);
  }
  ngOnDestroy() {
    if (this.balanceStateSubscription) {
      this.balanceStateSubscription.unsubscribe();
    }
  }
}
