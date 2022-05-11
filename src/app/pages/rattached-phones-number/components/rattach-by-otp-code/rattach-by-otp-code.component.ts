import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { OtpService } from 'src/app/services/otp-service/otp.service';
import { RATTACHMENT_ERROR_MAX_COUNT } from 'src/shared';

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
	showSendOtpBtn: boolean;
	timeOutID: any;
	isSendingOtp: boolean;
	hasErrorSendingOtp: boolean;
	countError: number = 0;
  constructor(private modCtl: ModalController, private dashbServ: DashboardService, private otpService: OtpService, private followAnalyticsService: FollowAnalyticsService) { }

  ngOnInit() {
		this.startCountDown();
	}

	processRattachment() {
		this.hasError = false;
		this.otpService.rattachNumberByOTPCode(this.number, this.otpCode, this.mainUser).pipe(tap((_) => {
				clearTimeout(this.timeOutID);
				this.followAttachmentIssues({numero: this.number  }, 'event')
        this.dismissModal({ success: true, typeRattachment: 'MOBILE', numero: this.number })
		}),
		catchError((err) => {
				this.countError += 1;
				clearTimeout(this.timeOutID);
				this.followAttachmentIssues({numero: this.number }, 'error');
				this.hasError = true;
				this.errorMsg = err?.error?.title ? err?.error?.title : 'Une erreur est survenue';
				if(this.countError === RATTACHMENT_ERROR_MAX_COUNT) {
					this.dismissModal({ success: false, typeRattachment: 'MOBILE', numero: this.number, errorMsg: err.error.title, errorStatus: err.error.status })
				}
			return throwError(err);
		})).subscribe()
	}

	goBack() {
    this.modCtl.dismiss({
      direction: "BACK"
    })
  }

	sendOtpCode() {
		this.isSendingOtp = true;
		this.hasErrorSendingOtp = false;
		this.otpService.generateOTPCode(this.number).pipe(
			tap((_) => {
				this.isSendingOtp = false;
				this.showSendOtpBtn = false;
				this.startCountDown();
			}),
			catchError((err) => {
				this.isSendingOtp = false;
				this.hasErrorSendingOtp = true;
				return throwError(err);
			})
		).subscribe()
	}

	dismissModal(data: { success: boolean, typeRattachment: string, numero: string, errorMsg?: string, errorStatus?: any }) {
    this.modCtl.dismiss({
      rattached: data.success,
      typeRattachment: data.typeRattachment,
      numeroToRattach: data.numero,
      errorMsg: data.errorMsg,
      errorStatus: data.errorStatus
    })
  }

	followAttachmentIssues(
    payload: { numero: string },
    eventType: 'error' | 'event'
  ) {
    if (eventType === 'event') {
      const infosFollow = {
        attached_number: payload.numero,
        login: this.mainUser,
      };
      const eventName = `rattachment_mobile_pro_success`;
      this.followAnalyticsService.registerEventFollow(
        eventName,
        eventType,
        infosFollow
      );
    } else {
      const infosFollow = {
        number_to_attach: payload.numero,
        login: this.mainUser,
      };
      const errorName = `rattachment_mobile_pro_failed`;
      this.followAnalyticsService.registerEventFollow(
        errorName,
        eventType,
        infosFollow
      );
    }
  }

	startCountDown() {
    this.showSendOtpBtn = false;
    this.timeOutID = setTimeout(() => {
      this.showSendOtpBtn = true;
    }, 15 * 1000);

  }

}
