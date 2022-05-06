import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OtpService } from 'src/app/services/otp-service/otp.service';

@Component({
  selector: 'app-rattach-by-otp-code',
  templateUrl: './rattach-by-otp-code.component.html',
  styleUrls: ['./rattach-by-otp-code.component.scss'],
})
export class RattachByOtpCodeComponent implements OnInit {
	@Input() number: string;
  otpCode: string;
  isLoading: boolean;
  hasError: boolean;
  mainUser = this.dashbServ.getMainPhoneNumber();
  errorMsg: string;
  constructor(private modCtl: ModalController, private dashbServ: DashboardService, private otpService: OtpService) { }

  ngOnInit() {}

	processRattachment() {
		this.otpService.rattachNumberByOTPCode(this.number, this.otpCode).pipe(tap((_) => {
		})).subscribe()
	}

	goBack() {
    this.modCtl.dismiss({
      direction: "BACK"
    })
  }

}
