import { Component, OnInit, Input } from '@angular/core';
import { FACE_ID_OM_INFOS, FACE_ID_PERMISSIONS, OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import {
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
  MerchantPaymentModel,
  LIST_DENIED_PIN_OM,
  DEFAULT_ERROR_MSG_CHANGE_PIN_WITH_BIRTH_DATE_VALIDATION,
  DEFAULT_ERROR_MSG_CHANGE_PIN_VALIDATION,
  TransferIRTModel,
} from '../services/orange-money-service';
import {
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TRANSFER_OM,
  OPERATION_TRANSFER_OM_WITH_CODE,
  OPERATION_TYPE_MERCHANT_PAYMENT,
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TYPE_PASS_ALLO,
  OPERATION_TYPE_PASS_VOYAGE,
  OPERATION_INIT_CHANGE_PIN_OM,
  OPERATION_CHANGE_PIN_OM,
  PAYMENT_MOD_OM,
  OPERATION_TYPE_PASS_ILLIFLEX,
  OPERATION_BLOCK_TRANSFER,
  OM_IDENTIC_TRANSACTION_CODE,
  OM_CAPPING_ERROR,
  OPERATION_CREATE_PIN_OM,
  BLOCKED_PASS,
  OPERATION_TYPE_PASS_INTERNATIONAL,
  formatCountryCallId,
  OPERATION_RESET_PIN_OM,
  ERROR_CODE_INVALID_XEWEUL_CARD,
  MSG_XEWEUL_CARD_INVALID,
  ERROR_CODE_INVALID_AMOUNT_TO_RECHARGE_XEWEUL_CARD,
  MSG_XEWEUL_CARD_INVALID_AMOUNT_TO_RECHARGE,
  OPERATION_ABONNEMENT_WIDO,
} from 'src/shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { NoOMAccountPopupComponent } from 'src/shared/no-omaccount-popup/no-omaccount-popup.component';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { ModalController, NavController } from '@ionic/angular';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import {
  OPERATION_RAPIDO,
  OPERATION_XEWEUL,
  OPERATION_TYPE_INTERNATIONAL_TRANSFER,
  OPERATION_TYPE_PAY_BILL,
  OPERATION_TYPE_SENEAU_BILLS,
  OPERATION_TYPE_SENELEC_BILLS,
  OPERATION_TYPE_TERANGA_BILL,
  OPERATION_WOYOFAL,
} from '../utils/operations.constants';
import { OperationExtras } from '../models/operation-extras.model';
import { WoyofalService } from '../services/woyofal/woyofal.service';
import { RapidoService } from '../services/rapido/rapido.service';
import { FollowOemlogPurchaseInfos } from '../models/follow-log-oem-purchase-Infos.model';
import { IlliflexModel } from '../models/illiflex-pass.model';
import { PurchaseModel } from '../models/purchase.model';
import { ConfirmMsisdnModel } from '../services/authentication-service/authentication.service';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { Router } from '@angular/router';
import { BillsService } from '../services/bill-service/bills.service';
import { BillPaymentModel, PAYMENT_BILLS_CATEGORY } from '../models/bill-payment.model';
import { OMCustomerStatusModel } from '../models/om-customer-status.model';
import { CustomerOperationStatus } from '../models/enums/om-customer-status.enum';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import * as SecureLS from 'secure-ls';
import { XeweulService } from '../services/xeweul/xeweul.service';
import { PassAbonnementWidoService } from '../services/pass-abonnement-wido-service /pass-abonnement-wido.service';
import { ANALYTICS_PROVIDER, OemLoggingService } from '../services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from '../utils/utils';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: "app-new-pinpad-modal",
  templateUrl: "./new-pinpad-modal.page.html",
  styleUrls: ["./new-pinpad-modal.page.scss"],
})
export class NewPinpadModalPage implements OnInit {
  @Input() operationType: string; //determine le type de la transaction Orange Money (Transfert, Recharge, Pass)
  @Input() buyPassPayload: any;
  @Input() buyCreditPayload: any;
  @Input() transferMoneyPayload: any;
  @Input() transferMoneyWithCodePayload: any;
  @Input() merchantPaymentPayload: any;
  @Input() illiflexPayload: IlliflexModel;
  @Input() opXtras: OperationExtras;
  @Input()
  omInfos: {
    apiKey: string;
    em: string;
    loginToken: string;
    msisdn: string;
    sequence: string;
    birthYear: string;
  };
  @Input() transactionToBlock: PurchaseModel;
  @Input() payloadCreatePin: ConfirmMsisdnModel;
  OPERATION_CHANGE_PIN_OM = OPERATION_CHANGE_PIN_OM;
  OPERATION_BLOCK_TRANSFER = OPERATION_BLOCK_TRANSFER;
  OPERATION_CREATE_PIN_OM = OPERATION_CREATE_PIN_OM;
  bullets = [0, 1, 2, 3];
  codePin = [];
  uuid: string;
  digitPadIsActive = true;
  pinHasError: boolean;
  pinError: string;
  errorCode: string;
  transactionId: string;
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
  recurrentOperation: boolean;
  canRetry: boolean; // boolean to permit user to confirm an operation if similar to recent one or caaping reached
  shouldResetPin: boolean;
  cappingFees: number;
  pin: string;
  title: string;
  allNumbers: string[] = [];
  otpValidation: boolean;
  errorOnOtp: string;
  otpHasError: boolean;
  mainPhoneNumber: string = this.dashboardService.getMainPhoneNumber();
  userNotRegisteredInOm: boolean;
  errorBulletActive: boolean;
  gettingPinpad: boolean;
  MATH = Math;
  OM_CAPPING_ERROR = OM_CAPPING_ERROR;
  faceIdAuthCanceled: boolean;

  constructor(
    private orangeMoneyService: OrangeMoneyService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dashboardService: DashboardService,
    public modalController: ModalController,
    private woyofal: WoyofalService,
    private rapido: RapidoService,
    private xeweulService: XeweulService,
    private oemLoggingService: OemLoggingService,
    private appRouting: ApplicationRoutingService,
    private navCtrl: NavController,
    private router: Router,
    private billsService: BillsService,
    private faio: FingerprintAIO,
    private abonnementwido: PassAbonnementWidoService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      codeOTP: ["", [Validators.required]],
    });
    this.getDeviceUuid();
    this.dataToLog = {
      operation: this.operationType,
      phoneNumber: this.omPhoneNumber,
      creditToBuy: this.buyCreditPayload,
      passToBuy: this.buyPassPayload,
      amountToTransfer: this.transferMoneyPayload,
      transfertWithCodeInfos: this.transferMoneyWithCodePayload,
      merchantPaymentInfos: this.merchantPaymentPayload,
    };
    if (this.operationType === OPERATION_CREATE_PIN_OM || this.operationType === OPERATION_RESET_PIN_OM) {
      this.getPinPadForCreationPIN();
    } else {
      this.getOMPhoneNumber();
    }
    this.orangeMoneyService.gotPinPadSubject.subscribe((value) => {
      if (value.length) {
        this.randomDigits = this.orderPinpadArray(value);
        this.orangeMoneyService.randomPinPadDigits = value;
        this.reintializePinpad();
        this.gettingPinpad = false;
      }
    });
  }

  getPinPadForCreationPIN() {
    const pinpadData: any = {
      msisdn: this.payloadCreatePin.msisdn,
      os: "Android",
      app_version: "v1.0",
      app_conf_version: "v1.0",
      service_version: OM_SERVICE_VERSION,
      uuid: this.uuid,
    };
    this.userHasOmToken = true;
    this.checkingToken = false;
    this.gettingPinpad = true;

    this.orangeMoneyService.GetPinPad(pinpadData, this.omInfos).subscribe(
      (response: any) => {
        this.omInfos.sequence = response.content.data.sequence;
        this.omInfos.em = response.content.data.em;
        this.gettingPinpad = false;
      },
      (err: any) => {
        this.gettingPinpad = false;
        this.pinHasError = true;
        this.pinError = "Une erreur est survenue. Veuillez réessayer";
      }
    );
  }

  orderPinpadArray(array: string[]) {
    let index = array.lastIndexOf(" ");
    let value = array[11];
    if (index !== 11) {
      array[11] = " ";
      array[index] = value;
    }
    index = array.indexOf(" ");
    value = array[9];
    if (index !== 9) {
      array[9] = " ";
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
    this.orangeMoneyService
      .getOmMsisdn()
      .pipe(
        catchError((er: HttpErrorResponse) => {
          if (er.status === 401) this.modalController.dismiss();
          return of("error");
        })
      )
      .subscribe(
        (omMsisdn) => {
          if (omMsisdn && omMsisdn !== "error") {
            this.omPhoneNumber = omMsisdn;
            this.checkUserHasOMToken();
          } else {
            this.omPhoneNumber = this.mainPhoneNumber;
            this.allNumbers.push(this.mainPhoneNumber);
            this.dashboardService.getAttachedNumbers().subscribe((res: any) => {
              res.forEach((element) => {
                const msisdn = "" + element.msisdn;
                if (!msisdn.startsWith("33", 0)) {
                  this.allNumbers.push(element.msisdn);
                }
              });
              this.userNotRegisteredInOm = true;
              this.checkingToken = false;
            });
          }
        },
        () => {}
      );
  }

  checkUserHasOMToken() {
    this.orangeMoneyService
      .GetUserAuthInfo(this.omPhoneNumber)
      .pipe(
        catchError((er: HttpErrorResponse) => {
          if (er.status === 401) this.modalController.dismiss();
          return throwError(er);
        })
      )
      .subscribe(async (omUser) => {
        this.pinpadData = {
          msisdn: this.omPhoneNumber,
          os: "Android",
          app_version: "v1.0",
          app_conf_version: "v1.0",
          service_version: OM_SERVICE_VERSION,
        };
        // If user already connected open pinpad
        if (omUser["hasApiKey"]) {
          this.userHasOmToken = true;
          this.checkingToken = false;
          this.gettingPinpad = true;
          this.pinHasError = false;
          this.pinError = null;
          if (
            this.operationType !== OPERATION_CREATE_PIN_OM &&
            this.operationType !== OPERATION_RESET_PIN_OM &&
            this.operationType !== OPERATION_CHANGE_PIN_OM
          ) {
            const faceIdStatus =
              await this.orangeMoneyService.checkFaceIdStatus();
            if (
              faceIdStatus === FACE_ID_PERMISSIONS.ALLOWED &&
              ls.get(FACE_ID_OM_INFOS)
            ) {
              const faceMatched: string = await this.faio
                .show({ disableBackup: true })
                .catch((err) => {
                  console.log("errrror check biometric rejected", err);
                });
              console.log("face Matching", faceMatched);
              const omStoredInfos = ls.get(FACE_ID_OM_INFOS);
              const successRegex = "success";
              if (faceMatched?.toLowerCase().includes(successRegex)) {
                this.processPinOmUser(omStoredInfos.pin, true);
                return;
              }
            }
            ls.remove(FACE_ID_OM_INFOS);
          }

          this.orangeMoneyService.GetPinPad(this.pinpadData, this.omInfos).subscribe(
            (res: any) => {
              this.gettingPinpad = false;
              const omUser1 = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
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
            },
            (err: any) => {
              this.gettingPinpad = false;
              this.pinHasError = true;
              this.pinError = 'Une erreur est survenue. Veuillez réessayer';
            }
          );
        } else {
          this.sendOTPCode();
        }
      });
  }

  sendOTPCode() {
    // TODO use specific error code to handle message => 012
    this.sendingOtp = true;
    this.errorOnOtp = null;
    this.otpHasError = false;
    this.orangeMoneyService.InitOtp(this.omPhoneNumber).subscribe(
      () => {
        this.checkingToken = false;
        this.sendingOtp = false;
        this.userNotRegisteredInOm = false;
        this.otpValidation = true;
        this.resendCode = false;
        this.showResendCodeBtn(30);
      },
      (err) => {
        this.userNotRegisteredInOm = true;
        this.checkingToken = false;
        this.sendingOtp = false;
        this.resendCode = false;
        this.showResendCodeBtn(2);
        if (err && err.error && err.error.errorCode && err.error.errorCode.match('Erreur-046')) {
          this.openModalNoOMAccount();
        } else {
          this.errorOnOtp = "Une erreur est survenue";
        }
      }
    );
  }

  openModalNoOMAccount() {
    this.noOMAccountModal = this.dialog.open(NoOMAccountPopupComponent, {
      disableClose: true,
      data: { pageDesktop: false },
    });
    this.noOMAccountModal.afterClosed().subscribe((res) => {
      this.modalController.dismiss();
      if (res) this.router.navigate(["/om-self-operation/open-om-account"]);
    });
  }

  userRegisterOM() {
    this.registering = true;
    this.otpHasError = false;
    const registerData: OmRegisterClientModel = {
      msisdn: this.omPhoneNumber,
      code_otp: this.form.value.codeOTP,
      uuid: this.omPhoneNumber, // user unique id in selfcare b2c backend
      os: "Android",
      firebase_id: this.omPhoneNumber,
      app_version: "v1.0",
      conf_version: "v1.0",
      service_version: "1.1",
    };
    this.orangeMoneyService.RegisterClient(registerData).subscribe(
      (res: any) => {
        this.registering = false;
        this.otpHasError = false;
        this.pinpadData = {
          msisdn: this.omPhoneNumber,
          os: "Android",
          app_version: "v1.0",
          app_conf_version: "v1.0",
          service_version: OM_SERVICE_VERSION,
        };
        if (!res.status_code.match("Erreur")) {
          this.userHasOmToken = true;
          this.otpValidation = false;
          const omUser: OmUserInfo = {
            solde: 0,
            msisdn: this.omPhoneNumber,
            registerToken: res.content.data.access_token,
            registerRefreshToken: res.content.data.refresh_token,
            loginToken: "string",
            loginRefreshToken: "string",
            apiKey: res.content.data.api_key,
            history: [],
            active: true,
            pinFailed: 0,
            sequence: "",
            em: "",
            lastUpdate: "",
            lastUpdateTime: "",
            showSolde: true,
          };
          this.orangeMoneyService.SaveOrangeMoneyUser(omUser);
          this.gettingPinpad = true;
          this.oemLoggingService.registerEvent('Activation_OM_dashboard_success', convertObjectToLoggingPayload({ omNumber: this.omPhoneNumber }), ANALYTICS_PROVIDER.ALL);
          this.orangeMoneyService.GetPinPad(this.pinpadData).subscribe(
            (response: any) => {
              const omUser1 = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
              omUser1.sequence = response.content.data.sequence;
              omUser1.em = response.content.data.em;
              this.orangeMoneyService.SaveOrangeMoneyUser(omUser1);
              this.gettingPinpad = false;
            },
            (err: any) => {
              this.gettingPinpad = false;
              this.pinHasError = true;
              this.pinError = "Une erreur est survenue. Veuillez réessayer";
            }
          );
        } else {
          this.otpValidation = true;
          this.otpHasError = true;
          this.errorOnOtp = res.status_wording;
          this.oemLoggingService.registerEvent(
            'Activation_OM_dashboard_error',
            convertObjectToLoggingPayload({
              msisdn: this.omPhoneNumber,
              error: this.errorOnOtp,
            })
          );
        }
      },
      (err) => {
        this.otpValidation = true;
        this.registering = false;
        this.otpHasError = true;
        this.errorOnOtp = err && err.error && err.error.message ? err.error.message : 'Une erreur est survenue';
        this.oemLoggingService.registerEvent(
          'Activation_OM_dashboard_error',
          convertObjectToLoggingPayload({
            msisdn: this.omPhoneNumber,
            error: this.errorOnOtp,
          })
        );
      }
    );
  }

  processPinOmUser(pin: string, isFromFaceId?: boolean) {
    this.pinHasError = false;
    this.canRetry = false;
    this.shouldResetPin = false;
    this.errorBulletActive = false;
    this.processingPin = true;
    let canalPromotion;
    if (this.buyPassPayload && this.buyPassPayload.pass && this.buyPassPayload.pass.canalPromotion) {
      canalPromotion = this.buyPassPayload.pass.canalPromotion;
    }
    // make request to server to check the OM pin
    const omUser = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    if (!isFromFaceId) {
      pin = this.orangeMoneyService.GetPin(omUser.sequence.split(""), pin);
    }
    if (this.errorCode !== OM_IDENTIC_TRANSACTION_CODE) {
      this.pin = pin;
    }
    if (omUser.msisdn === this.omPhoneNumber) {
      // the account is active
      if (omUser.active) {
        switch (this.operationType) {
          case OPERATION_TYPE_RECHARGE_CREDIT:
            const creditToBuy = Object.assign({}, this.buyCreditPayload, {
              pin: this.pin,
            });
            this.buyCredit(creditToBuy, isFromFaceId);
            break;
          case OPERATION_TYPE_PASS_INTERNET:
            const dataPassOM = {
              msisdn2: this.buyPassPayload.destinataire,
              pin,
              price_plan_index: this.buyPassPayload.pass.passPromo ? this.buyPassPayload.pass.passPromo.price_plan_index_om : this.buyPassPayload.pass.price_plan_index_om,
              canalPromotion,
              amount: this.buyPassPayload.pass.passPromo ? this.buyPassPayload.pass.passPromo.tarif : this.buyPassPayload.pass.tarif,
            };
            this.buyPass(dataPassOM, isFromFaceId);
            break;
          case OPERATION_TYPE_PASS_VOYAGE:
          case OPERATION_TYPE_PASS_ILLIMIX:
          case OPERATION_TYPE_PASS_ALLO:
          case OPERATION_TYPE_PASS_INTERNATIONAL:
            const dataIllimixOM = {
              msisdn2: this.buyPassPayload.destinataire,
              pin,
              price_plan_index: this.buyPassPayload.pass.passPromo ? this.buyPassPayload.pass.passPromo.price_plan_index_om : this.buyPassPayload.pass.price_plan_index_om,
              canalPromotion,
              amount: this.buyPassPayload.pass.passPromo ? this.buyPassPayload.pass.passPromo.tarif : this.buyPassPayload.pass.tarif,
            };

            this.buyIllimix(dataIllimixOM, isFromFaceId);
            break;
          case OPERATION_ABONNEMENT_WIDO:
            const payloadWido = {
              msisdn2: this.buyPassPayload.destinataire,
              pin: this.orangeMoneyService.decryptOmPin(
                omUser.sequence.split(""),
                pin
              ),
              price_plan_index: this.buyPassPayload.pass.price_plan_index_om,
              amount: this.buyPassPayload.pass.tarif,
              contentId: this.buyPassPayload.pass.contentId,
            };
            this.suscribeWidoByOMoney(payloadWido, isFromFaceId);
            break;
          case OPERATION_TRANSFER_OM:
            const transferMoneyPayload = Object.assign({}, this.transferMoneyPayload, {
              pin: this.pin,
              fees: this.transferMoneyPayload.send_fees,
            });
            this.transferMoney(transferMoneyPayload, isFromFaceId);
            break;
          case OPERATION_TRANSFER_OM_WITH_CODE:
            const transferPayload = Object.assign({}, this.transferMoneyWithCodePayload, { pin });
            this.transferMoneyWithCode(transferPayload, isFromFaceId);
            break;
          case OPERATION_TYPE_INTERNATIONAL_TRANSFER:
            const transferIRTPayload = Object.assign({}, this.transferMoneyPayload, {
              pin: this.pin,
              fees: this.transferMoneyPayload.send_fees,
              country: this.transferMoneyPayload?.country?.callId,
              reason: this.transferMoneyPayload?.reason,
            });
            this.transferMoneyInternational(transferIRTPayload, isFromFaceId);
            break;
          case OPERATION_TYPE_MERCHANT_PAYMENT:
            const merchantPaymentPayload = Object.assign({}, this.merchantPaymentPayload, { pin: this.pin });
            this.payMerchant(merchantPaymentPayload, isFromFaceId);
            break;
          case OPERATION_WOYOFAL:
            this.payWoyofal(pin, isFromFaceId);
            break;
          case OPERATION_RAPIDO:
            this.payRapido(this.pin, isFromFaceId);
            break;
          case OPERATION_XEWEUL:
            this.payXeweul(this.pin, isFromFaceId);
            break;
          case OPERATION_INIT_CHANGE_PIN_OM:
            this.initOperationChangePinOM(pin, isFromFaceId);
            break;
          case OPERATION_CHANGE_PIN_OM:
            this.setNewPinOM(pin);
            break;
          case OPERATION_TYPE_PASS_ILLIFLEX:
            this.buyIlliflex(pin, isFromFaceId);
            break;
          case OPERATION_TYPE_PAY_BILL:
          case OPERATION_TYPE_TERANGA_BILL:
          case OPERATION_TYPE_SENELEC_BILLS:
          case OPERATION_TYPE_SENEAU_BILLS:
            this.payOrangeBills(pin, isFromFaceId);
            break;
          default:
            this.seeSolde(pin, isFromFaceId);
            break;
        }
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
      this.pinError = "";
    }
  }

  processPin(pin: string) {
    if (this.operationType === OPERATION_CHANGE_PIN_OM || this.operationType === OPERATION_CREATE_PIN_OM || this.operationType === OPERATION_RESET_PIN_OM) {
      const { hasError, typeError } = this.isNewPinValid(pin);
      if (hasError) {
        this.resetPad();
        if (typeError === 'BIRTHDATE') {
          this.pinError = DEFAULT_ERROR_MSG_CHANGE_PIN_WITH_BIRTH_DATE_VALIDATION;
          this.pinHasError = true;
        } else if (typeError === "DENIED_PIN") {
          this.pinError = DEFAULT_ERROR_MSG_CHANGE_PIN_VALIDATION;
          this.pinHasError = true;
        }
        return;
      }
    }
    if (this.operationType === OPERATION_CREATE_PIN_OM || this.operationType === OPERATION_RESET_PIN_OM) {
      this.processPinFutureOmUser(pin);
    } else {
      this.processPinOmUser(pin);
    }
  }
  payWoyofal(pin: string, withTouchID?: boolean) {
    this.processingPin = true;
    const db = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    let body = {
      amount: this.opXtras.amount,
      em: db.em,
      fees: this.opXtras.fee,
      msisdn: db.msisdn,
      numero_compteur: this.opXtras.billData.counter.counterNumber,
      pin: pin,
    };
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: db.msisdn,
      receiver: body.numero_compteur,
      montant: body.amount,
      mod_paiement: PAYMENT_MOD_OM,
      withTouchID,
    };

    this.woyofal.pay(body).subscribe(
      (res: any) => {
        this.opXtras.billData.codeRecharge = res.content.data.code_woyofal;
        this.opXtras.billData.kw = res.content.data.valeur_recharge;
        this.processResult(res, db, logInfos, body);
      },
      (err: any) => {
        this.processingPin = false;
        this.processError(err, logInfos);
      }
    );
  }

  payRapido(pin: string, withTouchID?: boolean) {
    this.canRetry = false;
    this.processingPin = true;
    const db = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    let body = {
      amount: this.opXtras.amount,
      em: db.em,
      fees: this.opXtras.fee,
      msisdn: db.msisdn,
      numero_carte: this.opXtras.billData.counter.counterNumber,
      pin: pin,
    };
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: db.msisdn,
      receiver: body.numero_carte,
      montant: body.amount,
      mod_paiement: PAYMENT_MOD_OM,
      withTouchID,
    };

    this.rapido.pay(body).subscribe(
      (res: any) => {
        this.processResult(res, db, logInfos, body);
      },
      (err: any) => {
        this.processingPin = false;
        this.processError(err, logInfos);
      }
    );
  }

  payXeweul(pin: string, withTouchID?: boolean) {
    this.canRetry = false;
    this.processingPin = true;
    const db = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    const body = {
      amount: this.opXtras.amount,
      em: db.em,
      fees: this.opXtras.fee,
      msisdn: db.msisdn,
      numeroCarte: this.opXtras.billData.counter.counterNumber,
      pin,
    };
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: db.msisdn,
      receiver: body.numeroCarte,
      montant: body.amount,
      mod_paiement: PAYMENT_MOD_OM,
      withTouchID,
    };

    this.xeweulService.chargeCard(body).subscribe(
      (res: any) => {
        this.processResult(res, db, logInfos, body);
      },
      (err: any) => {
        this.processingPin = false;
        this.processError(err, logInfos);
      }
    );
  }

  seeSolde(pin: string, withTouchID?: boolean) {
    console.log(this.transactionToBlock);

    this.processingPin = true;
    const db = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    // get balance
    const balancePayload: OmBalanceModel = {
      msisdn: db.msisdn,
      pin,
      em: db.em,
      app_version: "v1.0",
      app_conf_version: "v1.0",
      user_type: "user",
      service_version: OM_SERVICE_VERSION,
      uuid: this.uuid,
    };
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: db.msisdn,
      withTouchID,
    };

    this.orangeMoneyService.GetBalance(balancePayload).subscribe(
      (res: any) => {
        this.processingPin = false;
        // check response status
        if (res.status_code.match("Success")) {
          ls.set(FACE_ID_OM_INFOS, balancePayload);
          // valid pin
          if (this.operationType === OPERATION_BLOCK_TRANSFER) {
            this.blockTransfer();
            return;
          }
          const balance = res.content.data.balance;
          db.pinFailed = 0; // reset the pinfailed
          db.solde = balance;
          const date = new Date();
          const lastDate = `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
          const lastDateTime = `${date.getHours()}h` + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
          db.lastUpdate = lastDate;
          db.lastUpdateTime = lastDateTime;
          this.orangeMoneyService.SaveOrangeMoneyUser(db);
          // this.dashService.balanceAvailableSubject.next(db.solde);
          this.modalController.dismiss({
            success: true,
            balance: balance,
            omUserInfos: { ...db, pin },
          });
          this.orangeMoneyService.logWithFollowAnalytics(res, 'event', this.operationType, logInfos, this.opXtras);
        } else {
          // this.goToDashboard();
          this.orangeMoneyService.logWithFollowAnalytics(res, 'error', this.operationType, this.dataToLog, this.opXtras);
        }
      },
      (err) => {
        this.processError(err, logInfos);
      }
    );
  }

  buyCredit(params: { msisdn2: string; pin: any; amount: number }, withTouchID?: boolean) {
    this.processingPin = true;
    const db = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    // get balance
    const buyCreditPayload: OmBuyCreditModel = {
      msisdn: db.msisdn,
      msisdn2: params.msisdn2,
      pin: params.pin,
      amount: params.amount,
      em: db.em,
      app_version: "v1.0",
      app_conf_version: "v1.0",
      user_type: "user",
      service_version: OM_SERVICE_VERSION,
      uuid: this.uuid,
    };
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: db.msisdn,
      receiver: params.msisdn2,
      montant: params.amount,
      mod_paiement: PAYMENT_MOD_OM,
      withTouchID,
    };
    const txnIdForConfirmation = { txnId: this.transactionId };
    this.orangeMoneyService.AchatCredit(buyCreditPayload, txnIdForConfirmation).subscribe(
      (res: any) => {
        this.processResult(res, db, logInfos, buyCreditPayload);
      },
      err => {
        this.processError(err, logInfos);
      }
    );
  }

  buyPass(params: BuyPassPayload, withTouchID?: boolean) {
    this.processingPin = true;
    const db = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    // get balance
    const buyPassPayload: OmBuyPassModel = {
      msisdn: db.msisdn,
      msisdn2: params.msisdn2,
      pin: params.pin,
      price_plan_index: params.price_plan_index,
      em: db.em,
      app_version: "v1.0",
      app_conf_version: "v1.0",
      user_type: "user",
      service_version: OM_SERVICE_VERSION,
      amount: params.amount,
      uuid: this.uuid,
    };
    if (params.canalPromotion) {
      buyPassPayload.canal = params.canalPromotion;
    }
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: db.msisdn,
      receiver: params.msisdn2,
      montant: params.amount,
      mod_paiement: PAYMENT_MOD_OM,
      ppi: params.price_plan_index,
      withTouchID,
    };

    this.orangeMoneyService.AchatPassInternet(buyPassPayload).subscribe(
      (res: any) => {
        this.processResult(res, db, logInfos, buyPassPayload);
      },
      (err) => {
        console.log(err, err.error);

        this.processError(err, logInfos);
      }
    );
  }

  suscribeWidoByOMoney(params: BuyPassPayload, withTouchID?: boolean) {
    this.processingPin = true;
    const db = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    // get balance
    const buyPassPayload: OmBuyIllimixModel = {
      msisdn: db.msisdn,
      msisdn2: params.msisdn2,
      pin: params.pin,
      price_plan_index: params.price_plan_index,
      em: db.em,
      app_version: "v1.0",
      app_conf_version: "v1.0",
      user_type: "user",
      service_version: OM_SERVICE_VERSION,
      amount: params.amount,
      uuid: this.uuid,
      contentId: params?.contentId,
    };
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: db.msisdn,
      receiver: params.msisdn2,
      montant: params.amount,
      mod_paiement: PAYMENT_MOD_OM,
      ppi: params.price_plan_index,
      withTouchID,
    };

    this.abonnementwido
      .suscribeToWidoByOMoney({ msisdn: buyPassPayload.msisdn2, packId: +buyPassPayload.price_plan_index, contentId: +buyPassPayload?.contentId, omPin: buyPassPayload.pin })
      .subscribe(
        (res: any) => {
          this.processResult(res, db, logInfos, buyPassPayload);
        },
        err => {
          this.processError(err, logInfos);
        }
      );
  }
  buyIllimix(params: BuyPassPayload, withTouchID?: boolean) {
    this.processingPin = true;
    const db = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    // get balance
    const buyPassPayload: OmBuyIllimixModel = {
      msisdn: db.msisdn,
      msisdn2: params.msisdn2,
      pin: params.pin,
      price_plan_index: params.price_plan_index,
      em: db.em,
      app_version: "v1.0",
      app_conf_version: "v1.0",
      user_type: "user",
      service_version: OM_SERVICE_VERSION,
      amount: params.amount,
      uuid: this.uuid,
    };
    if (params.canalPromotion) {
      buyPassPayload.canal = params.canalPromotion;
    }
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: db.msisdn,
      receiver: params.msisdn2,
      montant: params.amount,
      mod_paiement: PAYMENT_MOD_OM,
      ppi: params.price_plan_index,
      withTouchID,
    };

    this.orangeMoneyService.AchatIllimix(buyPassPayload).subscribe(
      (res: any) => {
        this.processResult(res, db, logInfos, buyPassPayload);
      },
      (err) => {
        this.processError(err, logInfos);
      }
    );
  }

  buyIlliflex(pin, withTouchID?: boolean) {
    this.processingPin = true;
    const db = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    this.illiflexPayload.sender = this.omPhoneNumber;
    this.illiflexPayload.em = db.em;
    this.illiflexPayload.pin = pin;
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: db.msisdn,
      receiver: this.illiflexPayload.recipient,
      montant: this.illiflexPayload.amount,
      mod_paiement: PAYMENT_MOD_OM,
      withTouchID,
    };

    this.orangeMoneyService.buyIlliflexByOM(this.illiflexPayload).subscribe(
      (res: any) => {
        this.processResult(res, db, logInfos, this.illiflexPayload);
      },
      (err) => {
        this.processError(err, logInfos);
      }
    );
  }

  payOrangeBills(pin, withTouchID?: boolean) {
    const db = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: db.msisdn,
      montant: this.opXtras.invoice?.montantFacture,
      mod_paiement: PAYMENT_MOD_OM,
      withTouchID,
    };
    const payload: BillPaymentModel = {
      billingAccountId: this.opXtras?.invoice?.numeroTelephone,
      payementAmount: this.opXtras.invoice?.montantFacture,
      billNumber: this.opXtras?.invoice?.nfact,
      payerEm: db.em,
      payerEncodedPin: pin,
      payerMsisdn: db.msisdn,
      paymentCategory: this.orangeMoneyService.getPaymentCategoryByPurchaseType(this.opXtras.purchaseType),
    };
    this.billsService.payBill(payload).subscribe(
      (res: any) => {
        this.processResult(res, db, logInfos, payload);
      },
      (err) => {
        this.processError(err, logInfos);
      }
    );
  }

  transferMoney(
    params: {
      msisdn2: string;
      pin: any;
      amount: number;
      send_fees: number;
      cashout_fees: number;
      a_ma_charge: boolean;
      fees: number;
      capping?: boolean;
    },
    withTouchID?: boolean
  ) {
    this.processingPin = true;
    this.canRetry = false;
    this.pinHasError = false;
    this.errorBulletActive = false;
    this.transactionToBlock = {
      amount: -params.amount,
      msisdnReceiver: params.msisdn2,
      operationDate: new Date().toString(),
    };
    const omUser = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    const transferOMPayload: TransferOrangeMoneyModel = {
      msisdn_sender: omUser.msisdn,
      msisdn_receiver: params.msisdn2,
      amount: params.amount,
      send_fees: params.send_fees,
      cashout_fees: params.cashout_fees,
      fees: params.fees,
      a_ma_charge: !!params.a_ma_charge,
      uuid: "uuid",
      os: "mobile",
      pin: params.pin,
      em: omUser.em,
      app_version: "v1.0",
      app_conf_version: "v1.0",
      user_type: "user",
      service_version: OM_SERVICE_VERSION,
      capping: params.capping,
      viaQr: this.opXtras?.viaQr,
    };
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: omUser.msisdn,
      receiver: params.msisdn2,
      montant: params.amount,
      withTouchID,
    };

    this.orangeMoneyService.transferOM(transferOMPayload, { txnId: this.transactionId }).subscribe(
      (res: any) => {
        this.processResult(res, omUser, logInfos, transferOMPayload);
      },
      err => {
        this.processError(err, logInfos);
      }
    );
  }

  transferMoneyWithCode(
    params: {
      msisdn2: string;
      pin: any;
      amount: number;
      nom_receiver: string;
      prenom_receiver: string;
    },
    withTouchID
  ) {
    this.processingPin = true;
    const omUser = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    const transferOMPayload: TransferOMWithCodeModel = {
      msisdn: omUser.msisdn,
      msisdn2: params.msisdn2,
      amount: params.amount,
      uuid: "uuid",
      os: "mobile",
      pin: params.pin,
      em: omUser.em,
      app_version: "v1.0",
      app_conf_version: "v1.0",
      user_type: "user",
      service_version: OM_SERVICE_VERSION,
      nom_receiver: params.nom_receiver,
      prenom_receiver: params.prenom_receiver,
    };
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: omUser.msisdn,
      receiver: params.msisdn2,
      montant: params.amount,
      withTouchID,
    };

    this.orangeMoneyService.transferOMWithCode(transferOMPayload).subscribe(
      (res: any) => {
        this.processResult(res, omUser, logInfos, transferOMPayload);
      },
      (err) => {
        this.processError(err, logInfos);
      }
    );
  }

  transferMoneyInternational(
    params: {
      msisdn2: string;
      pin: any;
      amount: number;
      send_fees: number;
      fees: number;
      country;
      reason?: string;
    },
    withTouchID?: boolean
  ) {
    this.processingPin = true;
    this.canRetry = false;
    this.pinHasError = false;
    this.errorBulletActive = false;
    // this.transactionToBlock = {
    //   amount: -params.amount,
    //   msisdnReceiver: params.msisdn2,
    //   operationDate: new Date().toString(),
    // };
    const omUser = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    const transferOMPayload: TransferIRTModel = {
      msisdn: omUser.msisdn,
      msisdn2: params.msisdn2,
      amount: params.amount,
      fees: params.send_fees,
      uuid: "uuid",
      os: "mobile",
      pin: params.pin,
      em: omUser.em,
      app_version: "v1.0",
      app_conf_version: "v1.0",
      user_type: "user",
      service_version: OM_SERVICE_VERSION,
      country: formatCountryCallId(params?.country),
      reason: "Achat de bien et service",
    };
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: omUser.msisdn,
      receiver: params.msisdn2,
      montant: params.amount,
      withTouchID,
    };

    this.orangeMoneyService.transferIRT(transferOMPayload, { txnId: this.transactionId }).subscribe(
      (res: any) => {
        this.processResult(res, omUser, logInfos, transferOMPayload);
      },
      err => {
        this.processError(err, logInfos);
      }
    );
  }

  initOperationChangePinOM(pin: string, withTouchID?: boolean) {
    this.seeSolde(pin);
  }

  setNewPinOM(pin: string) {
    this.modalController.dismiss({
      pin: pin,
      success: true,
    });
  }

  processPinFutureOmUser(pin: string) {
    console.log("infos", {
      omInfos: this.omInfos,
      pin: pin,
      success: true,
    });

    const formatedPin = this.orangeMoneyService.GetPin(this.omInfos.sequence.split(''), pin);
    this.modalController.dismiss({
      omInfos: this.omInfos,
      pin: formatedPin,
      success: true,
    });
  }

  payMerchant(
    params: {
      amount: number;
      code_marchand: number;
      nom_marchand: string;
      pin: string;
    },
    withTouchID?: boolean
  ) {
    this.processingPin = true;
    const omUser = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
    const payMerchantPayload: MerchantPaymentModel = {
      msisdn: omUser.msisdn,
      code_marchand: params.code_marchand.toString(),
      amount: params.amount,
      pin: params.pin,
      nom_marchand: params.nom_marchand,
      em: omUser.em,
      uuid: this.uuid,
    };
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: omUser.msisdn,
      receiver: params.code_marchand,
      montant: params.amount,
      mod_paiement: PAYMENT_MOD_OM,
      withTouchID,
    };
    this.orangeMoneyService.payMerchantOM(payMerchantPayload, { txnId: this.transactionId }).subscribe(
      (res: any) => {
        this.processResult(res, omUser, logInfos, payMerchantPayload);
      },
      err => {
        this.processError(err, logInfos);
      }
    );
  }

  getUserOMStatus() {
    return this.orangeMoneyService.getUserStatus(this.omPhoneNumber).pipe(
      map((status: OMCustomerStatusModel) => {
        if (status.operation === 'FULL' || (status.operation === 'DEPLAFONNEMENT' && status.operationStatus === CustomerOperationStatus.completed)) {
          return true;
        }
        return false;
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }

  blockTransfer() {
    this.processingPin = true;
    let cancelTrxResponse: any;
    this.orangeMoneyService
      .blockTransfer(this.opXtras?.blockTrxOMPayload)
      .pipe(
        switchMap(response => {
          cancelTrxResponse = response;
          return this.getUserOMStatus();
        }),
        tap((res) => {
          this.processingPin = false;
          this.modalController.dismiss({
            success: true,
            hasOMStatusFull: res,
            annulationResponse: cancelTrxResponse,
          });
        }),
        catchError((err) => {
          this.processingPin = false;
          this.pinHasError = true;
          this.resetPad();
          console.log(err.transactionNumber, err.message);
          this.pinError = err && err.error && err.error.transactionNumber && err.error.message ? err.error.message : 'Une erreur est survenue';
          return throwError(err);
        })
      )
      .subscribe();
  }

  retry() {
    switch (this.errorCode) {
      case OM_CAPPING_ERROR:
        const transferMoneyPayload = Object.assign({}, this.transferMoneyPayload, {
          pin: this.pin,
          fees: this.cappingFees,
          capping: true,
        });
        this.transferMoney(transferMoneyPayload);
        break;
      case OM_IDENTIC_TRANSACTION_CODE:
        this.processPin(this.pin);
        break;
      default:
        break;
    }
  }

  processResult(res: any, db: any, logInfos: FollowOemlogPurchaseInfos, operationPayload?: any) {
    // check response status
    this.processingPin = false;
    if ((res && res.status_code !== null && res.status_code.match('Success')) || (res && res.content.data.status_code === '200')) {
      // valid pin
      db.pinFailed = 0; // reset the pinfailed
      this.orangeMoneyService.SaveOrangeMoneyUser(db);
      this.orangeMoneyService.logWithFollowAnalytics(res, 'event', this.operationType, logInfos, this.opXtras);
      this.opXtras.sending_fees = this.cappingFees ? this.cappingFees : this.opXtras.sending_fees;
      const totalFees = this.transferMoneyPayload && this.transferMoneyPayload.a_ma_charge ? this.transferMoneyPayload.cashout_fees : 0;
      this.transactionToBlock = Object.assign({}, this.transactionToBlock, {
        txnid: res?.content?.data?.txn_id,
        fees: totalFees,
      });
      ls.set(FACE_ID_OM_INFOS, operationPayload);
      this.modalController.dismiss({
        success: true,
        opXtras: this.opXtras,
        cappingFee: this.cappingFees,
        transferToBlock: this.transactionToBlock,
        operationPayload,
      });
    } else if (res === null || res.status_code === null || !res.status_code.match('Success')) {
      this.pinError = "Une erreur s'est produite. Veuillez ressayer ultérieurement";
      this.pinHasError = true;
      this.recurrentOperation = true;
      this.orangeMoneyService.logWithFollowAnalytics({ status_code: 200 }, 'error', this.operationType, logInfos, this.opXtras);
    }
  }

  processError(err: any, logInfos: FollowOemlogPurchaseInfos) {
    this.processingPin = false;
    this.pinHasError = true;
    this.reintializePinpad();
    this.orangeMoneyService.logWithFollowAnalytics(err, 'error', this.operationType, logInfos, this.opXtras);
    // erreur métiers
    if (err && err?.error && +err?.error?.status === 400) {
      this.errorCode = err.error.errorCode;
      if (err.error.errorCode.match("Erreur-045")) {
        this.recurrentOperation = true;
        if (this.operationAllowIdenticalConfirmation()) {
          this.pinError = err.error.message;
          this.transactionId = err.error.txnId;
          this.canRetry = true;
        } else {
          this.pinError = 'Vous avez effectué la même transaction il y a quelques instants.';
        }
      } else if (err.error.errorCode.match("Erreur-014")) {
        this.shouldResetPin = true;
        this.recurrentOperation = true;
        this.pinError = err.error.message;
      } else if (err.error.errorCode.match('Erreur-019') || err.error.errorCode.match('Erreur-602') || err.error.errorCode.match('Erreur-55')) {
        this.pinError = err.error.message;
        this.recurrentOperation = true;
      } else if (err.error.errorCode.match(OM_CAPPING_ERROR)) {
        this.recurrentOperation = true;
        this.pinError = err.error.message;
        this.canRetry = true;
        this.cappingFees = +err.error.fees;
      } else if (err.error.errorCode.match(ERROR_CODE_INVALID_XEWEUL_CARD)) {
        this.pinError = MSG_XEWEUL_CARD_INVALID;
      } else if (err.error.errorCode.match(ERROR_CODE_INVALID_AMOUNT_TO_RECHARGE_XEWEUL_CARD)) {
        this.pinError = MSG_XEWEUL_CARD_INVALID_AMOUNT_TO_RECHARGE;
      } else if (err.error.errorCode.match('Erreur-017')) {
        const omUser = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
        omUser.active = false;
        this.pinError = `Code secret est invalide. Vous venez de bloquer votre compte Orange Money. Veuillez passer dans une de nos agences pour le reactiver!`;
        this.orangeMoneyService.SaveOrangeMoneyUser(omUser);
        this.pinHasError = true;
        this.errorBulletActive = true;
      } else if (
        err.error.errorCode.match('Erreur-015') ||
        err.error.errorCode.match('Erreur-016') ||
        (!!err.error.errorCode.match('2408') && !!err.error.message.match('Code secret errone'))
      ) {
        const omUser = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
        omUser.pinFailed++;
        this.resetPad();
        if (omUser.pinFailed >= 5) {
          omUser.active = false;
          this.pinError = `Code secret est invalide. Vous venez de bloquer votre compte Orange Money. Veuillez passer dans une de nos agences pour le reactiver!`;
        } else {
          this.pinError = `Code secret est invalide. Il vous reste ${5 - ~~omUser.pinFailed} tentatives!`;
        }
        this.orangeMoneyService.SaveOrangeMoneyUser(omUser);
        this.pinHasError = true;
        this.errorBulletActive = true;
      } else {
        this.pinError = err.error.message;
      }
    } else {
      this.pinError = err && err?.error && err?.error?.message ? err.error.message : "Une erreur s'est produite. Veuillez ressayer ultérieurement";
      this.pinHasError = true;
      this.recurrentOperation = true;
    }
  }

  operationAllowIdenticalConfirmation() {
    return this.operationType === OPERATION_TYPE_RECHARGE_CREDIT || this.operationType === OPERATION_TRANSFER_OM;
  }

  saveEm() {
    this.gettingPinpad = true;
    this.orangeMoneyService.GetPinPad(this.pinpadData).subscribe((res: any) => {
      const omUser = this.orangeMoneyService.GetOrangeMoneyUser(this.omPhoneNumber);
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
      if (this.codePin.length < 4 && digit !== " ") {
        this.codePin.push(digit);
        if (this.codePin.length === 4) {
          const pin = this.codePin.join("");
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

  getDeviceUuid() {
    let deviceInfo = window["device"];
    if (deviceInfo) this.uuid = deviceInfo.uuid;
  }

  isNewPinValid(pin: string) {
    let result: {
      hasError: boolean;
      typeError: "BIRTHDATE" | "DENIED_PIN" | null;
    } = { hasError: false, typeError: null };

    const isDeniedPin = !!LIST_DENIED_PIN_OM.filter((invalidPin: string) => invalidPin === pin).length;
    if (pin === this.omInfos.birthYear) {
      result.hasError = true;
      result.typeError = "BIRTHDATE";
      return result;
    } else if (isDeniedPin) {
      result.hasError = true;
      result.typeError = "DENIED_PIN";
    }
    return result;
  }

  redirectToPage() {
    switch (this.errorCode) {
      case BLOCKED_PASS:
        this.appRouting.goToParainnagePage(this.opXtras?.recipientMsisdn);
        this.modalController.dismiss();
        break;
      default:
        break;
    }
  }

  goBack() {
    this.modalController.dismiss();
    this.navCtrl.pop();
  }

  goResetPwd() {
    this.modalController.dismiss();
    this.router.navigate(["/om-self-operation/open-om-account"], {
      state: { shouldResetPin: true },
    });
  }
}
