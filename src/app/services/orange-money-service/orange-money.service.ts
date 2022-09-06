import { Injectable } from '@angular/core';
import * as SecureLS from 'secure-ls';
import {
  BehaviorSubject,
  Subject,
  of,
  Observable,
  forkJoin,
  throwError,
} from 'rxjs';
import { tap, switchMap, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  OmUserInfo,
  OmRegisterClientModel,
  OmPinPadModel,
  OmLoginClientModel,
  OmBalanceModel,
  OmBuyCreditModel,
  OmBuyPassModel,
  OmBuyIllimixModel,
  TransferOrangeMoneyModel,
  TransferOMWithCodeModel,
  MerchantPaymentModel,
  FeeModel,
  CheckEligibilityModel,
  TransferIRTModel,
  InitC2WPayload,
  InitC2WResponseModel,
  GetBalanceWPPayloadModel,
  getOMTransactionsInputModel,
  OMTransactionsResponseModel,
} from '.';
import { FollowAnalyticsService } from '../follow-analytics/follow-analytics.service';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { ErreurTransactionOmModel } from 'src/app/models/erreur-transaction-om.model';
import {
  OM_BUY_ILLIFLEX_ENDPOINT,
  SEND_REQUEST_ERREUR_TRANSACTION_OM_ENDPOINT,
} from '../utils/om.endpoints';
import { ChangePinOm } from 'src/app/models/change-pin-om.model';
import { OM_CHANGE_PIN_ENDPOINT } from '../utils/om.endpoints';
import { OMCustomerStatusModel } from 'src/app/models/om-customer-status.model';
import {
  checkOtpResponseModel,
  OmCheckOtpModel,
  OmInitOtpModel,
} from 'src/app/models/om-self-operation-otp.model';
import {
  checkStorageElementHasExpired,
  ILLIFLEX_BY_OM_IDENTICAL_ERROR_CODE,
  ILLIFLEX_BY_OM_UNKOWN_ERROR_CODE,
  OM_IDENTIC_TRANSACTION_CODE,
  OM_UNKOWN_ERROR_CODE,
  OPERATION_ABONNEMENT_WIDO,
  OPERATION_PAY_ORANGE_BILLS,
  OPERATION_RESET_PIN_OM,
  OPERATION_TRANSFER_OM,
  OPERATION_TRANSFER_OM_WITH_CODE,
  OPERATION_TYPE_BONS_PLANS,
  OPERATION_TYPE_MERCHANT_PAYMENT,
  OPERATION_TYPE_PASS_ALLO,
  OPERATION_TYPE_PASS_ILLIFLEX,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_VOYAGE,
  OPERATION_TYPE_RECHARGE_CREDIT,
  REGEX_IOS_SYSTEM,
} from 'src/shared';
import { FollowOemlogPurchaseInfos } from 'src/app/models/follow-log-oem-purchase-Infos.model';
import {
  OPERATION_RAPIDO,
  OPERATION_TYPE_INTERNATIONAL_TRANSFER,
  OPERATION_TYPE_PAY_BILL,
  OPERATION_TYPE_SENEAU_BILLS,
  OPERATION_TYPE_SENELEC_BILLS,
  OPERATION_TYPE_TERANGA_BILL,
	OPERATION_XEWEUL,
} from 'src/app/utils/operations.constants';
import { IlliflexModel } from 'src/app/models/illiflex-pass.model';
import { IlliflexService } from '../illiflex-service/illiflex.service';
import { CancelOmTransactionPayloadModel } from 'src/app/models/cancel-om-transaction-payload.model';
import { FollowAnalyticsEventType } from '../follow-analytics/follow-analytics-event-type.enum';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { CreatePinOM } from 'src/app/models/create-pin-om.model';
import { ValidateChallengeOMOEM } from 'src/app/models/challenge-answers-om-oem.model';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { PAYMENT_BILLS_CATEGORY } from 'src/app/models/bill-payment.model';
import { LocalStorageService } from '../localStorage-service/local-storage.service';

const VIRTUAL_ACCOUNT_PREFIX = 'om_';
const { OM_SERVICE, SERVER_API_URL, SERVICES_SERVICE } = environment;
const otpEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/register/init-otp`;
const registerClientEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/register/register-client`;
const loginClientEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/authentication/login-client`;
const UserAccessInfoEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/authentication/user-access-infos`;
const pinpadEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/authentication/get-pin-pad`;
const checkOMAccountEndpoint2 = `${SERVER_API_URL}/${OM_SERVICE}/api/authentication/v2/check-client`;
const getFeesEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/fees`;
// const getBalanceEndpoint = `${OM_URL}/api/v1/balance`;

// api/purchases/balance
const getBalanceEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/purchases/balance`;
const achatCreditEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/purchases/buy-credit`;
const achatIllimixEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/purchases/buy-illimix`;
const achatPassEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/purchases/buy-pass`;
const transferOMEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/transfers/v2/transfer-p2p`;
const IRTEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/transfers/v1/transfert-irt`;
const transferOMWithCodeEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/transfers/transfer-avec-code`;
const merchantPaymentEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/merchant/payment`;
const getMerchantEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/merchant/naming`;
const omFeesEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/fees/transfer-without-code`;
const omFeesEndpoint2 = `${SERVER_API_URL}/${OM_SERVICE}/api/fees/transfer-with-code`;
const checkBalanceSufficiencyEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/purchases/check-balance`;
const checkTxnBlockEligibilityEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/transfers/is-eligible-for-blocking`;
const BlockTransferEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/transfers/cancel-transaction`;
const userStatusEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/register/customer-status`;
const selfOperationInitOtpEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/register/customer-otp-init`;
const selfOperationCheckOtpEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/register/customer-otp-check`;
const CANCEL_TRANSACTIONS_OM_Endpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/urgence-depannage/v2/erreur-transaction`;
// CREATION PIN OM
const CREATE_PIN_OM_Endpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/authentication/create-pin`;

// CHALLENGE RESET/REACTIVE OM ACCOUNT
const CHALLENGE_OM_ACCOUNT = `${SERVER_API_URL}/${OM_SERVICE}/api/unlock/v1`;
const VALIDATE_CHALLENGE_OM_ACCOUNT = `${SERVER_API_URL}/${OM_SERVICE}/api/unlock/v1/challenge`;

// ekalpay endpoints
const GET_CARD_TO_WALLET_BANK_URL = `${SERVER_API_URL}/${OM_SERVICE}/api/ekalpay/v1/card-to-wallet/init`;
const GET_BALANCE_URL = `${SERVER_API_URL}/${OM_SERVICE}/api/ekalpay/v1/account`;
const GET_OM_TRANSACTIONS_URL = `${SERVER_API_URL}/${OM_SERVICE}/api/payment/transactions`;

// ekalpay endpoints
const get_card_marchand_endpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/check-card`;

const OM_STATUS_KEY = 'USER_OM_STATUS';

const ls = new SecureLS({ encodingType: 'aes' });
let eventKey = '';
let errorKey = '';
let value = {};
let isIOS = false;
@Injectable({
  providedIn: 'root',
})
export class OrangeMoneyService {
  biometricStatusSubject: Subject<any> = new Subject<any>();
  constructor(
    private http: HttpClient,
    private followAnalyticsService: FollowAnalyticsService,
    private dashboardService: DashboardService,
    private illiflexService: IlliflexService,
    private faio: FingerprintAIO,
    private localStorageService: LocalStorageService
  ) {}
  pinPadDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b'];
  gotPinPadSubject = new BehaviorSubject<string[]>([]);
  loginResponseSubject = new BehaviorSubject<any>({});
  balanceVisibilitySubject = new Subject<any>();
  randomPinPadDigits = [];
  // get main phone number ls.get('mainPhoneNumber');

  pay(phoneNumber: any, amont: number) {
    const db = this.getAccountInfos(phoneNumber);
    // invalid pin or account locked
    if (!db.active) {
      const errorMsg = `Votre compte Orange Money actuel bloqué.`;
      return { data: null, error: true, errorMsg };
    } else {
      const soldeAfterPay = db.solde - +amont;
      if (soldeAfterPay < 0) {
        const errorMsg = `Votre solde Orange Money actuel ne vous permet pas d'effectuer cette opération.`;
        return { data: null, error: true, errorMsg };
      } else {
        const operationDetails = {
          newSolde: soldeAfterPay,
          soldeBefore: db.solde,
          amountWithDrawn: amont,
        };
        db.solde = soldeAfterPay;
        db.history = [...db.history, operationDetails];
        this.updateAccount(phoneNumber, db);
        return { data: operationDetails, error: false, errorMsg: null };
      }
    }
  }

  checkUserHasAccount(msisdn: string): Observable<boolean> {
    return this.http.get(`${checkOMAccountEndpoint2}/${msisdn}`).pipe(
      map(
        (hasOmAccount: boolean) => {
          if (hasOmAccount === null) return true;
          return hasOmAccount;
        },
        () => {
          return true;
        }
      )
    );
  }

  checkUserHasAccountV2(msisdn: string): Observable<boolean> {
    return this.http.get(`${checkOMAccountEndpoint2}/${msisdn}`).pipe(
      map((hasOmAccount: boolean) => {
        return hasOmAccount;
      })
    );
  }

  updateAccount(phoneNumber: any, accountInfos: OmUserInfo) {
    const accountId = this.getAccountId(phoneNumber);
    ls.set(accountId, accountInfos);
  }

  private getAccountInfos(phoneNumber: any): OmUserInfo {
    const accountId = this.getAccountId(phoneNumber);
    try {
      return ls.get(accountId);
    } catch (error) {
      return null;
    }
  }

  private getAccountId(phoneNumber: any) {
    return `${VIRTUAL_ACCOUNT_PREFIX}${phoneNumber}`;
  }

  getOrangeMoneyNumber() {
    return ls.get('nOrMo');
  }

  InitOtp(msisdn) {
    return this.http.get(`${otpEndpoint}/${msisdn}`);
  }

  getOMFeeWithoutCode() {
    return this.http.get(omFeesEndpoint);
  }

  getOMFeeWithCode() {
    return this.http.get(omFeesEndpoint2);
  }

  GetUserAuthInfo(msisdn) {
    return this.http.get(`${UserAccessInfoEndpoint}/${msisdn}`);
  }

  RegisterClient(registerClientData: OmRegisterClientModel) {
    isIOS = REGEX_IOS_SYSTEM.test(navigator.userAgent);
    const uuid = ls.get('X-UUID');
    const os = isIOS ? 'iOS' : 'Android';
    registerClientData.uuid = uuid;
    registerClientData.os = os;
    return this.http.post(registerClientEndpoint, registerClientData);
  }

  GetPinPad(
    pinPadData: OmPinPadModel,
    changePinInfos?: {
      apiKey?: string;
      em: string;
      loginToken?: string;
      msisdn: string;
      sequence: string;
    }
  ) {
    isIOS = REGEX_IOS_SYSTEM.test(navigator.userAgent);
    const os = isIOS ? 'iOS' : 'Android';
    if (pinPadData) pinPadData.os = os;
    if (changePinInfos?.sequence && changePinInfos?.em) {
      const sequence = changePinInfos.sequence.replace(
        new RegExp('-', 'g'),
        ' '
      );
      this.gotPinPadSubject.next(sequence.split(''));
      return of({
        content: {
          data: { sequence: changePinInfos.sequence, em: changePinInfos.em },
        },
      });
    }
    return this.http.post(pinpadEndpoint, pinPadData).pipe(
      tap((res: any) => {
        const sequence = res.content.data.sequence.replace(
          new RegExp('-', 'g'),
          ' '
        );
        this.gotPinPadSubject.next(sequence.split(''));
      })
    );
  }

  LoginClient(loginClientData: OmLoginClientModel) {
    return this.http.post(loginClientEndpoint, loginClientData);
  }

  GetBalance(getBalanceData: OmBalanceModel) {
    return this.http.post(getBalanceEndpoint, getBalanceData);
  }

  checkMarchandLiteCarteInfos(idCard: string) {
    return this.http.get(`${get_card_marchand_endpoint}/${idCard}`);
  }

  AchatCredit(achatCreditData: OmBuyCreditModel, confirmPayload?) {
    const queryParams = confirmPayload?.txnId
      ? `?txnId=${confirmPayload?.txnId}`
      : '';
    return this.http.post(
      `${achatCreditEndpoint}${queryParams}`,
      achatCreditData
    );
  }
  AchatPassInternet(achatPassData: OmBuyPassModel) {
    return this.http.post(achatPassEndpoint, achatPassData);
  }

  AchatIllimix(achatIllimixData: OmBuyIllimixModel) {
    return this.http.post(achatIllimixEndpoint, achatIllimixData);
  }

  transferOM(transferOMData: TransferOrangeMoneyModel, confirmPayload?) {
    isIOS = REGEX_IOS_SYSTEM.test(navigator.userAgent);
    const uuid = ls.get('X-UUID');
    const os = isIOS ? 'iOS' : 'Android';
    transferOMData.uuid = uuid;
    transferOMData.os = os;
    const queryParams = confirmPayload?.txnId
      ? `?txnId=${confirmPayload?.txnId}`
      : '';
    return this.http.post(
      `${transferOMEndpoint}${queryParams}`,
      transferOMData
    );
  }

  transferIRT(transferOMData: TransferIRTModel, confirmPayload?) {
    isIOS = REGEX_IOS_SYSTEM.test(navigator.userAgent);
    const uuid = ls.get('X-UUID');
    const os = isIOS ? 'iOS' : 'Android';
    transferOMData.uuid = uuid;
    transferOMData.os = os;
    const queryParams = confirmPayload?.txnId
      ? `?txnId=${confirmPayload?.txnId}`
      : '';
    return this.http.post(`${IRTEndpoint}${queryParams}`, transferOMData);
  }

  transferOMWithCode(transferOMData: TransferOMWithCodeModel) {
    isIOS = REGEX_IOS_SYSTEM.test(navigator.userAgent);
    const uuid = ls.get('X-UUID');
    const os = isIOS ? 'iOS' : 'Android';
    transferOMData.uuid = uuid;
    transferOMData.os = os;
    return this.http.post(transferOMWithCodeEndpoint, transferOMData);
  }

  getMerchantByCode(code: number) {
    return this.getOmMsisdn().pipe(
      switchMap((msisdn) => {
        return this.http.get(`${getMerchantEndpoint}/${code}?msisdn=${msisdn}`);
      })
    );
  }

  payMerchantOM(merchantPaymentData: MerchantPaymentModel, confirmPayload?) {
    const queryParams = confirmPayload?.txnId
      ? `?txnId=${confirmPayload?.txnId}`
      : '';
    return this.http.post(
      `${merchantPaymentEndpoint}${queryParams}`,
      merchantPaymentData
    );
  }

  getTransferFees(): Observable<FeeModel[]> {
    return this.http.get(getFeesEndpoint).pipe(
      map((fees: FeeModel[]) => {
        return fees;
      })
    );
  }

  GetPin(pinPadResponse: any[], pin) {
    const pinPad = pinPadResponse;
    pin = pin.split('');
    pin[0] = this.pinPadDigits[pinPad.indexOf(pin[0])];
    pin[1] = this.pinPadDigits[pinPad.indexOf(pin[1])];
    pin[2] = this.pinPadDigits[pinPad.indexOf(pin[2])];
    pin[3] = this.pinPadDigits[pinPad.indexOf(pin[3])];
    return pin.join('');
  }

	decryptOmPin(pinPadResponse: any[], encryptedPin) {
    encryptedPin = encryptedPin.split("");
		encryptedPin[0] = pinPadResponse[this.pinPadDigits.indexOf(encryptedPin[0])];
		encryptedPin[1] = pinPadResponse[this.pinPadDigits.indexOf(encryptedPin[1])];
		encryptedPin[2] = pinPadResponse[this.pinPadDigits.indexOf(encryptedPin[2])];
		encryptedPin[3] = pinPadResponse[this.pinPadDigits.indexOf(encryptedPin[3])];
		return encryptedPin.join("");
	}

  GetOrangeMoneyUser(msisdn: string): OmUserInfo {
    const accountId = this.getAccountId(msisdn);
    const storedData = ls.get(accountId);
    return storedData === '' ? {} : storedData;
  }

  SaveOrangeMoneyUser(userInfo: OmUserInfo) {
    const accountId = this.getAccountId(userInfo.msisdn);
    ls.set(accountId, userInfo);
  }

  showBalance(showsolde: boolean) {
    // ls.set('showSolde', showsolde);
    const phoneNumber = ls.get('nOrMo');
    const omUser = this.GetOrangeMoneyUser(phoneNumber);
    if (omUser) {
      omUser.showSolde = showsolde;
      this.SaveOrangeMoneyUser(omUser);
      this.balanceVisibilitySubject.next(showsolde);
    }
  }

  balanceVisibilityEMitted() {
    return this.balanceVisibilitySubject.asObservable();
  }

  getEventKey() {
    return eventKey;
  }
  getLogValue() {
    return value;
  }
  // Log Event and errors with Follow Analytics for Orange Money
  // type can be 'error' or 'event'
  logWithFollowAnalytics(
    res: any,
    type: string,
    operationType: string,
    dataToLog: FollowOemlogPurchaseInfos,
    opXtras: OperationExtras
  ) {
    switch (operationType) {
      case undefined:
        value = res.status_code;
        eventKey = 'Voir_solde_OM_dashboard_success';
        errorKey = 'Voir_solde_OM_dashboard_error';
        break;
      case OPERATION_TYPE_RECHARGE_CREDIT:
        eventKey = `Achat_credit_${
          opXtras.fromPage === OPERATION_TYPE_BONS_PLANS ? 'bons_plans' : ''
        }_success`;
        errorKey = `Achat_credit_${
          opXtras.fromPage === OPERATION_TYPE_BONS_PLANS ? 'bons_plans' : ''
        }_failed`;
        value = dataToLog;
        break;
      case OPERATION_TYPE_PASS_VOYAGE:
      case OPERATION_TYPE_PASS_ILLIMIX:
      case OPERATION_TYPE_PASS_ALLO:
      case OPERATION_TYPE_PASS_INTERNET:
      case OPERATION_TYPE_PASS_ILLIFLEX:
      case OPERATION_ABONNEMENT_WIDO:
        let type_pass;
        if (operationType === OPERATION_TYPE_PASS_ALLO) {
          type_pass = 'allo';
        } else if (operationType === OPERATION_TYPE_PASS_ILLIMIX) {
          type_pass = 'illimix';
        } else if (operationType === OPERATION_TYPE_PASS_VOYAGE) {
          type_pass = 'voyage';
        } else if (operationType === OPERATION_TYPE_PASS_INTERNET) {
          type_pass = 'internet';
        } else if (operationType === OPERATION_TYPE_PASS_ILLIFLEX) {
          type_pass = "illiflex";
        } else if (operationType === OPERATION_ABONNEMENT_WIDO) {
          type_pass = "abonnement_wido";
        }
        errorKey = `Achat_Pass_${type_pass}_${
          opXtras.fromPage === OPERATION_TYPE_BONS_PLANS ? 'bons_plans' : ''
        }_Error`;
        eventKey = `Achat_Pass_${type_pass}_${
          opXtras.fromPage === OPERATION_TYPE_BONS_PLANS ? 'bons_plans' : ''
        }_Success`;
        value = dataToLog;
        break;
      case OPERATION_TRANSFER_OM:
        errorKey = 'OM_Transfer_sans_code_Error';
        eventKey = 'OM_Transfer_sans_code_Success';
        value = dataToLog;
        break;
      case OPERATION_TRANSFER_OM_WITH_CODE:
        errorKey = 'OM_Transfer_avec_code_Error';
        eventKey = 'OM_Transfer_avec_code_Success';
        value = dataToLog;
        break;
      case OPERATION_TYPE_MERCHANT_PAYMENT:
        errorKey = 'OM_Paiement_Marchand_Error';
        eventKey = 'OM_Paiement_Marchand_Success';
        value = dataToLog;
      case OPERATION_RAPIDO:
        errorKey = 'Recharge_Rapido_Error';
        eventKey = 'Recharge_Rapido_Success';
        value = dataToLog;
      case OPERATION_XEWEUL:
        errorKey = 'Recharge_Xeweul_Error';
        eventKey = 'Recharge_Xeweul_Success';
        value = dataToLog;
        break;
      case OPERATION_PAY_ORANGE_BILLS:
        errorKey = 'Payment_Fixe_bills_Error';
        eventKey = 'Payment_Fixe_bills_Success';
        value = dataToLog;
        break;
      case OPERATION_TYPE_INTERNATIONAL_TRANSFER:
        errorKey = 'Irt_Error';
        eventKey = 'Irt_Success';
        value = dataToLog;
      default:
        break;
    }
    if (type === 'event') {
      this.followAnalyticsService.registerEventFollow(eventKey, 'event', value);
    } else {
      value = Object.assign({}, value, { error_code: res.status_code });
      this.followAnalyticsService.registerEventFollow(errorKey, 'error', value);
    }
  }

  checkBalanceSufficiency(amount: number | string) {
    // return of(true).pipe(delay(2000));
    return this.getOmMsisdn().pipe(
      switchMap((msisdn) => {
        return this.http.get(
          `${checkBalanceSufficiencyEndpoint}/${msisdn}?amount=${amount}`
        );
      })
    );
  }

  getUserStatus(msisdn: string) {
    const key = `${OM_STATUS_KEY}_${msisdn}`;
    const hasExpired = checkStorageElementHasExpired(key, 60 * 60 * 1000);
    if (!hasExpired) {
      const storedData = this.localStorageService.getFromLocalStorage(key);
      return of(storedData)
    }
    return this.http
      .get<OMCustomerStatusModel>(`${userStatusEndpoint}/${msisdn}`)
      .pipe(
        map((status) => {
          status.omNumber = msisdn;
          this.localStorageService.saveToLocalStorage(key, status);
          this.localStorageService.saveToLocalStorage(`${key}_last_update`, Date.now())
          return status;
        })
      );
  }

  initSelfOperationOtp(initOtpPayload: OmInitOtpModel) {
    console.log(
      'url',
      selfOperationCheckOtpEndpoint,
      'payload',
      initOtpPayload
    );

    return this.http.post<checkOtpResponseModel>(
      selfOperationInitOtpEndpoint,
      initOtpPayload
    );
  }

  checkSelfOperationOtp(
    checkOtpPayload: OmCheckOtpModel,
    otpCode: string | number
  ) {
    console.log('checkOTP', checkOtpPayload, otpCode);

    return this.http.post<checkOtpResponseModel>(
      `${selfOperationCheckOtpEndpoint}?otp=${otpCode}`,
      checkOtpPayload
    );
  }

  getOmMsisdn(): Observable<string> {
    const omNumberOnLS = ls.get('nOrMo');
    if (omNumberOnLS) {
      return of(omNumberOnLS);
    } else {
      let OrangeMoneyMsisdn: string;
      const allNumbers = [];
      const mainPhoneNumber = this.dashboardService.getMainPhoneNumber();
      allNumbers.push(mainPhoneNumber);
      return new Observable((obs) => {
        this.dashboardService
          .attachedNumbers()
          .pipe(
            catchError((err: any) => {
              return of([]);
            })
          )
          .subscribe(
            (resp: any) => {
              resp.forEach((element) => {
                const msisdn = '' + element.msisdn;
                // Avoid fix numbers
                if (!msisdn.startsWith('33', 0)) {
                  allNumbers.push(element.msisdn);
                }
              });
              // request orange money info for every number
              const httpCalls = [];
              allNumbers.forEach((number) => {
                httpCalls.push(this.GetUserAuthInfo(number));
              });
              forkJoin(httpCalls).subscribe(
                (data) => {
                  let numberOMFound = false;
                  for (const [index, element] of data.entries()) {
                    // if the number is linked with OM, keep it and break out of the for loop
                    if (element['hasApiKey'] && element['hasApiKey'] != null) {
                      // set the orange Money number in localstorage and the key is nOrMo (numero Orange Money)
                      OrangeMoneyMsisdn = allNumbers[index];
                      ls.set('nOrMo', OrangeMoneyMsisdn);
                      numberOMFound = true;
                      obs.next(OrangeMoneyMsisdn);
                      break;
                    }
                  }
                  if (!numberOMFound) {
                    obs.next('error');
                  }
                },
                (err) => {
                  obs.next('error');
                  console.error(err);
                }
              );
            },
            () => {
              obs.next('error');
            }
          );
      });
    }
  }

  checkMerchantCode(code: number) {
    return this.http.get(`/${code}`);
  }

  getPaymentCategoryByPurchaseType(purchase: string) {
    switch (purchase) {
      case OPERATION_TYPE_PAY_BILL:
        return PAYMENT_BILLS_CATEGORY.FIXE;
      case OPERATION_TYPE_TERANGA_BILL:
        return PAYMENT_BILLS_CATEGORY.MOBILE;
      case OPERATION_TYPE_SENELEC_BILLS:
        return PAYMENT_BILLS_CATEGORY.SENELEC;
      case OPERATION_TYPE_SENEAU_BILLS:
        return PAYMENT_BILLS_CATEGORY.SENEAU;
    }
  }

  omAccountSession() {
    return this.getOmMsisdn().pipe(
      switchMap((msisdn) => {
        if (msisdn === 'error') return of({ msisdn: msisdn });
        return this.GetUserAuthInfo(msisdn).pipe(
          map((infos: any) => {
            return { msisdn: msisdn, ...infos };
          })
        );
      })
    );
  }

  sendRequestErreurTransactionOM(data: ErreurTransactionOmModel) {
    return this.http.post(
      `${SEND_REQUEST_ERREUR_TRANSACTION_OM_ENDPOINT}`,
      data
    );
  }

  changePin(data: ChangePinOm) {
    return this.http.post(`${OM_CHANGE_PIN_ENDPOINT}`, data);
  }

  buyIlliflexByOM(passIlliflex: IlliflexModel) {
    const validity = this.illiflexService.getValidityName(
      passIlliflex.validity
    );
    const buyIlliflexPayload = {
      buyer: {
        msisdn: passIlliflex.sender,
        em: passIlliflex.em,
        encodedPin: passIlliflex.pin,
      },
      buyee: {
        msisdn: passIlliflex.recipient,
        profile: passIlliflex.recipientOfferCode,
      },
      bucket: {
        budget: {
          unit: 'XOF',
          value: +passIlliflex.amount,
        },
        dataBucket: {
          balance: {
            amount: passIlliflex.data * 1024,
            unit: 'KO',
          },
          validity,
          usageType: 'DATA',
        },
        voiceBucket: {
          balance: {
            amount: passIlliflex.voice * 60,
            unit: 'SECOND',
          },
          validity,
          usageType: 'VOICE',
        },
        smsBucket: {
          balance: {
            amount: passIlliflex.bonusSms,
            unit: 'SMS',
          },
          validity,
          usageType: 'SMS',
        },
      },
    };
    return this.http
      .post(`${OM_BUY_ILLIFLEX_ENDPOINT}`, buyIlliflexPayload)
      .pipe(
        map((res) => {
          const mappedOmResponse = {
            content: {
              data: {
                status_code: '200',
              },
            },
            status_code: 'Success-001',
          };
          return mappedOmResponse;
        }),
        catchError((err) => {
          const status = err.error.statusCode;
          const errorCode =
            err.error.errorCode === ILLIFLEX_BY_OM_IDENTICAL_ERROR_CODE
              ? OM_IDENTIC_TRANSACTION_CODE
              : err.error.errorCode === ILLIFLEX_BY_OM_UNKOWN_ERROR_CODE
              ? OM_UNKOWN_ERROR_CODE
              : err.error.errorCode;
          const message =
            status === 400 && errorCode !== OM_UNKOWN_ERROR_CODE
              ? err.error.message
              : 'Une erreur est survenue';
          const error = new HttpErrorResponse({
            error: { errorCode, status, message },
            status,
          });
          return throwError(error);
        })
      );
  }

  isTxnEligibleToBlock(transactionId: string) {
    return this.getOmMsisdn().pipe(
      switchMap((msisdn) => {
        return this.http
          .get<CheckEligibilityModel>(
            `${checkTxnBlockEligibilityEndpoint}/${msisdn}/${transactionId}`
          )
          .pipe(
            tap((res) => {
              res.eligible
                ? this.followAnalyticsService.registerEventFollow(
                    'check_txn_eligibility_true',
                    FollowAnalyticsEventType.EVENT
                  )
                : this.followAnalyticsService.registerEventFollow(
                    'check_txn_eligibility_false',
                    FollowAnalyticsEventType.EVENT,
                    {}
                  );
            }),
            catchError((err) => {
              this.followAnalyticsService.registerEventFollow(
                'check_txn_eligibility_error',
                FollowAnalyticsEventType.ERROR,
                { error: err }
              );
              return throwError(err);
            })
          );
      })
    );
  }

  blockTransfer(transaction) {
    return this.getOmMsisdn().pipe(
      switchMap((msisdn) => {
        const { amount, txnid, msisdnReceiver, fees } = transaction;
        const payload = {
          amount: Math.abs(amount) + fees,
          txn_id: txnid,
          destinataire: msisdnReceiver,
          msisdn,
        };
        return this.http
          .post<{ message: string; transactionNumber: string }>(
            BlockTransferEndpoint,
            payload
          )
          .pipe(
            tap((res) => {
              this.followAnalyticsService.registerEventFollow(
                'block_transaction_success',
                FollowAnalyticsEventType.EVENT,
                { msisdn, transaction: payload }
              );
            }),
            catchError((error) => {
              this.followAnalyticsService.registerEventFollow(
                'block_transaction_error',
                FollowAnalyticsEventType.ERROR,
                {
                  msisdn,
                  transaction: payload,
                  error,
                }
              );
              return throwError(error);
            })
          );
      })
    );
  }

  sendInfosCancelationTransfertOM(
    formInfos: CancelOmTransactionPayloadModel,
    fileRecto: any,
    fileVerso: any
  ) {
    const payload = new FormData();
    const erreurTransactionOmDTO = new Blob([JSON.stringify(formInfos)], {
      type: 'application/json',
    });
    payload.append('erreurTransactionOmDTO', erreurTransactionOmDTO);
    payload.append('recto', fileRecto, 'recto.png');
    payload.append('verso', fileVerso, 'verso.png');
    return this.http.post(`${CANCEL_TRANSACTIONS_OM_Endpoint}`, payload);
  }

  createFirstOmPin(payload: CreatePinOM, apiKey?: string) {
    const os = REGEX_IOS_SYSTEM.test(navigator.userAgent) ? 'iOS' : 'Android';
    const data = {
      os: os,
      channel: 'selfcare',
      app_version: 'v1.0',
      conf_version: 'v1.0',
      service_version: 'v1.0',
      type: 'CLIENT',
      is_primo: true,
    };
    const omData: CreatePinOM = Object.assign({}, payload, data);

    return this.http.post(`${CREATE_PIN_OM_Endpoint}?apiKey=${apiKey}`, omData);
  }

  fetchOMChallengeForUnlockAndReset(omMsisdn: string) {
    return this.http.get(`${CHALLENGE_OM_ACCOUNT}/${omMsisdn}/eligible`);
  }

  getOMBalanceWithoutPin(payload: GetBalanceWPPayloadModel) {
    let queryParams = '';
    for (let key in payload) {
      queryParams += `${key}=${payload[key]}&`;
    }
    return this.http.get(`${GET_BALANCE_URL}?${queryParams}`);
  }

  initCardToWallet(
    initC2WPayload: InitC2WPayload
  ): Observable<InitC2WResponseModel> {
    //const mock = {
    //  statusCode: 'INITIALIZED',
    //  paymentUrl:
    //    'https://paypage.sandbox.orabank.ngenius-payments.com/?code=5f58b0e1e502b35a%22',
    //  paymentCancelUrl:
    //    'https://api-gateway.sandbox.orabank.ngenius-payments.com/transactions/outlets/c2a32aef-8cbc-4a2e-be9b-f1e74054ff0b/orders/327dbdd2-85df-42c2-949c-50feca63fe92/cancel',
    //};
    //return of(mock);
    return this.http.post<InitC2WResponseModel>(
      `${GET_CARD_TO_WALLET_BANK_URL}`,
      initC2WPayload
    );
  }

  validateOMChallengeForUnlockAndResetOMAccount(
    omMsisdn: string,
    type: string,
    payload: ValidateChallengeOMOEM
  ) {
    return this.http.post(
      `${VALIDATE_CHALLENGE_OM_ACCOUNT}/${omMsisdn}/${
        type === OPERATION_RESET_PIN_OM ? 'resetpin' : 'unblock'
      }`,
      payload
    );
  }

  getOMLastTransactions(payload?: getOMTransactionsInputModel) {
    return this.getOmMsisdn().pipe(
      switchMap(msisdn => {
        return this.http.get<OMTransactionsResponseModel[]>(
          `${GET_OM_TRANSACTIONS_URL}/${msisdn}?page=${payload.page}&pageSize=${payload.pageSize}`
        );
      })
    )
  }

  faceIdStatusChanged(): Observable<FACE_ID_PERMISSIONS> {
    return this.biometricStatusSubject.asObservable();
  }

  allowFaceId() {
    ls.set(FACE_ID_STORAGE_KEY, FACE_ID_PERMISSIONS.ALLOWED);
    this.biometricStatusSubject.next(FACE_ID_PERMISSIONS.ALLOWED);
  }

  askFaceIdLater() {
    ls.set(FACE_ID_STORAGE_KEY, FACE_ID_PERMISSIONS.LATER);
    this.biometricStatusSubject.next(FACE_ID_PERMISSIONS.LATER);
  }

  denyFaceId() {
    ls.set(FACE_ID_STORAGE_KEY, FACE_ID_PERMISSIONS.NEVER);
    this.biometricStatusSubject.next(FACE_ID_PERMISSIONS.NEVER);
  }

  getFaceIdState() {
    return ls.get(FACE_ID_STORAGE_KEY);
  }

  async checkFaceIdStatus() {
    const biometricAvailability = await this.faio.isAvailable().catch((err) => {
      return of(null).toPromise();
    });
    console.log('check biometric availability', biometricAvailability);
    const status = this.getFaceIdState();
    return biometricAvailability
      ? of(status).toPromise()
      : of(FACE_ID_PERMISSIONS.NEVER);
  }
}

export const enum FACE_ID_PERMISSIONS {
  ALLOWED = 'ALLOWED',
  NEVER = 'NEVER',
  LATER = 'LATER',
}

export const FACE_ID_STORAGE_KEY = 'FACE_ID_PERMISSION'
export const FACE_ID_OM_INFOS = 'FACE_ID_INFOS'

export enum OM_FEES_CALCUL_MODE {
  PERCENT = 'pourcent',
  FIXE = 'fixe',
}