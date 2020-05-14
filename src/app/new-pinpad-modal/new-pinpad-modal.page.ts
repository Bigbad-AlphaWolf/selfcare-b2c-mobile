import { Component, OnInit, Input } from '@angular/core';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import {
  OmLoginClientModel,
  OM_SERVICE_VERSION,
  OmRegisterClientModel,
  OmUserInfo,
  OmBalanceModel,
  OmBuyCreditModel,
  BuyPassPayload,
  OmBuyPassModel,
  OmBuyIllimixModel,
  TransferOMWithCodeModel,
  TransferOrangeMoneyModel,
} from '../services/orange-money-service';
import {
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TRANSFER_OM,
  OPERATION_TRANSFER_OM_WITH_CODE,
} from 'src/shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { NoOMAccountPopupComponent } from 'src/shared/no-omaccount-popup/no-omaccount-popup.component';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-pinpad-modal',
  templateUrl: './new-pinpad-modal.page.html',
  styleUrls: ['./new-pinpad-modal.page.scss'],
})
export class NewPinpadModalPage implements OnInit {
  @Input() operationType: string; //determine le type de la transaction Orange Money (Transfert, Recharge, Pass)
  @Input() buyPassPayload: any;
  @Input() buyCreditPayload: any;
  @Input() transferMoneyPayload: any;
  @Input() transferMoneyWithCodePayload: any;
  bullets = [0, 1, 2, 3];
  codePin = [];
  digitPadIsActive = true;
  pinHasError: boolean;
  pinError: string;
  loadingPinpad: boolean;
  omPhoneNumber: string;
  randomDigits: any[] = [];
  processingPin: boolean;
  pinpadData: any;
  dataToLog: any;
  checkingToken = true;
  form: FormGroup;
  userHasOmToken = false;
  noOMaccount = false;
  registering = false;
  resendCode = false;
  noOMAccountModal: MatDialogRef<NoOMAccountPopupComponent, any>;
  sendingOtp: boolean;
  recurrentOperation;
  title: string;
  allNumbers: string[] = [];
  otpValidation: boolean;
  errorOnOtp: string;
  otpHasError: boolean;
  mainPhoneNumber: string = this.dashboardService.getMainPhoneNumber();
  userNotRegisteredInOm: boolean;
  errorBulletActive: boolean;
  gettingPinpad: boolean;

  constructor(
    private orangeMoneyService: OrangeMoneyService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dashboardService: DashboardService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      codeOTP: ['', [Validators.required]],
    });
    this.getOMPhoneNumber();
    this.dataToLog = {
      operation: this.operationType,
      phoneNumber: this.omPhoneNumber,
      creditToBuy: this.buyCreditPayload,
      passToBuy: this.buyPassPayload,
      amountToTransfer: this.transferMoneyPayload,
    };
    this.orangeMoneyService.gotPinPadSubject.subscribe((value) => {
      if (value) {
        this.randomDigits = this.orderPinpadArray(value);
        this.orangeMoneyService.randomPinPadDigits = value;
        this.reintializePinpad();
        this.gettingPinpad = false;
      }
    });
  }

  orderPinpadArray(array: string[]) {
    let index = array.lastIndexOf(' ');
    let value = array[11];
    if (index !== 11) {
      array[11] = ' ';
      array[index] = value;
    }
    index = array.indexOf(' ');
    value = array[9];
    if (index !== 9) {
      array[9] = ' ';
      array[index] = value;
    }
    return array;
  }

  showResendCodeBtn(time: number) {
    // time in second
    setTimeout(() => {
      this.resendCode = true;
    }, time * 1000);
  }

  getOMPhoneNumber() {
    this.orangeMoneyService.getOmMsisdn().subscribe(
      (omMsisdn) => {
        if (omMsisdn && omMsisdn !== 'error') {
          this.omPhoneNumber = omMsisdn;
          this.checkUserHasOMToken();
        } else {
          this.userNotRegisteredInOm = true;
          this.omPhoneNumber = this.mainPhoneNumber;
          this.allNumbers.push(this.mainPhoneNumber);
          this.dashboardService.getAttachedNumbers().subscribe((res: any) => {
            res.forEach((element) => {
              const msisdn = '' + element.msisdn;
              if (!msisdn.startsWith('33', 0)) {
                this.allNumbers.push(element.msisdn);
              }
            });
            this.checkingToken = false;
          });
        }
      },
      (err) => {}
    );
  }

  checkUserHasOMToken() {
    this.orangeMoneyService
      .GetUserAuthInfo(this.omPhoneNumber)
      .subscribe((omUser) => {
        this.pinpadData = {
          msisdn: this.omPhoneNumber,
          os: 'Android',
          app_version: 'v1.0',
          app_conf_version: 'v1.0',
          service_version: OM_SERVICE_VERSION,
        };
        // If user already connected open pinpad
        if (omUser['hasApiKey']) {
          this.userHasOmToken = true;
          this.checkingToken = false;
          this.gettingPinpad = true;
          this.orangeMoneyService
            .GetPinPad(this.pinpadData)
            .subscribe((res: any) => {
              const omUser1 = this.orangeMoneyService.GetOrangeMoneyUser(
                this.omPhoneNumber
              );
              omUser1.active = omUser['hasApiKey'];
              omUser1.loginToken = omUser['accessToken'];
              omUser1.apiKey = omUser['apiKey'];
              omUser1.msisdn = this.omPhoneNumber;
              omUser1.sequence = res.content.data.sequence;
              omUser1.em = res.content.data.em;
              if (!omUser1.pinFailed) {
                omUser1.pinFailed = 0;
              }
              this.orangeMoneyService.SaveOrangeMoneyUser(omUser1);
            });
        } else {
          this.sendOTPCode();
        }
      });
  }

  sendOTPCode() {
    // TODO use specific error code to handle message => 012
    this.sendingOtp = true;
    this.orangeMoneyService.InitOtp(this.omPhoneNumber).subscribe(
      (res: any) => {
        this.checkingToken = false;
        this.sendingOtp = false;
        this.userNotRegisteredInOm = false;
        if (res.status_code.match('Erreur-046')) {
          this.openModalNoOMAccount();
          this.errorOnOtp = res.status_wording;
        } else {
          this.otpValidation = true;
          this.resendCode = false;
          this.showResendCodeBtn(30);
        }
      },
      (err) => {
        this.checkingToken = false;
        this.sendingOtp = false;
        this.resendCode = false;
        this.showResendCodeBtn(2);
      }
    );
  }

  openModalNoOMAccount() {
    this.noOMAccountModal = this.dialog.open(NoOMAccountPopupComponent, {
      disableClose: true,
      data: { pageDesktop: false },
    });
  }

  userRegisterOM() {
    this.registering = true;
    this.otpHasError = false;
    const registerData: OmRegisterClientModel = {
      msisdn: this.omPhoneNumber,
      code_otp: this.form.value.codeOTP,
      uuid: this.omPhoneNumber, // user unique id in selfcare b2c backend
      os: 'Android',
      firebase_id: this.omPhoneNumber,
      app_version: 'v1.0',
      conf_version: 'v1.0',
      service_version: '1.1',
    };
    this.orangeMoneyService.RegisterClient(registerData).subscribe(
      (res: any) => {
        this.registering = false;
        this.otpHasError = false;
        if (!res.status_code.match('Erreur')) {
          this.userHasOmToken = true;
          const omUser: OmUserInfo = {
            solde: 0,
            msisdn: this.omPhoneNumber,
            registerToken: res.content.data.access_token,
            registerRefreshToken: res.content.data.refresh_token,
            loginToken: 'string',
            loginRefreshToken: 'string',
            apiKey: res.content.data.api_key,
            history: [],
            active: true,
            pinFailed: 0,
            sequence: '',
            em: '',
            lastUpdate: '',
            lastUpdateTime: '',
            showSolde: true,
          };
          this.orangeMoneyService.SaveOrangeMoneyUser(omUser);
          this.gettingPinpad = true;
          this.orangeMoneyService
            .GetPinPad(this.pinpadData)
            .subscribe((response: any) => {
              const omUser1 = this.orangeMoneyService.GetOrangeMoneyUser(
                this.omPhoneNumber
              );
              omUser1.sequence = response.content.data.sequence;
              omUser1.em = response.content.data.em;
              this.orangeMoneyService.SaveOrangeMoneyUser(omUser1);
            });
        } else {
          this.otpHasError = true;
          this.errorOnOtp = res.status_wording;
        }
      },
      () => {
        this.registering = false;
      }
    );
  }

  processPin(pin: string) {
    this.processingPin = true;
    this.pinHasError = false;
    this.errorBulletActive = false;
    let canalPromotion;
    if (
      this.buyPassPayload &&
      this.buyPassPayload.pass &&
      this.buyPassPayload.pass.canalPromotion
    ) {
      canalPromotion = this.buyPassPayload.pass.canalPromotion;
    }
    // make request to server to check the OM pin
    const omUser = this.orangeMoneyService.GetOrangeMoneyUser(
      this.omPhoneNumber
    );
    pin = this.orangeMoneyService.GetPin(omUser.sequence.split(''), pin);
    if (omUser.msisdn === this.omPhoneNumber) {
      // the account is active
      if (omUser.active) {
        // login and get balance
        const loginPayload: OmLoginClientModel = {
          msisdn: omUser.msisdn,
          pin,
          em: omUser.em,
          app_version: 'v1.0',
          app_conf_version: 'v1.0',
          user_type: 'user',
          service_version: OM_SERVICE_VERSION,
        };
        this.orangeMoneyService.LoginClient(loginPayload).subscribe(
          (loginRes: any) => {
            this.processingPin = false;
            // check response status
            if (loginRes.status_code.match('Success')) {
              omUser.pinFailed = 0;
              omUser.loginToken = loginRes.content.data.access_token; // reset the pinfailed
              omUser.loginRefreshToken = loginRes.content.data.refresh_token;
              this.orangeMoneyService.SaveOrangeMoneyUser(omUser);
              switch (this.operationType) {
                case 'BUY_CREDIT':
                  const creditToBuy = Object.assign({}, this.buyCreditPayload, {
                    pin,
                  });
                  this.buyCredit(creditToBuy);
                  break;
                case OPERATION_TYPE_PASS_INTERNET:
                  const dataPassOM = {
                    msisdn2: this.buyPassPayload.destinataire,
                    pin,
                    price_plan_index: this.buyPassPayload.pass.passPromo
                      ? this.buyPassPayload.pass.passPromo.price_plan_index_om
                      : this.buyPassPayload.pass.price_plan_index_om,
                    canalPromotion,
                    amount: this.buyPassPayload.passPromo
                      ? this.buyPassPayload.pass.passPromo.tarif
                      : this.buyPassPayload.pass.tarif,
                  };
                  this.buyPass(dataPassOM);
                  break;
                case OPERATION_TYPE_PASS_ILLIMIX:
                  const dataIllimixOM = {
                    msisdn2: this.buyPassPayload.destinataire,
                    pin,
                    price_plan_index: this.buyPassPayload.pass.passPromo
                      ? this.buyPassPayload.pass.passPromo.price_plan_index_om
                      : this.buyPassPayload.pass.price_plan_index_om,
                    canalPromotion,
                    amount: this.buyPassPayload.pass.passPromo
                      ? this.buyPassPayload.pass.passPromo.tarif
                      : this.buyPassPayload.pass.tarif,
                  };

                  this.buyIllimix(dataIllimixOM);
                  break;
                case OPERATION_TRANSFER_OM:
                  const transferMoneyPayload = Object.assign(
                    {},
                    this.transferMoneyPayload,
                    {
                      pin,
                    }
                  );
                  this.transferMoney(transferMoneyPayload);
                  break;
                case OPERATION_TRANSFER_OM_WITH_CODE:
                  const transferPayload = Object.assign(
                    {},
                    this.transferMoneyWithCodePayload,
                    { pin }
                  );
                  this.transferMoneyWithCode(transferPayload);
                  break;
                default:
                  this.seeSolde(pin);
                  break;
              }
            } else {
              this.gettingPinpad = true;
              this.orangeMoneyService
                .GetPinPad(this.pinpadData)
                .subscribe((res: any) => {
                  const omUser = this.orangeMoneyService.GetOrangeMoneyUser(
                    this.omPhoneNumber
                  );
                  omUser.sequence = res.content.data.sequence;
                  omUser.em = res.content.data.em;
                  this.orangeMoneyService.SaveOrangeMoneyUser(omUser);
                  this.userHasOmToken = true;
                });
              omUser.pinFailed++;
              this.resetPad();
              // lock account when number of failed pin is >= 3
              if (omUser.pinFailed >= 3) {
                omUser.active = false;
                this.pinError = `Code secret est invalide. Vous venez de bloquer votre compte Orange Money. Veuillez passer dans une de nos agences pour le reactiver!`;
              } else {
                this.pinError = `Code secret est invalide. Il vous reste ${
                  3 - omUser.pinFailed
                } tentatives!`;
              }
              this.orangeMoneyService.SaveOrangeMoneyUser(omUser);
              this.pinHasError = true;
              this.errorBulletActive = true;
              this.orangeMoneyService.logWithFollowAnalytics(
                loginRes,
                'error',
                this.dataToLog
              );
            }
          },
          () => {
            this.processingPin = false;
            this.pinHasError = true;
            this.pinError =
              "Une erreur s'est produite. Veuillez réessayer plus tard.";
          }
        );
      } else {
        this.processingPin = false;
        this.pinError = `Votre compte Orange Money est bloqué. Veuillez passer dans une de nos agences pour le reactiver!`;
        this.errorBulletActive = true;
        this.pinHasError = true;
      }
    } else {
      this.processingPin = false;
      this.pinError = `Le numéro dont vous essayez de recupérer le solde n'est pas un numéro Orange.`;
      this.pinHasError = true;
    }

    if (this.pinHasError) {
      // clean pin, generate random pad and activate it to let user type his pin code
      this.saveEm();
    } else {
      this.pinHasError = false;
      this.pinError = '';
    }
  }

  seeSolde(pin: string) {
    this.processingPin = true;
    const db = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    // get balance
    const balancePayload: OmBalanceModel = {
      msisdn: db.msisdn,
      pin,
      em: db.em,
      app_version: 'v1.0',
      app_conf_version: 'v1.0',
      user_type: 'user',
      service_version: OM_SERVICE_VERSION,
    };
    this.orangeMoneyService.GetBalance(balancePayload).subscribe(
      (res: any) => {
        this.processingPin = false;
        // check response status
        if (res.status_code.match('Success')) {
          // valid pin
          db.pinFailed = 0; // reset the pinfailed
          db.solde = res.content.data.balance;
          const date = new Date();
          const lastDate = `${('0' + date.getDate()).slice(-2)}/${(
            '0' +
            (date.getMonth() + 1)
          ).slice(-2)}/${date.getFullYear()}`;
          const lastDateTime =
            `${date.getHours()}h` +
            (date.getMinutes() < 10 ? '0' : '') +
            date.getMinutes();
          db.lastUpdate = lastDate;
          db.lastUpdateTime = lastDateTime;
          this.orangeMoneyService.SaveOrangeMoneyUser(db);
          // this.dashService.balanceAvailableSubject.next(db.solde);
          if (!this.operationType) {
            this.modalController.dismiss({
              'success': true
            });
          } else {
            // this.resultEmit.emit(db.solde);
          }
          this.orangeMoneyService.logWithFollowAnalytics(
            res,
            'event',
            this.dataToLog
          );
        } else {
          // this.goToDashboard();
          this.orangeMoneyService.logWithFollowAnalytics(
            res,
            'error',
            this.dataToLog
          );
        }
      },
      () => {
        this.processingPin = false;
      }
    );
  }

  buyCredit(params: { msisdn2: string; pin: any; amount: number }) {
    this.processingPin = true;
    const db = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    // get balance
    const buyCreditPayload: OmBuyCreditModel = {
      msisdn: db.msisdn,
      msisdn2: params.msisdn2,
      pin: params.pin,
      amount: params.amount,
      em: db.em,
      app_version: 'v1.0',
      app_conf_version: 'v1.0',
      user_type: 'user',
      service_version: OM_SERVICE_VERSION,
    };
    this.orangeMoneyService.AchatCredit(buyCreditPayload).subscribe(
      (res: any) => {
        this.processResult(res, db);
      },
      () => {
        this.processingPin = false;
      }
    );
  }

  buyPass(params: BuyPassPayload) {
    this.processingPin = true;
    const db = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    // get balance
    const buyPassPayload: OmBuyPassModel = {
      msisdn: db.msisdn,
      msisdn2: params.msisdn2,
      pin: params.pin,
      price_plan_index: params.price_plan_index,
      em: db.em,
      app_version: 'v1.0',
      app_conf_version: 'v1.0',
      user_type: 'user',
      service_version: OM_SERVICE_VERSION,
      amount: params.amount,
    };
    if (params.canalPromotion) {
      buyPassPayload.canal = params.canalPromotion;
    }
    this.orangeMoneyService.AchatPassInternet(buyPassPayload).subscribe(
      (res: any) => {
        this.processResult(res, db);
      },
      () => {
        this.processingPin = false;
      }
    );
  }

  buyIllimix(params: BuyPassPayload) {
    this.processingPin = true;
    const db = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    // get balance
    const buyPassPayload: OmBuyIllimixModel = {
      msisdn: db.msisdn,
      msisdn2: params.msisdn2,
      pin: params.pin,
      price_plan_index: params.price_plan_index,
      em: db.em,
      app_version: 'v1.0',
      app_conf_version: 'v1.0',
      user_type: 'user',
      service_version: OM_SERVICE_VERSION,
      amount: params.amount,
    };
    if (params.canalPromotion) {
      buyPassPayload.canal = params.canalPromotion;
    }
    this.orangeMoneyService.AchatIllimix(buyPassPayload).subscribe(
      (res: any) => {
        this.processResult(res, db);
      },
      () => {
        this.processingPin = false;
      }
    );
  }

  transferMoney(params: { msisdn2: string; pin: any; amount: number }) {
    this.processingPin = true;
    const omUser = this.orangeMoneyService.GetOrangeMoneyUser(
      this.omPhoneNumber
    );
    const transferOMPayload: TransferOrangeMoneyModel = {
      msisdn_sender: omUser.msisdn,
      msisdn_receiver: params.msisdn2,
      amount: params.amount,
      uuid: 'uuid',
      os: 'mobile',
      pin: params.pin,
      em: omUser.em,
      app_version: 'v1.0',
      app_conf_version: 'v1.0',
      user_type: 'user',
      service_version: OM_SERVICE_VERSION,
    };
    this.orangeMoneyService.transferOM(transferOMPayload).subscribe(
      (res: any) => {
        this.processResult(res, omUser);
      },
      (err) => {
        this.processingPin = false;
      }
    );
  }

  transferMoneyWithCode(params: {
    msisdn2: string;
    pin: any;
    amount: number;
    nom_receiver: string;
    prenom_receiver: string;
  }) {
    this.processingPin = true;
    const omUser = this.orangeMoneyService.GetOrangeMoneyUser(
      this.omPhoneNumber
    );
    const transferOMPayload: TransferOMWithCodeModel = {
      msisdn: omUser.msisdn,
      msisdn2: params.msisdn2,
      amount: params.amount,
      uuid: 'uuid',
      os: 'mobile',
      pin: params.pin,
      em: omUser.em,
      app_version: 'v1.0',
      app_conf_version: 'v1.0',
      user_type: 'user',
      service_version: OM_SERVICE_VERSION,
      nom_receiver: params.nom_receiver,
      prenom_receiver: params.prenom_receiver,
    };
    this.orangeMoneyService.transferOMWithCode(transferOMPayload).subscribe(
      (res: any) => {
        this.processResult(res, omUser);
      },
      (err) => {
        this.processingPin = false;
      }
    );
  }

  processResult(res: any, db: any) {
    // check response status
    this.processingPin = false;
    if (
      (res && res.status_code !== null && res.status_code.match('Success')) ||
      (res && res.content.data.status_code === '200')
    ) {
      // valid pin
      db.pinFailed = 0; // reset the pinfailed
      this.orangeMoneyService.logWithFollowAnalytics(
        res,
        'event',
        this.dataToLog
      );
      this.modalController.dismiss({
        success: true,
      });
    } else {
      this.pinHasError = true;
      this.orangeMoneyService.logWithFollowAnalytics(
        res,
        'error',
        this.dataToLog
      );
      if (res === null || res.status_code === null) {
        this.pinError = "Une erreur s'est produite.";
        this.recurrentOperation = true;
        // this.resultEmit.emit('erreur');
      } else if (res.status_code.match('Erreur-045')) {
        this.pinError =
          'Vous avez effectué la même transaction il y a quelques instants.';
        this.recurrentOperation = true;
        // this.resultEmit.emit('erreur');
      } else if (
        res.status_code.match('Erreur-019') ||
        res.status_code.match('Erreur-602') ||
        res.status_code.match('Erreur-55')
      ) {
        this.pinError = res.status_code.match('Erreur-55')
          ? res.content.data.message
          : res.status_wording;
        this.recurrentOperation = true;
        // this.resultEmit.emit('erreur');
      } else {
        this.pinError = res.status_wording;
        // this.resultEmit.emit('erreur');
      }
    }
  }

  saveEm() {
    this.gettingPinpad = true;
    this.orangeMoneyService.GetPinPad(this.pinpadData).subscribe((res: any) => {
      const omUser = this.orangeMoneyService.GetOrangeMoneyUser(
        this.omPhoneNumber
      );
      omUser.sequence = res.content.data.sequence;
      omUser.em = res.content.data.em;
      this.orangeMoneyService.SaveOrangeMoneyUser(omUser);
    });
  }

  reintializePinpad() {
    this.resetPad();
    this.enableDigitPad();
  }

  resetPad() {
    this.codePin = [];
  }

  type(digit: string) {
    if (this.digitPadIsActive) {
      this.errorBulletActive = false;
      if (this.codePin.length < 4 && digit !== ' ') {
        this.codePin.push(digit);
        if (this.codePin.length === 4) {
          const pin = this.codePin.join('');
          this.processPin(pin);
        }
      }
    }
  }

  delete() {
    this.codePin.pop();
  }

  disableDigitPad() {
    this.digitPadIsActive = false;
  }

  enableDigitPad() {
    this.digitPadIsActive = true;
  }
}
