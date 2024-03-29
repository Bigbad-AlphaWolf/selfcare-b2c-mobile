import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { OmCheckOtpModel } from 'src/app/models/om-self-operation-otp.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { ERROR_MSG_OM_CODE_OTP_INVALIDE, SUCCESS_OM_STATUS_CODE } from 'src/app/services/orange-money-service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';

@Component({
  selector: 'app-type-otp-modal',
  templateUrl: './type-otp-modal.component.html',
  styleUrls: ['./type-otp-modal.component.scss'],
})
export class TypeOtpModalComponent implements OnInit, AfterViewInit {
  currentInput = 1;
  @ViewChild('input', { static: true }) input: IonInput;
  @Input() checkOtpPayload: OmCheckOtpModel;
  checkingOtp: boolean;
  errorCheckOtp: boolean;
  errorMsg: string;
  sendingOtp: boolean;
  constructor(private orangeMoneyService: OrangeMoneyService, private modal: ModalController, private oemLoggingService: OemLoggingService, private dashbServ: DashboardService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.input.setFocus();
    }, 500);
  }

  sendCode() {
    this.sendingOtp = true;
    this.orangeMoneyService.initSelfOperationOtp(this.checkOtpPayload.kyc).subscribe(
      _ => {
        this.sendingOtp = false;
      },
      _ => {
        this.sendingOtp = false;
      }
    );
  }

  checkOtp() {
    this.checkingOtp = true;
    this.errorCheckOtp = false;
    const otp = this.input.value;
    const eventTypeName = this.checkOtpPayload.typeDemande === 'INSCRIPTION' ? 'open_om_account' : 'deplafonnement_om';
    this.orangeMoneyService.checkSelfOperationOtp(this.checkOtpPayload, otp).subscribe(
      res => {
        this.checkingOtp = false;
        this.oemLoggingService.registerEvent(
          `${eventTypeName}_check_otp_success`,
          convertObjectToLoggingPayload({
            userMsisdn: this.dashbServ.getCurrentPhoneNumber(),
            omMsisdn: this.checkOtpPayload.msisdn,
          })
        );
        this.modal.dismiss({ accept: true });
      },
      err => {
        this.errorCheckOtp = true;
        this.checkingOtp = false;
        this.errorMsg = 'Une erreur est survenue';
        this.input.value = '';
        this.oemLoggingService.registerEvent(
          `${eventTypeName}_check_otp_failed`,
          convertObjectToLoggingPayload({
            userMsisdn: this.dashbServ.getCurrentPhoneNumber(),
            omMsisdn: this.checkOtpPayload.msisdn,
            error: err,
          })
        );
        if (err && err.status === 400 && err.error.code === 'OTP_CHECK_ERROR') {
          this.errorMsg = ERROR_MSG_OM_CODE_OTP_INVALIDE;
        }
      }
    );
  }
}
