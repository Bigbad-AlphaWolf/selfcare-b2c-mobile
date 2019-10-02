import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';

@Component({
  selector: 'app-change-main-phone-number',
  templateUrl: './change-main-phone-number.page.html',
  styleUrls: ['./change-main-phone-number.page.scss']
})
export class ChangeMainPhoneNumberPage implements OnInit {
  numbers: any;
  activeNumber;

  constructor(
    private router: Router,
    private authServ: AuthenticationService,
    private dashboardServ: DashboardService
  ) {}

  ngOnInit() {
    this.getAllNumbers();
  }

  getAllNumbers() {
    const mainPhoneNumber = this.authServ.getUserMainPhoneNumber();
    let formule;
    let profil;
    let mainNumberInfos;
    this.numbers = [];
    this.authServ.getSubscription(mainPhoneNumber).subscribe(
      (res: any) => {
        formule = res.nomOffre;
        profil = res.profil;
        mainNumberInfos = {
          msisdn: mainPhoneNumber,
          profil,
          formule
        };
        this.numbers.push(mainNumberInfos);
      },
      err => {}
    );
    this.dashboardServ.getAttachedNumbers().subscribe(
      (numbers: any) => {
        this.numbers = this.numbers.concat(numbers);
      },
      (err: any) => {}
    );
  }

  attachLine() {
    this.router.navigate(['/new-number']);
  }
}
