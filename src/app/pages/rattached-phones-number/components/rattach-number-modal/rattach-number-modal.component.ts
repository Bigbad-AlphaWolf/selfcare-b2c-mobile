import { Component, OnInit, Input } from '@angular/core';
import { REGEX_FIX_NUMBER, REGEX_NUMBER } from 'src/shared';
import { MatDialog } from '@angular/material/dialog';
import { ModalSuccessComponent } from 'src/shared/modal-success/modal-success.component';
import { ModalController } from '@ionic/angular';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { catchError, map, tap } from 'rxjs/operators';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { AccountService } from 'src/app/services/account-service/account.service';
import { OtpService } from 'src/app/services/otp-service/otp.service';
import { of, throwError } from 'rxjs';

@Component({
  selector: 'app-rattach-number-modal',
  templateUrl: './rattach-number-modal.component.html',
  styleUrls: ['./rattach-number-modal.component.scss'],
})
export class RattachNumberModalComponent implements OnInit {
  isLoading: boolean;
  @Input() phoneNumber: string;
  hasError: boolean;
  isInputValid: boolean;
  msgError: string;
  mainNumber = this.dashbServ.getMainPhoneNumber();
  constructor(
    private dialog: MatDialog,
    private modalCon: ModalController,
    private dashbServ: DashboardService,
    private accService: AccountService,
    private otpService: OtpService,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    if (this.phoneNumber) {
      this.processRattachement();
    }
  }

  isValidMobileNumber(): boolean {
    return REGEX_NUMBER.test(this.phoneNumber);
  }

  isValidFixNumber(): boolean {
    return REGEX_FIX_NUMBER.test(this.phoneNumber);
  }

  isValid() {
    const isMobile = this.isValidMobileNumber();
    const isFix = this.isValidFixNumber();

    this.isInputValid = isMobile || isFix;
  }

  processRattachement() {
    this.isLoading = true;
    this.hasError = false;
    this.msgError = null;
    const payload: { numero: string; typeNumero: 'MOBILE' | 'FIXE' } = {
      numero: this.phoneNumber,
      typeNumero: this.isValidMobileNumber() ? 'MOBILE' : 'FIXE',
    };
    this.dashbServ
      .registerNumberToAttach(payload)
      .pipe(
        tap(() => {
          this.openSuccessDialog(payload.numero);
        })
      )
      .subscribe(
        () => {
          this.isLoading = false;
          this.hasError = false;
          this.nextStepRattachement(
            true,
            'NONE',
            this.phoneNumber,
            payload.typeNumero
          );

          this.followAttachmentIssues(payload, 'event');
        },
        async (err: any) => {
          this.isLoading = false;
          this.hasError = true;
          this.followAttachmentIssues(payload, 'error');
          if (
            err &&
            (err.error.errorKey === 'userRattached' ||
              err.error.errorKey === 'userexists')
          ) {
            this.msgError = err.error.title
              ? err.error.title
              : "Impossible d'effectuer le rattachement de la ligne ";
          } else {
						let nextStep = 'FORWARD';
						let otpSent: boolean;
						if(payload.typeNumero === 'MOBILE') {
							const isCorporate = await	this.checkIfMsisdnIsCoorporate(payload.numero);
							console.log('isCorporate', isCorporate);

							if(isCorporate) {
								//send OTP MSG
								this.isLoading = true;
								otpSent = await this.otpService.generateOTPCode(payload.numero).pipe(
									map(_ => {
										return true;
									}), catchError( _ => {
										this.isLoading = false;
										return of(false);
									}), tap(_ => {
										this.isLoading = false;
									})
								).toPromise();
								nextStep = 'SENT_OTP';
							}
						}
						if( nextStep && !otpSent) {
							this.hasError = true;
							this.msgError = 'Ce rattachement ne peut être fait pour le moment. Veuillez réessayer plus tard';
						}
						if(nextStep === 'FORWARD' || nextStep === 'SENT_OTP' && otpSent) {
							this.nextStepRattachement(
								false,
								nextStep,
								this.phoneNumber,
								payload.typeNumero
							);
						}
          }
        }
      );
  }

	async checkIfMsisdnIsCoorporate(msisdn: string) {
		this.isLoading = true;
	 return	this.accService.checkIsCoorporateNumber(msisdn).pipe(
		 tap(_ => {
			 this.isLoading = false;
		 }), catchError( (err) => {
			this.isLoading = false;
			return throwError(err);
		 })
	 ).toPromise();
	}

  openSuccessDialog(phoneNumber?: string) {
    this.dialog.open(ModalSuccessComponent, {
      data: { type: 'rattachment-success', rattachedNumber: phoneNumber },
      width: '95%',
      maxWidth: '375px',
    });
  }

nextStepRattachement(
    status: boolean,
    direction: string,
    numeroToRattach?: string,
    typeRattachment?: string
  ) {
    this.modalCon.dismiss({
      rattached: status,
      numeroToRattach: numeroToRattach,
      direction: direction,
      typeRattachment: typeRattachment,
    });
  }

  openIdentifiedNumbersList() {
    this.nextStepRattachement(false, 'ORANGE_NUMBERS');
  }

  followAttachmentIssues(
    payload: { numero: string; typeNumero: string },
    eventType: 'error' | 'event'
  ) {
    if (eventType === 'event') {
      const infosFollow = {
        attached_number: payload.numero,
        login: this.mainNumber,
      };
      const eventName = `rattachment_${
        payload.typeNumero === 'FIXE' ? 'fixe' : 'mobile'
      }_success`;
      this.followAnalyticsService.registerEventFollow(
        eventName,
        eventType,
        infosFollow
      );
    } else {
      const infosFollow = {
        number_to_attach: payload.numero,
        login: this.mainNumber,
      };
      const errorName = `rattachment_${
        payload.typeNumero === 'FIXE' ? 'fixe' : 'mobile'
      }_failed`;
      this.followAnalyticsService.registerEventFollow(
        errorName,
        eventType,
        infosFollow
      );
    }
  }

  goBack() {
    this.modalCon.dismiss({
      direction: 'BACK',
    });
  }
}
