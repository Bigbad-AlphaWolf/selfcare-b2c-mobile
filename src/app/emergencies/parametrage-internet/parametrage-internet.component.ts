import {Component, OnInit} from '@angular/core';
import {DashboardService} from 'src/app/services/dashboard-service/dashboard.service';
import {EmergencyService} from 'src/app/services/emergency-service/emergency.service';
import {AuthenticationService} from 'src/app/services/authentication-service/authentication.service';
import {MatDialog} from '@angular/material/dialog';
import {ModalSuccessComponent} from 'src/shared/modal-success/modal-success.component';

@Component({
  selector: 'app-parametrage-internet',
  templateUrl: './parametrage-internet.component.html',
  styleUrls: ['./parametrage-internet.component.scss']
})
export class ParametrageInternetComponent implements OnInit {
  numbers;

  constructor(
    private dashboardService: DashboardService,
    private emergencyService: EmergencyService,
    private authService: AuthenticationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  getAllNumbers() {
    const mainNumber = this.authService.getUserMainPhoneNumber();
    this.numbers = [];
    this.numbers.push(mainNumber);
    this.dashboardService.getAttachedNumbers().subscribe((res: any[]) => {
      res.forEach(number => {
        this.numbers.push(number.msisdn);
      });
    });
  }

  openSuccessDialog(type: string) {
    this.dialog.open(ModalSuccessComponent, {
      data: {type}
    });
  }

  sendSMS() {
    this.openSuccessDialog('parametrage-internet');
  }
}
