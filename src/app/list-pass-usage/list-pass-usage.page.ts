import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { OffreService } from '../models/offre-service.model';
import { PassInternetService } from '../services/pass-internet-service/pass-internet.service';

@Component({
  selector: 'app-list-pass-usage',
  templateUrl: './list-pass-usage.page.html',
  styleUrls: ['./list-pass-usage.page.scss'],
})
export class ListPassUsagePage implements OnInit {
  loadingPass: boolean;
  errorLoadingPass: boolean;
  listPass: any[];
  serviceUsage: OffreService;
  recipientMsisdn: string;
  state: any;

  constructor(
    private router: Router,
    private navController: NavController,
    private passService: PassInternetService
  ) {}

  ngOnInit() {
    this.getPageParams();
  }

  getPageParams() {
    if (this.router) {
      let state = this.router.getCurrentNavigation().extras.state;
      this.state = state ? state : history.state;
      console.log(this.state);
      this.serviceUsage = state.serviceUsage;
      this.recipientMsisdn = state.recipientMsisdn;
      this.loadPass();
    }
  }

  loadPass() {
    this.loadingPass = true;
    this.errorLoadingPass = false;
    this.passService
      .getPassUsage(this.serviceUsage.code, this.recipientMsisdn)
      .subscribe(
        (res) => {
          this.loadingPass = false;
          this.listPass = res;
        },
        (err) => {
          this.loadingPass = false;
          this.errorLoadingPass = true;
        }
      );
  }

  goBack() {
    this.navController.pop();
  }

  choosePass(pass) {
    this.state.pass = pass;
    console.log('state to send', this.state);

    let navigationExtras: NavigationExtras = {
      state: this.state,
    };
    this.router.navigate(['/operation-recap'], navigationExtras);
  }
}
