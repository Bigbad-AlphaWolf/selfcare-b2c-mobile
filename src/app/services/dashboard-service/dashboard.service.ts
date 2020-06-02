import { Injectable, Renderer2, Inject, RendererFactory2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Subject,
  Observable,
  interval,
  throwError,
  Subscription,
  of,
} from 'rxjs';
import {
  tap,
  delay,
  map,
  shareReplay,
  retryWhen,
  flatMap,
} from 'rxjs/operators';
import * as SecureLS from 'secure-ls';
import { DOCUMENT } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { BuyPassModel, TransfertBonnus, TransferCreditModel } from '.';
import { SubscriptionUserModel, JAMONO_ALLO_CODE_FORMULE } from 'src/shared';
const {
  SERVER_API_URL,
  SEDDO_SERVICE,
  CONSO_SERVICE,
  FILE_SERVICE,
  ACCOUNT_MNGT_SERVICE,
  UAA_SERVICE,
  GATEWAY_SERVICE,
} = environment;
const ls = new SecureLS({ encodingType: 'aes' });

// user consumation endpoints
const userConsoEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/suivi-compteur-consommations`;
const postpaidUserConsoEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/v1/suivi-compteur-postpaid`;
const postpaidUserHistoryEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/detail-com-postpaid`;
const userConsoByCodeEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/suivi-compteur-consommations-bycode`;
const userConsoByDayEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/suivi-conso-by-days`;
const attachMobileNumberEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/rattachement-lignes`;
const checkFixNumber = `${attachMobileNumberEndpoint}/check_number_fixe`;
const saveFixNumber = `${attachMobileNumberEndpoint}/ligne-fixe/register`;
const userLinkedPhoneNumberEndpoint = `${attachMobileNumberEndpoint}/get-all-number`;
const isSponsorEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/sponsor`;

// avatar endpoints
export const downloadAvatarEndpoint = `${SERVER_API_URL}/${FILE_SERVICE}/`;
export const downloadEndpoint = `${SERVER_API_URL}/${FILE_SERVICE}/api/download/`;
const userAccountInfos = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/account-management/account`;

// transfers endpoints
const transferCreditEndpoint = `${SERVER_API_URL}/${SEDDO_SERVICE}/api/seddo/transfert-credit`;
const transferbonusEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/transfert-bonus`;

// buy pass by credit endpoints
const buyPassInternetByCreditEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/v1/internet`;
const buyPassIllimixByCreditEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/v1/illimix`;
const listPassIllimixEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/pass-illimix-by-formule`;
const listPassInternetEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/pass-internets-by-formule`;
const listFormulesEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/formule-mobiles`;

// reinitialize passwords endpoints
const initOTPReinitializeEndpoint = `${SERVER_API_URL}/${UAA_SERVICE}/api/account/b2c/reset-password/init`;
const reinitializeEndpoint = `${SERVER_API_URL}/${UAA_SERVICE}/api/account/b2c/reset-password/finish`;

// Endpoint to get fixe number Identity
const idClientEndpoint = `${SERVER_API_URL}/${GATEWAY_SERVICE}/api/numero-client`;
const idClientEndpointAPI = `${SERVER_API_URL}/${GATEWAY_SERVICE}/api/numero-client`;
const buyPassInternetForSomeoneByCreditEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/achat/internet-for-other`;

// Endpoint to get sargal balance
const sargalBalanceEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/`;
const welcomeStatusEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/boosters`;

// Endpoint promoBooster active
const promoBoosterActiveEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/boosters/active-boosters`;

// Endpoint to get the user's birthdate
const userBirthDateEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/abonne/birthDate`;

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  currentPhoneNumberChangeSubject: Subject<string> = new Subject<string>();
  scrollToBottomSubject: Subject<string> = new Subject<string>();
  balanceAvailableSubject: Subject<any> = new Subject<any>();
  isSponsorSubject: Subject<any> = new Subject<boolean>();
  user: any;
  private renderer: Renderer2;
  msisdn: string;
  screenWatcher: Subscription;
  isMobile = true;
  constructor(
    // rendererFactory: RendererFactory2,
    // @Inject(DOCUMENT) private _document,
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    // this.renderer = rendererFactory.createRenderer(null, null);
    authService.currentPhoneNumberSetSubject.subscribe((value) => {
      if (value) {
        this.user = this.authService.getLocalUserInfos();
        this.setCurrentPhoneNumber(this.user.login);
      }
    });

    authService.isLoginSubject.subscribe((value) => {
      if (value) {
        // do something after login
      }
    });
  }

  getSargalBalance(msisdn: string) {
    return this.http.get(`${sargalBalanceEndpoint}/${msisdn}`);
  }

  generateOtpForResetPwd(login: any, token: string) {
    return this.http.post(initOTPReinitializeEndpoint, { login, token });
  }

  reinitializePassword(payload: {
    otp: string;
    newPassword: string;
    login: string;
  }) {
    return this.http.post(reinitializeEndpoint, payload);
  }

  getUserConsoInfos(consoCodes?: number[]) {
    this.msisdn = this.getCurrentPhoneNumber();
    return this.http.get(`${userConsoEndpoint}/${this.msisdn}`);
  }

  getCurrentDate() {
    const date = new Date();
    const lastDate = `${('0' + date.getDate()).slice(-2)}/${(
      '0' +
      (date.getMonth() + 1)
    ).slice(-2)}/${date.getFullYear()}`;
    const lastDateTime =
      `${date.getHours()}h` +
      (date.getMinutes() < 10 ? '0' : '') +
      date.getMinutes();
    return `${lastDate} à ${lastDateTime}`;
  }

  getPostpaidUserConsoInfos() {
    this.msisdn = this.getCurrentPhoneNumber();
    return this.http.get(`${postpaidUserConsoEndpoint}/${this.msisdn}`).pipe(
      map(
        (res: any) => {
          return this.processConso(res, true);
        },
        (error) => {
          const lastLoadedConso = ls.get(`lastConso_${this.msisdn}`);
          return lastLoadedConso;
        }
      )
    );
  }

  getPostpaidConsoHistory(day) {
    this.msisdn = this.getCurrentPhoneNumber();
    return this.http.get(
      `${postpaidUserHistoryEndpoint}/${this.msisdn}/${day}`
    );
  }

  getMainPhoneNumberProfil() {
    return ls.get('mainPhoneNumber');
  }

  // return the phone number that is used when getting user balance, conso history etc.
  getCurrentPhoneNumber() {
    return ls.get('currentPhoneNumber');
  }

  // change the active number
  setCurrentPhoneNumber(msisdn: string) {
    ls.set('currentPhoneNumber', msisdn);
    this.currentPhoneNumberChangeSubject.next(msisdn);
  }

  get currentPhoneNumberChange() {
    return this.currentPhoneNumberChangeSubject.asObservable();
  }

  scrollChatBox() {
    this.scrollToBottomSubject.next();
  }

  get scrollToBottomEvent() {
    return this.scrollToBottomSubject.asObservable();
  }

  // attach new mobile phone number
  registerNumberToAttach(detailsToCheck: {
    numero: string;
    typeNumero: 'MOBILE' | 'FIXE';
  }) {
    detailsToCheck = Object.assign(detailsToCheck, {
      login: this.authService.getUserMainPhoneNumber(),
    });
    return this.http.post(
      `${attachMobileNumberEndpoint}/register`,
      detailsToCheck
    );
  }

  registerNumberByIdClient(payload: {
    numero: string;
    idClient: string;
    typeNumero: 'MOBILE' | 'FIXE';
  }) {
    payload = Object.assign(payload, {
      login: this.authService.getUserMainPhoneNumber(),
    });
    return this.http.post(
      `${attachMobileNumberEndpoint}/fixe-register`,
      payload
    );
  }

  // check if fix number is already linked to an account
  checkFixNumber(payload: { login: string; token: string; msisdn: string }) {
    return this.http.post(checkFixNumber, payload);
  }

  // attach fix number
  attachFixNumber(payload: {
    login: string;
    idClient: string;
    numero: string;
  }) {
    payload = Object.assign({}, payload, { typeNumero: 'FIXE' });
    return this.http.post(saveFixNumber, payload);
  }

  // get all attached numbers
  getAttachedNumbers() {
    const login = this.authService.getUserMainPhoneNumber();
    return this.http.get(`${userLinkedPhoneNumberEndpoint}/${login}`);
  }

  // get main number
  getMainPhoneNumber() {
    return this.authService.getUserMainPhoneNumber();
  }

  // addDimeloScript() {
  //   // Dimelo user information
  //   const userInfos = ls.get('user');
  //   const fullName = userInfos.firstName + ' ' + userInfos.lastName;
  //   const s = this.renderer.createElement('script');
  //   s.type = 'text/javascript';
  //   s.text =
  //     'var _chatq = _chatq || [];' +
  //     '_chatq.push(["_setIdentity", {' +
  //     '"screenname": "' +
  //     fullName +
  //     '",' + // full name
  //     '"avatar_url": "https://orangeetmoi.orange.sn/content/icons/icon-72x72.png",' + // ibou image
  //     '"firstname": "' +
  //     userInfos.firstName +
  //     '",' +
  //     '"lastname": "' +
  //     userInfos.lastName +
  //     '",' +
  //     '"email": "",' +
  //     '"uuid": "' +
  //     userInfos.numero +
  //     '",' +
  //     '"extra_values": {' +
  //     '"customer_id": "' +
  //     userInfos.numero +
  //     '"}}]);';
  //   this.renderer.appendChild(this._document.body, s);
  // }

  getAccountInfo(userLogin: string) {
    return this.http
      .get(`${userAccountInfos}/${userLogin}`)
      .pipe(tap((res: any) => {}));
  }

  getUserConsoInfosByCode(consoCodes?: number[]) {
    this.msisdn = this.getCurrentPhoneNumber();
    // filter by code not working on Orange VM so
    let queryParams = '';
    if (consoCodes && Array.isArray(consoCodes) && consoCodes.length) {
      const params = consoCodes.map((code) => `code=${code}`).join('&');
      queryParams = `?${params}`;
    }
    return this.http
      .get(`${userConsoByCodeEndpoint}/${this.msisdn}${queryParams}`)
      .pipe(
        map(
          (res: any) => {
            return this.processConso(res);
          },
          (error) => {
            const lastLoadedConso = ls.get(`lastConso_${this.msisdn}`);
            return lastLoadedConso;
          }
        )
      );
  }

  processConso(conso: any, consoPostpaid?: boolean) {
    if ((conso && conso.length) || consoPostpaid) {
      const lastUpdateConsoDate = this.getCurrentDate();
      ls.set(`lastConso_${this.msisdn}`, conso);
      ls.set(`lastUpdateConsoDate_${this.msisdn}`, lastUpdateConsoDate);
      return conso;
    } else {
      const lastLoadedConso = ls.get(`lastConso_${this.msisdn}`);
      return lastLoadedConso;
    }
  }

  getUserConso(day) {
    this.msisdn = this.getCurrentPhoneNumber();
    return this.http.get(`${userConsoByDayEndpoint}/${this.msisdn}/${day}`);
  }

  // Pass Internet & illimix

  getAllformules() {
    return this.http.get(`${listFormulesEndpoint}`);
  }

  getListPassIllimix(codeFormule) {
    return this.http.get(`${listPassIllimixEndpoint}/${codeFormule}`);
  }

  getListPassInternet(codeFormule) {
    return this.http.get(`${listPassInternetEndpoint}/${codeFormule}`);
  }

  buyPassByCredit(payload: BuyPassModel) {
    const { msisdn, receiver, codeIN, amount } = payload;
    const params = { msisdn, receiver, codeIN, amount };
    switch (payload.type) {
      case 'internet':
        if (msisdn === receiver) {
          return this.http.post(buyPassInternetByCreditEndpoint, params);
        } else {
          return this.http.post(
            buyPassInternetForSomeoneByCreditEndpoint,
            params
          );
        }
      case 'illimix':
        return this.http.post(buyPassIllimixByCreditEndpoint, params);
      default:
        break;
    }
  }

  transferBonus(transfertbonnus: TransfertBonnus) {
    return this.http.post(`${transferbonusEndpoint}`, transfertbonnus);
  }

  transferCredit(transferPayload: TransferCreditModel) {
    return this.http.post(`${transferCreditEndpoint}`, transferPayload);
  }

  setScreenWatcher(screenWatcher: Subscription) {
    this.screenWatcher = screenWatcher;
  }
  unsubscribeScreen() {
    this.screenWatcher.unsubscribe();
  }

  getIdClient() {
    const phoneNumber = this.getCurrentPhoneNumber();
    return this.authService
      .getSubscriptionCustomerOffer(phoneNumber)
      .pipe(map((response: any) => response.clientCode));
  }

  getCodeFormuleOfMsisdn(msisdn: string) {
    let res: any;
    this.authService
      .getSubscription(msisdn)
      .subscribe((souscription: SubscriptionUserModel) => {
        const codeFormule =
          souscription.profil === 'HYBRID' || souscription.profil === 'ND'
            ? JAMONO_ALLO_CODE_FORMULE
            : souscription.code;
        res = of(codeFormule);
      });

    return res;
  }

  getWelcomeStatus() {
    const currentPhoneNumber = this.getCurrentPhoneNumber();
    return this.http.get(
      `${welcomeStatusEndpoint}/${currentPhoneNumber}/welcome-status`
    );
  }

  getActivePromoBooster(msisdn: string, code: string) {
    return this.http.get(
      `${promoBoosterActiveEndpoint}?msisdn=${msisdn}&code=${code}`
    );
    // return of({ isPromoPassActive: false, isPromoRechargeActive: false });
  }

  getUserBirthDate(): Observable<any> {
    const userBirthDay = ls.get('birthDate');
    if (userBirthDay) return of();
    const msisdn = this.getMainPhoneNumber();
    return this.http.get(`${userBirthDateEndpoint}/${msisdn}`).pipe(
      map((birthDate) => {
        ls.set('birthDate', birthDate);
      })
    );
  }
}
