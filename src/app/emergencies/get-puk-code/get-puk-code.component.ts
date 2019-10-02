import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { EmergencyService } from 'src/app/services/emergency-service/emergency.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-get-puk-code',
  templateUrl: './get-puk-code.component.html',
  styleUrls: ['./get-puk-code.component.scss']
})
export class GetPukCodeComponent implements OnInit {
  codePUK = '20 20 12 20';
  copied = false;
  numbers;

  constructor(
    private dashboardService: DashboardService,
    private emergencyService: EmergencyService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.getAllNumbers();
  }

  onCopySuccess() {
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 2000);
  }

  getAllNumbers() {
    const mainNumber = this.authService.getUserMainPhoneNumber();
    this.numbers = [];
    this.numbers.push(mainNumber);
    this.getCodePuk(mainNumber);
    this.dashboardService.getAttachedNumbers().subscribe((res: any[]) => {
      res.forEach(phoneNumber => {
        this.numbers.push(phoneNumber.msisdn);
      });
    });
  }
  // A revoir les tests n'influencent pas le pourcentage de couvertures sur ce composants
  getCodePuk(phoneNumber: string) {
    this.codePUK = '';
    this.emergencyService.getCodePuk(phoneNumber).subscribe((code: any) => {
      this.codePUK = code.puk;
    });
  }
}
