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
import { tap, switchMap, map, catchError, delay } from 'rxjs/operators';
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
  ILLIFLEX_BY_OM_IDENTICAL_ERROR_CODE,
  ILLIFLEX_BY_OM_UNKOWN_ERROR_CODE,
  OM_IDENTIC_TRANSACTION_CODE,
  OM_UNKOWN_ERROR_CODE,
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
import { OPERATION_RAPIDO } from 'src/app/utils/operations.constants';
import { IlliflexModel } from 'src/app/models/illiflex-pass.model';
import { IlliflexService } from '../illiflex-service/illiflex.service';
import { CancelOmTransactionPayloadModel } from 'src/app/models/cancel-om-transaction-payload.model';
import { FollowAnalyticsEventType } from '../follow-analytics/follow-analytics-event-type.enum';
import { OperationExtras } from 'src/app/models/operation-extras.model';

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
const ls = new SecureLS({ encodingType: 'aes' });
let eventKey = '';
let errorKey = '';
let value = {};
let isIOS = false;
@Injectable({
  providedIn: 'root',
})
export class OrangeMoneyService {
  constructor(
    private http: HttpClient,
    private followAnalyticsService: FollowAnalyticsService,
    private dashboardService: DashboardService,
    private illiflexService: IlliflexService
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
      apiKey: string;
      em: string;
      loginToken: string;
      msisdn: string;
      sequence: string;
    }
  ) {
    isIOS = REGEX_IOS_SYSTEM.test(navigator.userAgent);
    const os = isIOS ? 'iOS' : 'Android';
    if (pinPadData) pinPadData.os = os;
    if (changePinInfos) {
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

  AchatCredit(achatCreditData: OmBuyCreditModel) {
    return this.http.post(achatCreditEndpoint, achatCreditData);
  }
  AchatPassInternet(achatPassData: OmBuyPassModel) {
    return this.http.post(achatPassEndpoint, achatPassData);
  }

  AchatIllimix(achatIllimixData: OmBuyIllimixModel) {
    return this.http.post(achatIllimixEndpoint, achatIllimixData);
  }

  transferOM(transferOMData: TransferOrangeMoneyModel) {
    isIOS = REGEX_IOS_SYSTEM.test(navigator.userAgent);
    const uuid = ls.get('X-UUID');
    const os = isIOS ? 'iOS' : 'Android';
    transferOMData.uuid = uuid;
    transferOMData.os = os;
    return this.http.post(transferOMEndpoint, transferOMData);
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

  payMerchantOM(merchantPaymentData: MerchantPaymentModel) {
    return this.http.post(merchantPaymentEndpoint, merchantPaymentData);
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
          type_pass = 'illiflex';
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
        break;
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
    return this.http
      .get<OMCustomerStatusModel>(`${userStatusEndpoint}/${msisdn}`)
      .pipe(
        map((status) => {
          status.omNumber = msisdn;
          return status;
        }),
        catchError((err: any) => {
          return of(null);
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
        this.dashboardService.getAttachedNumbers().subscribe(
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
            status === 400 && errorCode !== ILLIFLEX_BY_OM_UNKOWN_ERROR_CODE
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
}
