import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import {
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TRANSFER_OM,
  OPERATION_TRANSFER_OM_WITH_CODE
} from '..';
import { forkJoin } from 'rxjs';
import {
  OM_SERVICE_VERSION,
  OmRegisterClientModel,
  OmUserInfo,
  OmLoginClientModel,
  OmBalanceModel,
  OmBuyCreditModel,
  OmBuyPassModel,
  OmBuyIllimixModel,
  TransferOrangeMoneyModel,
  BuyPassPayload,
  TransferOMWithCodeModel
} from 'src/app/services/orange-money-service';
import * as SecureLS from 'secure-ls';
import { NoOMAccountPopupComponent } from '../no-omaccount-popup/no-omaccount-popup.component';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-activation-om',
  templateUrl: './activation-om.component.html',
  styleUrls: ['./activation-om.component.scss']
})
export class ActivationOmComponent implements OnInit {
  @Input() operation: any;
  @Input() creditToBuy: any;
  @Input() passToBuy: any;
  @Input() amountToTransfer: { msisdn2: string; amount: number };
  @Input() transferWithCodePayload: {
    msisdn2: string;
    amount: number;
    nom: string;
    prenom: string;
  };
  @Output() resultEmit = new EventEmitter();
  checkingToken = true;
  form: FormGroup;
  getToken = false;
  noOMaccount = false;
  otpLoader = false;
  infosText =
    'Pour valider votre achat de crédit, merci de renseigner votre code secret <span class="scb-text-orange"> Orange Money </span>';
  phoneNumber: string;
  jwt: any;
  pinPadData: any;
  pinPadHasError: boolean;
  pinErrorMsg: string;
  loading;
  resendCode = false;
  noOMAccountModal: MatDialogRef<NoOMAccountPopupComponent, any>;
  sendOTPLoader: boolean;
  recurrentOperation;
  activationOM: boolean;
  title: string;
  allNumbers: string[];
  firstTimeOM: boolean;
  stepOtp: boolean;
  dataToLog: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dashService: DashboardService,
    private omService: OrangeMoneyService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      codeOTP: ['', [Validators.required]]
    });
    this.getOmPhoneNumber();
    switch (this.operation) {
      case 'BUY_CREDIT':
        this.infosText =
          'Pour valider votre achat de crédit, merci de renseigner votre code secret <span class="scb-text-orange"> Orange Money </span>';
        this.title = 'Recharger du Crédit';
        break;
      case OPERATION_TYPE_PASS_INTERNET:
        this.infosText =
          'Pour valider votre achat de pass internet, merci de renseigner votre code secret <span class="scb-text-orange"> Orange Money </span>';
        this.title = 'Achat de pass Internet';
        break;
      case OPERATION_TYPE_PASS_ILLIMIX:
        this.infosText =
          'Pour valider votre achat de pass illimix, merci de renseigner votre code secret <span class="scb-text-orange"> Orange Money </span>';
        this.title = 'Achat de pass Illimix';
        break;
      case 'TRANSFER_MONEY':
        this.infosText =
          'Pour valider votre transfert d`argent, merci de renseigner votre code secret <span class="scb-text-orange"> Orange Money </span>';
        this.title = 'Transfert d`argent';
        break;
      default:
        this.infosText =
          'Pour voir votre solde, merci de renseigner votre code secret <span class="scb-text-orange"> Orange Money </span>';
        this.title = 'Affichage solde Orange Money';
        break;
    }

    this.dataToLog = {
      operation: this.operation,
      phoneNumber: this.phoneNumber,
      creditToBuy: this.creditToBuy,
      passToBuy: this.passToBuy,
      amountToTransfer: this.amountToTransfer
    };
  }

  showResendCodeBtn(time: number) {
    // time in second
    setTimeout(() => {
      this.resendCode = true;
    }, time * 1000);
  }
  goToStepOtp() {
    this.sendOTPCode();
    this.stepOtp = true;
  }

  // Check is there is any phone number linked to OM
  getOmPhoneNumber() {
    this.firstTimeOM = true;
    this.stepOtp = false;
    this.allNumbers = [];
    this.phoneNumber = this.dashService.getMainPhoneNumber();
    this.allNumbers.push(this.phoneNumber);
    this.dashService.getAttachedNumbers().subscribe((resp: any) => {
      resp.forEach(element => {
        const msisdn = '' + element.msisdn;
        // Avoid fix numbers
        if (!msisdn.startsWith('33', 0)) {
          this.allNumbers.push(element.msisdn);
        }
      });
      // request orange money info for every number
      const httpCalls = [];
      this.allNumbers.forEach(number => {
        httpCalls.push(this.omService.GetUserAuthInfo(number));
      });
      forkJoin(httpCalls).subscribe(
        data => {
          for (const [index, element] of data.entries()) {
            // if the number is linked with OM, keep it and break out of the for loop
            if (element['hasApiKey'] && element['hasApiKey'] != null) {
              // set the orange Money number in localstorage and the key is nOrMo (numero Orange Money)
              ls.set('nOrMo', this.allNumbers[index]);
              this.phoneNumber = this.allNumbers[index];
              this.checkOrangeMoneyToken();
              this.firstTimeOM = false;
              break;
            }
          }
          this.checkingToken = false;
        },
        err => console.error(err)
      );
    });
  }
  checkOrangeMoneyToken() {
    this.omService.GetUserAuthInfo(this.phoneNumber).subscribe(omUser => {
      this.pinPadData = {
        msisdn: this.phoneNumber,
        os: 'Android',
        channel: 'selfcare-b2c',
        app_version: 'v1.0',
        app_conf_version: 'v1.0',
        service_version: OM_SERVICE_VERSION
      };
      // If user already connected open pinpad
      if (omUser['hasApiKey']) {
        this.getToken = true;
        this.omService.GetPinPad(this.pinPadData).subscribe((res: any) => {
          this.checkingToken = false;
          const omUser1 = this.omService.GetOrangeMoneyUser(this.phoneNumber);
          omUser1.active = omUser['hasApiKey'];
          omUser1.loginToken = omUser['accessToken'];
          omUser1.apiKey = omUser['apiKey'];
          omUser1.msisdn = this.phoneNumber;
          omUser1.sequence = res.content.data.sequence;
          omUser1.em = res.content.data.em;
          this.omService.SaveOrangeMoneyUser(omUser1);
        });
      } else {
        this.sendOTPCode();
      }
    });
  }

  onSubmit() {
    this.otpLoader = true;
    const registerData: OmRegisterClientModel = {
      msisdn: this.phoneNumber,
      code_otp: this.form.value.codeOTP,
      uuid: this.phoneNumber, // user unique id in selfcare b2c backend
      os: 'Android',
      channel: 'selfcare-b2c',
      firebase_id: this.phoneNumber,
      app_version: 'v1.0',
      conf_version: 'v1.0',
      service_version: '1.1'
    };

    this.omService.RegisterClient(registerData).subscribe(
      (res: any) => {
        this.otpLoader = false;
        this.pinPadHasError = false;
        if (!res.status_code.match('Erreur')) {
          this.getToken = true;
          const omUser: OmUserInfo = {
            solde: 0,
            msisdn: this.phoneNumber,
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
            showSolde: true
          };
          this.omService.SaveOrangeMoneyUser(omUser);
          this.activationOM = true;
          this.pinPadData = {
            msisdn: this.phoneNumber,
            os: 'Android',
            channel: 'selfcare-b2c',
            app_version: 'v1.0',
            app_conf_version: 'v1.0',
            service_version: OM_SERVICE_VERSION
          };
          this.omService
            .GetPinPad(this.pinPadData)
            .subscribe((response: any) => {
              const omUser1 = this.omService.GetOrangeMoneyUser(
                this.phoneNumber
              );
              omUser1.sequence = response.content.data.sequence;
              omUser1.em = response.content.data.em;
              this.omService.SaveOrangeMoneyUser(omUser1);
            });
        } else {
          this.pinPadHasError = true;
          this.pinErrorMsg = res.status_wording;
        }
      },
      () => {
        this.otpLoader = false;
      }
    );
  }

  sendOTPCode() {
    this.sendOTPLoader = true;
    this.omService.InitOtp(this.phoneNumber).subscribe((res: any) => {
      this.checkingToken = false;
      this.sendOTPLoader = false;
      if (res.status_code.match('Erreur')) {
        if (res.status_wording.match('compte Orange Money')) {
          this.openModalNoOMAccount();
        }
        this.pinErrorMsg = res.status_wording;
      } else {
        this.resendCode = false;
        this.showResendCodeBtn(30);
      }
    });
  }

  openModalNoOMAccount() {
    this.noOMAccountModal = this.dialog.open(NoOMAccountPopupComponent, {
      disableClose: true,
      data: { pageDesktop: false }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  processPin(pin: string) {
    this.pinPadHasError = false;
    this.loading = true;
    const userPhoneNumber = this.phoneNumber;
    let canalPromotion;
    if (
      this.passToBuy &&
      this.passToBuy.pass &&
      this.passToBuy.pass.canalPromotion
    ) {
      canalPromotion = this.passToBuy.pass.canalPromotion;
    }
    // make request to server to check the OM pin
    const db = this.omService.GetOrangeMoneyUser(userPhoneNumber);
    pin = this.omService.GetPin(db.sequence.split(''), pin);
    if (db.msisdn === userPhoneNumber) {
      // the account is active
      if (db.active) {
        // login and get balance
        const loginPayload: OmLoginClientModel = {
          msisdn: db.msisdn,
          pin,
          em: db.em,
          app_version: 'v1.0',
          app_conf_version: 'v1.0',
          user_type: 'user',
          channel: 'mobile',
          service_version: OM_SERVICE_VERSION
        };
        this.omService.LoginClient(loginPayload).subscribe(
          (loginRes: any) => {
            this.loading = false;
            // check response status
            if (loginRes.status_code.match('Success')) {
              db.pinFailed = 0;
              db.loginToken = loginRes.content.data.access_token; // reset the pinfailed
              db.loginRefreshToken = loginRes.content.data.refresh_token;
              this.omService.SaveOrangeMoneyUser(db);
              if (this.activationOM) {
              }
              if (this.operation === 'BUY_CREDIT') {
                const creditToBuy = Object.assign({}, this.creditToBuy, {
                  pin
                });
                this.buyCredit(creditToBuy);
              } else if (this.operation === OPERATION_TYPE_PASS_INTERNET) {
                const dataPassOM = {
                  msisdn2: this.passToBuy.destinataire,
                  pin,
                  price_plan_index: this.passToBuy.pass.price_plan_index_om,
                  canalPromotion,
                  amount: this.passToBuy.pass.tarif
                };
                this.buyPass(dataPassOM);
              } else if (this.operation === OPERATION_TYPE_PASS_ILLIMIX) {
                const dataIllimixOM = {
                  msisdn2: this.passToBuy.destinataire,
                  pin,
                  price_plan_index: this.passToBuy.pass.price_plan_index_om,
                  canalPromotion,
                  amount: this.passToBuy.pass.tarif
                };

                this.buyIllimix(dataIllimixOM);
              } else if (this.operation === 'CHECK_SOLDE' || !this.operation) {
                this.seeSolde(pin);
              } else if (this.operation === OPERATION_TRANSFER_OM) {
                const transferMoneyPayload = Object.assign(
                  {},
                  this.amountToTransfer,
                  {
                    pin
                  }
                );
                this.transferMoney(transferMoneyPayload);
              } else if (this.operation === OPERATION_TRANSFER_OM_WITH_CODE) {
                const transferPayload = Object.assign(
                  {},
                  this.transferWithCodePayload,
                  { pin }
                );
                this.transferMoneyWithCode(transferPayload);
              }
            } else {
              if (this.activationOM) {
                const followDetails = { error_code: loginRes.status_code };
              }
              this.omService
                .GetPinPad(this.pinPadData)
                .subscribe((res: any) => {
                  const omUser = this.omService.GetOrangeMoneyUser(
                    this.phoneNumber
                  );
                  omUser.sequence = res.content.data.sequence;
                  omUser.em = res.content.data.em;
                  this.omService.SaveOrangeMoneyUser(omUser);
                  this.getToken = true;
                });
              db.pinFailed++;
              // lock account when number of failed pin is >= 3
              if (db.pinFailed >= 3) {
                db.active = false;
                this.pinErrorMsg = `Code secret est invalide. Vous venez de bloquer votre compte Orange Money. Veuillez passer dans une de nos agences pour le reactiver!`;
              } else {
                this.pinErrorMsg = `Code secret est invalide. Il vous reste ${3 -
                  db.pinFailed} tentatives!`;
              }
              this.omService.SaveOrangeMoneyUser(db);
              this.pinPadHasError = true;
              this.omService.logWithFollowAnalytics(
                loginRes,
                'error',
                this.dataToLog
              );
            }
          },
          () => {
            this.loading = false;
          }
        );
      } else {
        this.loading = false;
        this.pinErrorMsg = `Votre compte Orange Money est bloqué. Veuillez passer dans une de nos agences pour le reactiver!`;
        this.pinPadHasError = true;
      }
    } else {
      this.loading = false;
      this.pinErrorMsg = `Le numéro dont vous essayez de recupérer le solde n'est pas un numéro Orange.`;
      this.pinPadHasError = true;
    }

    if (this.pinPadHasError) {
      // clean pin, generate random pad and activate it to let user type his pin code
      this.saveEm();
    } else {
      this.pinPadHasError = false;
      this.pinErrorMsg = '';
    }
  }

  seeSolde(pin: string) {
    this.loading = true;
    const db = this.omService.GetOrangeMoneyUser(this.phoneNumber);
    // get balance
    const balancePayload: OmBalanceModel = {
      msisdn: db.msisdn,
      pin,
      em: db.em,
      app_version: 'v1.0',
      app_conf_version: 'v1.0',
      user_type: 'user',
      channel: 'mobile',
      service_version: OM_SERVICE_VERSION
    };

    this.omService.GetBalance(balancePayload).subscribe(
      (res: any) => {
        this.loading = false;
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
          this.omService.SaveOrangeMoneyUser(db);
          this.dashService.balanceAvailableSubject.next(db.solde);
          if (!this.operation) {
            this.goToDashboard();
          } else {
            this.resultEmit.emit(db.solde);
          }
          this.omService.logWithFollowAnalytics(res, 'event', this.dataToLog);
        } else {
          this.goToDashboard();
          this.omService.logWithFollowAnalytics(res, 'error', this.dataToLog);
        }
      },
      () => {
        this.loading = false;
      }
    );
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  buyCredit(params: { msisdn2: string; pin: any; amount: number }) {
    this.loading = true;
    const db = this.omService.GetOrangeMoneyUser(this.phoneNumber);
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
      channel: 'mobile',
      service_version: OM_SERVICE_VERSION
    };
    this.omService.AchatCredit(buyCreditPayload).subscribe(
      (res: any) => {
        this.processResult(res, db);
      },
      () => {
        this.loading = false;
      }
    );
  }

  buyPass(params: BuyPassPayload) {
    this.loading = true;
    const db = this.omService.GetOrangeMoneyUser(this.phoneNumber);
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
      channel: 'mobile',
      service_version: OM_SERVICE_VERSION,
      amount: params.amount
    };
    if (params.canalPromotion) {
      buyPassPayload.canal = params.canalPromotion;
    }
    this.omService.AchatPassInternet(buyPassPayload).subscribe(
      (res: any) => {
        this.processResult(res, db);
      },
      () => {
        this.loading = false;
      }
    );
  }

  buyIllimix(params: BuyPassPayload) {
    this.loading = true;
    const db = this.omService.GetOrangeMoneyUser(this.phoneNumber);
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
      channel: 'mobile',
      service_version: OM_SERVICE_VERSION,
      amount: params.amount
    };
    if (params.canalPromotion) {
      buyPassPayload.canal = params.canalPromotion;
    }
    this.omService.AchatIllimix(buyPassPayload).subscribe(
      (res: any) => {
        this.processResult(res, db);
      },
      () => {
        this.loading = false;
      }
    );
  }

  processResult(res: any, db: any) {
    // check response status
    this.loading = false;
    if (
      (res && res.status_code !== null && res.status_code.match('Success')) ||
      (res && res.content.data.status_code === '200')
    ) {
      // valid pin
      db.pinFailed = 0; // reset the pinfailed
      this.omService.logWithFollowAnalytics(res, 'event', this.dataToLog);
      this.resultEmit.emit(db.solde);
    } else {
      this.pinPadHasError = true;
      this.omService.logWithFollowAnalytics(res, 'error', this.dataToLog);
      if (res === null || res.status_code === null) {
        this.pinErrorMsg = "Une erreur s'est produite.";
        this.recurrentOperation = true;
        this.resultEmit.emit('erreur');
      } else if (res.status_code.match('Erreur-045')) {
        this.pinErrorMsg =
          'Vous avez effectué la même transaction il y a quelques instants.';
        this.recurrentOperation = true;
        this.resultEmit.emit('erreur');
      } else if (
        res.status_code.match('Erreur-019') ||
        res.status_code.match('Erreur-602') ||
        res.status_code.match('Erreur-55')
      ) {
        this.pinErrorMsg = res.status_code.match('Erreur-55')
          ? res.content.data.message
          : res.status_wording;
        this.recurrentOperation = true;
        this.resultEmit.emit('erreur');
      } else {
        this.pinErrorMsg = res.status_wording;
        this.resultEmit.emit('erreur');
      }
    }
  }

  saveEm() {
    this.omService.GetPinPad(this.pinPadData).subscribe((res: any) => {
      const omUser = this.omService.GetOrangeMoneyUser(this.phoneNumber);
      omUser.sequence = res.content.data.sequence;
      omUser.em = res.content.data.em;
      this.omService.SaveOrangeMoneyUser(omUser);
    });
  }

  transferMoney(params: { msisdn2: string; pin: any; amount: number }) {
    this.loading = true;
    const omUser = this.omService.GetOrangeMoneyUser(this.phoneNumber);
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
      channel: 'mobile',
      service_version: OM_SERVICE_VERSION
    };
    console.log(transferOMPayload);
    this.omService.transferOM(transferOMPayload).subscribe(
      (res: any) => {
        this.processResult(res, omUser);
      },
      err => {
        this.loading = false;
      }
    );
  }

  transferMoneyWithCode(params: {
    msisdn2: string;
    pin: any;
    amount: number;
    nom: string;
    prenom: string;
  }) {
    this.loading = true;
    const omUser = this.omService.GetOrangeMoneyUser(this.phoneNumber);
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
      channel: 'mobile',
      service_version: OM_SERVICE_VERSION,
      nom: params.nom,
      prenom: params.prenom
    };
    this.omService.transferOMWithCode(transferOMPayload).subscribe(
      (res: any) => {
        this.processResult(res, omUser);
      },
      err => {
        this.loading = false;
      }
    );
  }
}
