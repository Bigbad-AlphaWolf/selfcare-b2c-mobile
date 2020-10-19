import { Injectable, RendererFactory2, Inject, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, Subscription, of } from 'rxjs';
import { tap, map, switchMap, catchError, share, take } from 'rxjs/operators';
import * as SecureLS from 'secure-ls';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { BuyPassModel, TransfertBonnus, TransferCreditModel } from '.';
import {
  SubscriptionUserModel,
  JAMONO_ALLO_CODE_FORMULE,
  SubscriptionModel,
  REGEX_FIX_NUMBER,
} from 'src/shared';
import { DOCUMENT } from '@angular/platform-browser';
import { SessionOem } from '../session-oem/session-oem.service';
const {
  SERVER_API_URL,
  SEDDO_SERVICE,
  CONSO_SERVICE,
  FILE_SERVICE,
  ACCOUNT_MNGT_SERVICE,
  UAA_SERVICE,
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

const buyPassInternetForSomeoneByCreditEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/achat/internet-for-other`;

// Endpoint to get sargal balance
const sargalBalanceEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/`;
const welcomeStatusEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/boosters`;

// Endpoint promoBooster active
const promoBoosterActiveEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/boosters/active-boosters`;

// Endpoint to get the user's birthdate
const userBirthDateEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/abonne/birthDate`;

// Endpoint to check allo feature status
const showNewFeatureStateEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/pass-allo-new`;
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  static CURRENT_DASHBOARD: string = '/dashboard';
  static rattachedNumbers: any[];
  currentPhoneNumberChangeSubject: Subject<string> = new Subject<string>();
  scrollToBottomSubject: Subject<string> = new Subject<string>();
  balanceAvailableSubject: Subject<any> = new Subject<any>();
  isSponsorSubject: Subject<any> = new Subject<boolean>();
  user: any;
  msisdn: string;
  screenWatcher: Subscription;
  isMobile = true;
  private renderer: Renderer2;
  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private _document,
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
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

  getUserConsoInfos() {
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
        () => {
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
    return this.http
      .post(`${attachMobileNumberEndpoint}/register`, detailsToCheck)
      .pipe(
        tap((r) => {
          DashboardService.rattachedNumbers = null;
          this.attachedNumbers().pipe(take(1)).subscribe();
        })
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
    return this.http
      .post(`${attachMobileNumberEndpoint}/fixe-register`, payload)
      .pipe(
        tap((r) => {
          DashboardService.rattachedNumbers = null;
          this.attachedNumbers().pipe(take(1)).subscribe();
        })
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

  attachedNumbers() {
    if (DashboardService.rattachedNumbers)
      return of(DashboardService.rattachedNumbers);

    return this.getAttachedNumbers().pipe(
      tap((elements: any) => {
        DashboardService.rattachedNumbers = elements;
      })
    );
  }

  fetchFixedNumbers() {
    return this.getAttachedNumbers().pipe(
      map((elements: any) => {
        let numbers = [];
        if (REGEX_FIX_NUMBER.test(SessionOem.MAIN_PHONE))
          numbers.push(SessionOem.MAIN_PHONE);
        elements.forEach((element: any) => {
          if (REGEX_FIX_NUMBER.test(element.msisdn))
            numbers.push(element.msisdn);
        });
        return numbers;
      }),
      share()
    );
  }

  fetchOemNumbers() {
    return this.attachedNumbers().pipe(
      map((elements: any) => {
        const mainPhone = this.authService.getUserMainPhoneNumber();
        let numbers = [mainPhone.trim()];
        elements.forEach((element: any) => {
          const msisdn = '' + element.msisdn;
          if (!msisdn.startsWith('33', 0)) {
            numbers.push(element.msisdn);
          }
        });
        return numbers;
      })
    );
  }

  // get main number
  getMainPhoneNumber() {
    return this.authService.getUserMainPhoneNumber();
  }

  addDimeloScript() {
    // Dimelo user information
    const userInfos = ls.get('user');
    const fullName = userInfos.firstName + ' ' + userInfos.lastName;
    const s = this.renderer.createElement('script');
    s.type = 'text/javascript';
    s.text =
      'var _chatq = _chatq || [];' +
      '_chatq.push(["_setIdentity", {' +
      '"screenname": "' +
      fullName +
      '",' + // full name
      '"avatar_url": "https://orangeetmoi.orange.sn/content/icons/icon-72x72.png",' + // ibou image
      '"firstname": "' +
      userInfos.firstName +
      '",' +
      '"lastname": "' +
      userInfos.lastName +
      '",' +
      '"email": "",' +
      '"uuid": "' +
      userInfos.numero +
      '",' +
      '"mobile_phone": "' +
      userInfos.numero +
      '",' +
      '"extra_values": {' +
      '"customer_id": "' +
      userInfos.numero +
      '"}}]);';
    this.renderer.appendChild(this._document.body, s);
  }

  addDimeloScriptTotrigger() {
    const s = this.renderer.createElement('script');
    s.type = 'text/javascript';
    s.text =
      'var t = Dimelo.Chat.Manager.ChatQLoader.manager.triggers[1];' +
      'Dimelo.Chat.Manager.ChatQLoader.manager.activateTrigger(t);';
    this.renderer.appendChild(this._document.body, s);
  }

  prepareScriptChatIbou() {
    this.removeScriptChatIbouIfExist();
    const s = this.renderer.createElement('script');
    s.type = 'text/javascript';
    s.text =
      'var trigger_id = "5f04681b0e69dc63aac7bb0e";' +
      'loadChatTrigger(trigger_id)';
    s.id = 'ibou';
    this.renderer.appendChild(this._document.body, s);
  }

  removeScriptChatIbouIfExist() {
    const scriptIbou = document.getElementById('ibou');
    if (scriptIbou) {
      scriptIbou.remove();
    }
  }

  getAccountInfo(userLogin: string) {    
    return this.http
      .get(`${userAccountInfos}/${userLogin}`)
      .pipe(share());
  }

  getUserConsoInfosByCode(hmac?: string, consoCodes?: number[]) {
    this.msisdn = this.getCurrentPhoneNumber();
    // filter by code not working on Orange VM so
    let queryParams = '';
    if (consoCodes && Array.isArray(consoCodes) && consoCodes.length) {
      const params = consoCodes.map((code) => `code=${code}`).join('&');
      queryParams = `?${params}`;
    }
    if (hmac) {
      queryParams += `?hmac=${hmac}`;
    }
    return this.http
      .get(`${userConsoByCodeEndpoint}/${this.msisdn}${queryParams}`)
      .pipe(
        map(
          (res: any) => {
            return this.processConso(res);
          },
          () => {
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

  getListPassIllimix(codeFormule, category?: string) {
    let url = `${listPassIllimixEndpoint}/${codeFormule}`;
    if (category) url += `?categorie=${category}`;
    return this.http.get(url);
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
      .getSubscription(phoneNumber)
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

  getActivePromoBooster() {
    const currentPhoneNumber = this.getCurrentPhoneNumber();
    return this.authService.getSubscription(currentPhoneNumber).pipe(
      switchMap((res: SubscriptionModel) => {
        return this.http.get(
          `${promoBoosterActiveEndpoint}?msisdn=${currentPhoneNumber}&code=${res.code}`
        );
      }),
      catchError((_) => {
        return of({
          promoPass: null,
          promoRecharge: null,
          promoPassIllimix: null,
        });
      })
    );
  }

  getUserBirthDate(): Observable<any> {
    const userBirthDay = ls.get('birthDate');
    if (userBirthDay) return of(userBirthDay);
    const msisdn = this.getMainPhoneNumber();
    return this.http
      .get(`${userBirthDateEndpoint}/${msisdn}`, { responseType: 'text' })
      .pipe(
        map((birthDate) => {
          ls.set('birthDate', birthDate);
        })
      );
  }

  getNewFeatureAlloBadgeStatus() {
    return this.http.get(`${showNewFeatureStateEndpoint}`).pipe(
      map((isNew: boolean) => {
        return isNew;
      })
    );
  }

  swapOMCard() {
    const omCard = document.getElementById('omCard');
    if (omCard) {
      omCard.remove();
      document.getElementsByClassName('swiper-wrapper')[0].prepend(omCard);
    }
  }
}
