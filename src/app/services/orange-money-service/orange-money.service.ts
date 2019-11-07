import { Injectable } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DashboardService } from '../dashboard-service/dashboard.service';
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
  LogModel,
  TransferOMWithCodeModel
} from '.';

declare var FollowAnalytics: any;

const VIRTUAL_ACCOUNT_PREFIX = 'om_';
const { OM_URL, OM_SERVICE, SERVER_API_URL } = environment;
const otpEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/register/init-otp`;
const registerClientEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/register/register-client`;
const loginClientEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/authentication/login-client`;
const UserAccessInfoEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/authentication/user-access-infos`;
const pinpadEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/authentication/get-pin-pad`;
const checkOMAccountEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/authentication/check-client`;
const getFeesEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api`;
// const getBalanceEndpoint = `${OM_URL}/api/v1/balance`;

// api/purchases/balance
const getBalanceEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/purchases/balance`;
const achatCreditEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/purchases/buy-credit`;
const achatIllimixEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/purchases/buy-illimix`;
const achatPassEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/purchases/buy-pass`;
const transferOMEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/transfers/transfer-p2p`;
const transferOMWithCodeEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/transfers/transfer-avec-code`;
const omFeesEndpoint = `${SERVER_API_URL}/${OM_SERVICE}/api/fees/transfer-without-code`;
const omFeesEndpoint2 = `${SERVER_API_URL}/${OM_SERVICE}/api/fees/transfer-with-code`;
const ls = new SecureLS({ encodingType: 'aes' });

const getListPassEndpoint = `${OM_URL}/api/v1/get-list-pass`;
const getListIllimixEndpoint = `${OM_URL}/api/v1/get-list-illimix`;
// const achatIllimixEndpoint = `${OM_URL}/api/v1/buy-illimix`;
// const achatPassEndpoint = `${OM_URL}/api/v1/buy-pass`;
// const achatCreditEndpoint = `${OM_URL}/api/v1/buy-credit`;
const logEndpoint = `${SERVER_API_URL}/management/selfcare-logs-file`;
let eventKey = '';
let errorKey = '';
let value = {};

@Injectable({
  providedIn: 'root'
})
export class OrangeMoneyService {
  constructor(
    private http: HttpClient,
    private dashbordServ: DashboardService
  ) {}
  pinPadDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b'];
  gotPinPadSubject = new BehaviorSubject<string[]>([]);
  loginResponseSubject = new BehaviorSubject<any>({});
  balanceVisibilitySubject = new Subject<any>();
  randomPinPadDigits = [];
  // get main phone number ls.get('mainPhoneNumber');
  handleOrangeMoneyResponse(res: any, db: any) {}
  pay(phoneNumber: any, pin: string, amont: number) {
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
          amountWithDrawn: amont
        };
        db.solde = soldeAfterPay;
        db.history = [...db.history, operationDetails];
        this.updateAccount(phoneNumber, db);
        return { data: operationDetails, error: false, errorMsg: null };
      }
    }
  }

  checkUserHasAccount(msisdn) {
    const currentNumber = this.dashbordServ.getCurrentPhoneNumber();
    return this.http.get(`${checkOMAccountEndpoint}/${msisdn}`).pipe(
      tap((res: any) => {
        this.LogAction(currentNumber, 'Verification beneficiaire', msisdn, '');
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
    this.LogAction(msisdn, 'debut Envoie OTP OM', 'info', '');
    return this.http.get(`${otpEndpoint}/${msisdn}`).pipe(
      tap((res: any) => {
        this.LogAction(msisdn, 'fin Envoie OTP OM', 'info', '');
      })
    );
  }

  getOMFeeWithoutCode() {
    return this.http.get(omFeesEndpoint);
  }

  getOMFeeWithCode() {
    return this.http.get(omFeesEndpoint2);
  }

  GetUserAuthInfo(msisdn) {
    this.LogAction(msisdn, 'debut demande auth info OM', 'info', '');
    return this.http.get(`${UserAccessInfoEndpoint}/${msisdn}`).pipe(
      tap((res: any) => {
        this.LogAction(msisdn, 'fin demande auth info OM', 'info', '');
      })
    );
  }

  RegisterClient(registerClientData: OmRegisterClientModel) {
    this.LogAction(
      registerClientData.msisdn,
      'debut Register API OM\n',
      'info',
      JSON.stringify(registerClientData)
    );
    return this.http.post(registerClientEndpoint, registerClientData).pipe(
      tap((res: any) => {
        this.LogAction(
          registerClientData.msisdn,
          'fin Register API OM',
          'info',
          JSON.stringify(res)
        );
      })
    );
  }

  GetPinPad(pinPadData: OmPinPadModel) {
    this.LogAction(
      pinPadData.msisdn,
      'debut Demande pinpad OM \n',
      'info',
      JSON.stringify(pinPadData)
    );
    return this.http.post(pinpadEndpoint, pinPadData).pipe(
      tap((res: any) => {
        const sequence = res.content.data.sequence.replace(
          new RegExp('-', 'g'),
          ' '
        );
        this.gotPinPadSubject.next(sequence.split(''));
        this.LogAction(
          pinPadData.msisdn,
          'fin Demande pinpad OM',
          'info',
          JSON.stringify(res)
        );
      })
    );
  }

  LoginClient(loginClientData: OmLoginClientModel) {
    const logData = {
      app_conf_version: loginClientData.app_conf_version,
      app_version: loginClientData.app_version,
      em: loginClientData.em,
      pin: 'removed',
      msisdn: loginClientData.msisdn,
      user_type: loginClientData.user_type
    };
    this.LogAction(
      loginClientData.msisdn,
      'debut login endpoint\n',
      'info',
      JSON.stringify(logData)
    );

    return this.http.post(loginClientEndpoint, loginClientData).pipe(
      tap((res: any) => {
        this.LogAction(
          loginClientData.msisdn,
          'fin login endpoint',
          'info',
          JSON.stringify(res)
        );
      })
    );
  }

  GetBalance(getBalanceData: OmBalanceModel) {
    const logData = {
      app_conf_version: getBalanceData.app_conf_version,
      app_version: getBalanceData.app_version,
      em: getBalanceData.em,
      pin: 'removed',
      msisdn: getBalanceData.msisdn,
      user_type: getBalanceData.user_type
    };
    this.LogAction(
      getBalanceData.msisdn,
      'debut Voir Solde OM',
      'info',
      JSON.stringify(logData)
    );

    return this.http.post(getBalanceEndpoint, getBalanceData).pipe(
      tap((res: any) => {
        this.LogAction(
          getBalanceData.msisdn,
          'fin Voir Solde OM',
          'info',
          JSON.stringify(res)
        );
      })
    );
  }

  AchatCredit(achatCreditData: OmBuyCreditModel) {
    const logData = {
      app_conf_version: achatCreditData.app_conf_version,
      app_version: achatCreditData.app_version,
      em: achatCreditData.em,
      pin: 'removed',
      msisdn: achatCreditData.msisdn,
      msisdn2: achatCreditData.msisdn2,
      amount: achatCreditData.amount,
      user_type: achatCreditData.user_type
    };
    this.LogAction(
      achatCreditData.msisdn,
      'debut achat de credit par OM',
      'info',
      JSON.stringify(logData)
    );

    return this.http.post(achatCreditEndpoint, achatCreditData).pipe(
      tap((res: any) => {
        this.LogAction(
          achatCreditData.msisdn,
          'fin achat de credit par OM',
          'info',
          JSON.stringify(res)
        );
      })
    );
  }
  AchatPassInternet(achatPassData: OmBuyPassModel) {
    const logData = {
      app_conf_version: achatPassData.app_conf_version,
      app_version: achatPassData.app_version,
      em: achatPassData.em,
      pin: 'removed',
      msisdn: achatPassData.msisdn,
      msisdn2: achatPassData.msisdn2,
      price_plan_index: achatPassData.price_plan_index,
      user_type: achatPassData.user_type
    };
    this.LogAction(
      achatPassData.msisdn,
      'debut achat de pass internet par OM',
      'info',
      JSON.stringify(logData)
    );

    return this.http.post(achatPassEndpoint, achatPassData).pipe(
      tap((res: any) => {
        this.LogAction(
          achatPassData.msisdn,
          'fin achat de pass internet par OM',
          'info',
          JSON.stringify(res)
        );
      })
    );
  }

  AchatIllimix(achatIllimixData: OmBuyIllimixModel) {
    const logData = {
      app_conf_version: achatIllimixData.app_conf_version,
      app_version: achatIllimixData.app_version,
      em: achatIllimixData.em,
      pin: 'removed',
      msisdn: achatIllimixData.msisdn,
      msisdn2: achatIllimixData.msisdn2,
      price_plan_index: achatIllimixData.price_plan_index,
      user_type: achatIllimixData.user_type
    };
    this.LogAction(
      achatIllimixData.msisdn,
      'debut achat illimix endpoint par OM',
      'info',
      JSON.stringify(logData)
    );

    return this.http.post(achatIllimixEndpoint, achatIllimixData).pipe(
      tap((res: any) => {
        this.LogAction(
          achatIllimixEndpoint,
          'fin achat illimix endpoint par OM',
          'info',
          JSON.stringify(res)
        );
      })
    );
  }

  transferOM(transferOMData: TransferOrangeMoneyModel) {
    const logData = {
      app_conf_version: transferOMData.app_conf_version,
      app_version: transferOMData.app_version,
      em: transferOMData.em,
      pin: 'removed',
      msisdn: transferOMData.msisdn_sender,
      msisdn2: transferOMData.msisdn_receiver,
      user_type: transferOMData.user_type
    };
    this.LogAction(
      transferOMData.msisdn_sender,
      'debut transfert OM endpoint',
      'info',
      JSON.stringify(logData)
    );

    return this.http.post(transferOMEndpoint, transferOMData).pipe(
      tap((res: any) => {
        this.LogAction(
          transferOMEndpoint,
          'fin transfert OM endpoint',
          'info',
          JSON.stringify(res)
        );
      })
    );
  }

  transferOMWithCode(transferOMData: TransferOMWithCodeModel) {
    const logData = {
      app_conf_version: transferOMData.app_conf_version,
      app_version: transferOMData.app_version,
      em: transferOMData.em,
      pin: 'removed',
      msisdn: transferOMData.msisdn,
      msisdn2: transferOMData.msisdn2,
      user_type: transferOMData.user_type,
      nom: transferOMData.nom,
      prenom: transferOMData.prenom
    };
    this.LogAction(
      transferOMData.msisdn,
      'debut transfert avec code OM endpoint',
      'info',
      JSON.stringify(logData)
    );

    return this.http.post(transferOMWithCodeEndpoint, transferOMData).pipe(
      tap((res: any) => {
        this.LogAction(
          transferOMWithCodeEndpoint,
          'fin transfert avec code OM endpoint',
          'info',
          JSON.stringify(res)
        );
      })
    );
  }

  getTransferFees() {
    return this.http.get(getFeesEndpoint);
  }

  LogAction(msisdn: string, content: string, typeLog: string, params: string) {
    const logModel: LogModel = {
      userId: msisdn,
      message: content,
      type: typeLog,
      contexte: 'OrangeMoney',
      params,
      dateLog: new Date().toISOString()
    };
    return this.http.post(logEndpoint, logModel).subscribe();
  }

  GetListIllimix(omAccount: OmUserInfo) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + omAccount.loginToken,
      OrangeMoney: 'true',
      APIKey: omAccount.apiKey
    });
    const options = { headers };
    return this.http.get(
      `${getListIllimixEndpoint}/${omAccount.msisdn}`,
      options
    );
  }

  GetListPassInternet(omAccount: OmUserInfo) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + omAccount.loginToken,
      OrangeMoney: 'true',
      APIKey: omAccount.apiKey
    });
    const options = { headers };
    return this.http.get(`${getListPassEndpoint}/${omAccount.msisdn}`, options);
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
  logWithFollowAnalytics(res: any, type: string, dataToLog: any) {
    const operation = dataToLog.operation;
    const phoneNumber = dataToLog.phoneNumber;
    const creditToBuy = dataToLog.creditToBuy;
    const transferPayload = dataToLog.amountToTransfer;
    const passToBuy = dataToLog.passToBuy;
    switch (operation) {
      case undefined:
        value = res.status_code;
        eventKey = 'Voir_solde_OM_dashboard_success';
        errorKey = 'Voir_solde_OM_dashboard_error';
        break;
      case 'CHECK_SOLDE':
        value = res.status_code;
        eventKey = 'Recharge_Voir_Solde_OM_Success';
        errorKey = 'Recharge_Voir_Solde_OM_Error';
        break;

      case 'BUY_CREDIT':
        eventKey = 'Recharge_OM_Success';
        errorKey = 'Recharge_OM_Error';
        value = Object.assign({}, creditToBuy, { msisdn: phoneNumber });
        break;
      case 'PASS_INTERNET':
        errorKey = 'OM_Buy_Pass_Internet_Error';
        eventKey = 'OM_Buy_Pass_Internet_Success';
        value = {
          option_name: passToBuy.pass.nom,
          amount: passToBuy.pass.tarif,
          plan: passToBuy.pass.price_plan_index
        };
        break;
      case 'PASS_ILLIMIX':
        errorKey = 'OM_Buy_Pass_Illimix_Error';
        eventKey = 'OM_Buy_Pass_Illimix_Success';
        value = {
          option_name: passToBuy.pass.nom,
          amount: passToBuy.pass.tarif,
          plan: passToBuy.pass.price_plan_index
        };
        break;
      case 'TRANSFER_MONEY':
        errorKey = 'OM_Transfer_Money_Error';
        eventKey = 'OM_Transfer_Money_Success';
        value = Object.assign({}, transferPayload, { msisdn: phoneNumber });
        break;
      default:
        break;
    }
    if (type === 'event') {
      if (typeof FollowAnalytics !== 'undefined') {
      FollowAnalytics.logEvent(eventKey, value);
      }
    } else {
      value = { error_code: res.status_code };
      if (typeof FollowAnalytics !== 'undefined') {
      FollowAnalytics.logError(errorKey, value);
      }
    }
  }
}
