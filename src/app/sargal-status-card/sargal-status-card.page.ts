import { Component, OnInit } from '@angular/core';
import { SargalService } from '../services/sargal-service/sargal.service';
import { SargalStatusModel } from 'src/shared';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import * as SecureLS from 'secure-ls';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { SubscriptionModel, PROFILE_TYPE_POSTPAID } from '../dashboard';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-sargal-status-card',
  templateUrl: './sargal-status-card.page.html',
  styleUrls: ['./sargal-status-card.page.scss']
})
export class SargalStatusCardPage implements OnInit {
  sargalStatus: string;
  loadingStatus: boolean;
  hasError: boolean;
  title = 'Ma carte ';
  expiredStatus: boolean;
  currentNumber: string;
  name: string;
  currentYear = new Date().getFullYear();
  isPostpaid;
  constructor(
    private sargalService: SargalService,
    private router: Router,
    private dashboardService: DashboardService,
    private authServ :AuthenticationService
  ) {}

  ngOnInit() {
    this.getCustomerSargalStatus();
    this.currentNumber = this.dashboardService.getCurrentPhoneNumber();
    const user = ls.get('user');
    this.name = user.firstName + ' ' + user.lastName;
    this.authServ.getSubscription(this.currentNumber).subscribe((res:SubscriptionModel)=>{
      this.isPostpaid = res.profil === PROFILE_TYPE_POSTPAID;
    })
  }

  getCustomerSargalStatus() {
    this.loadingStatus = true;
    this.hasError = false;
    this.expiredStatus = false;
    this.sargalService.getCustomerSargalStatus().subscribe(
      (sargalStatus: SargalStatusModel) => {
        if (sargalStatus.valid) {
          this.sargalStatus = sargalStatus.profilClient;
          this.title += this.sargalStatus === 'PLATINUM' ? 'PLATINIUM' : this.sargalStatus ;
        } else {
          this.expiredStatus = true;
        }
        this.loadingStatus = false;
      },
      (err: any) => {
        this.loadingStatus = false;
        if (err.status && err.status === 400) {
          this.router.navigate(['/dashboard']);
        } else {
          this.hasError = true;
        }
      }
    );
  }

  goBack() {
    if(this.isPostpaid){
      this.router.navigate(['/dashboard']);
    }else{
      this.router.navigate(['/sargal-dashboard']);
    }
  }
}
