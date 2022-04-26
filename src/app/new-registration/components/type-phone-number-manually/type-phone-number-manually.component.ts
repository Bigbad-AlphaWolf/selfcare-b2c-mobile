import { HttpErrorResponse } from '@angular/common/http';
import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {GenerateOtpOem} from 'src/app/models/generate-otp-oem.model';
import {AuthenticationService} from 'src/app/services/authentication-service/authentication.service';
import {LocalStorageService} from 'src/app/services/localStorage-service/local-storage.service';
import {OtpService} from 'src/app/services/otp-service/otp.service';
import {LOCAL_STORAGE_KEYS, REGEX_NUMBER, STEPS_ACCESS_BY_OTP} from 'src/shared';

@Component({
  selector: 'app-type-phone-number-manually',
  templateUrl: './type-phone-number-manually.component.html',
  styleUrls: ['./type-phone-number-manually.component.scss']
})
export class TypePhoneNumberManuallyComponent implements OnInit {
  @Input() phoneNumber: string;
  @Input() step: STEPS_ACCESS_BY_OTP = STEPS_ACCESS_BY_OTP.ENTER_PHONE_NUMBER;
  @Input() hmacExpired: boolean;
  STEPS = STEPS_ACCESS_BY_OTP;
  hasError: boolean;
  maxAttemptsReached: boolean;
  isInputValid: boolean;
  msgError: string;
  isLoading: boolean;
  counter: any;
  intervalID: any;
  constructor(
    private modCtrl: ModalController,
    private localStorage: LocalStorageService,
    private otpService: OtpService,
    private authServ: AuthenticationService
  ) {}

  ngOnInit() {}

  async process() {
    console.log('input', this.phoneNumber);
    this.hasError = false;
    this.msgError = null;
    this.isLoading = true;
    if (this.isInputValid) {
      const isOrange = await this.checkIfIsOrangeUser();
      if (!isOrange) {
        this.hasError = true;
        this.msgError = 'Veuillez renseigner un numéro orange pour pouvoir continuer';
        this.isLoading = false;
      } else {
        this.saveToStorage();
        this.sendOTP();
      }
    } else {
      this.hasError = true;
      this.msgError = "Le numéro renseigné n'est pas valide";
    }
  }

  isValid(msisdn: string) {
    this.isInputValid = REGEX_NUMBER.test(msisdn);
  }

  saveToStorage() {
    this.localStorage.saveToLocalStorage(LOCAL_STORAGE_KEYS.NUMBER_FOR_OTP_REGISTRATION, this.phoneNumber);
  }

  goBack() {
    if (this.step === STEPS_ACCESS_BY_OTP.OPT_SENT) {
      this.step = STEPS_ACCESS_BY_OTP.ENTER_PHONE_NUMBER;
      this.stopCountDown();
    } else {
      this.modCtrl.dismiss();
    }
  }

  sendOTP() {
    this.maxAttemptsReached = false;
    const data: GenerateOtpOem = {
      msisdn: this.phoneNumber
    };
    this.isLoading = true;
    this.otpService.generateOTPBySMS(data).subscribe(
      res => {
        this.isLoading = false;
        this.hasError = false;
        this.onOtpSent();
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (err.status === 400) {
          this.hasError = true;
          this.maxAttemptsReached = true;
          this.msgError = err?.error?.title;
        }
      }
    );
  }

  onOtpSent() {
    this.step = STEPS_ACCESS_BY_OTP.OPT_SENT;
    this.startCountDown();
  }

  sendOTPCode() {
    this.startCountDown();
  }

  startCountDown() {
    this.counter = 60;
    this.intervalID = setInterval(() => {
      this.counter--;

      if (this.counter === 0) {
        clearInterval(this.intervalID);
        console.log('Ding!');
      }
    }, 1000);
  }

  stopCountDown() {
    clearInterval(this.intervalID);
  }

  closeModal() {
		this.stopCountDown();
    this.modCtrl.dismiss({
      success: true
    });
  }

  async checkIfIsOrangeUser() {
    return this.authServ.checkIfOrangeNumber(this.phoneNumber).pipe(catchError(_ => of(false))).toPromise();
  }
}
