import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  Observable,
  of,
  interval,
  throwError,
} from 'rxjs';
import {
  tap,
  map,
  delay,
  retryWhen,
  flatMap,
  switchMap,
  catchError,
  share,
  take,
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as jwt_decode from 'jwt-decode';
import * as SecureLS from 'secure-ls';
import {
  PROFILE_TYPE_HYBRID,
  PROFILE_TYPE_HYBRID_1,
  PROFILE_TYPE_HYBRID_2,
  isFixPostpaid,
  PROFILE_TYPE_POSTPAID,
  KILIMANJARO_FORMULE,
  isPrepaidFix,
} from 'src/app/dashboard';
import {
  JAMONO_ALLO_CODE_FORMULE,
  NotificationInfoModel,
  SubscriptionModel,
  JAMONO_PRO_CODE_FORMULE,
  PRO_MOBILE_ERROR_CODE,
} from 'src/shared';

const {
  SERVER_API_URL,
  ACCOUNT_MNGT_SERVICE,
  CODE_OTP_SERVICE,
  CONSO_SERVICE,
  GET_MSISDN_BY_NETWORK_URL,
  CONFIRM_MSISDN_BY_NETWORK_URL,
  UAA_SERVICE,
} = environment;
const ls = new SecureLS({ encodingType: 'aes' });

// Account & msisdn infos
const accountBaseUrl = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/account-management`;
const checkUserExistEndpoint = `${accountBaseUrl}/check_number`;
const registerUserEndpoint = `${accountBaseUrl}/register`;
const checkEmailEndpoint = `${accountBaseUrl}/email-already-exist`;
const userInfosEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/abonne/information-abonne`;
const userSubscriptionInfo = `${SERVER_API_URL}/${CONSO_SERVICE}/api/souscription-infos`;
const userSubscriptionEndpoint2 = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/abonne/v1/customerOffer`;
const SUBSCRIPTION_ENDPOINT_FOR_TIER = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/abonne/v2/customerOffer`;
const userSubscriptionIsPostpaidEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/abonne/is-postpaid`;
const abonneInfoWithOTP = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/abonne/information-abonne`;
const loginEndpoint = `${SERVER_API_URL}/auth/login`;
const logoutEndpoint = `${SERVER_API_URL}/auth/logout`;
const captchaEndpoint = `${SERVER_API_URL}/auth/captcha`;
// Code OTP`
const otpBaseUrl = `${SERVER_API_URL}/${CODE_OTP_SERVICE}/api/code-otp-infos`;
const generateCodeOtpEndpoint = `${otpBaseUrl}/generate`;
const checkCodeOtpEndpoint = `${otpBaseUrl}/check`;

// new registrations endpoint
const checkNumberEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/account-management/v2/check_number`;
const registerEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/account-management/v2/register`;
const resetPwdEndpoint = `${SERVER_API_URL}/${UAA_SERVICE}/api/account/b2c/reset-password`;

const notificationInfoEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/notification-information`;
// endpoint to get token
const tokenEndpoint = `${SERVER_API_URL}/auth/get-service-token`;
// eligibility to recieve pass internet & illimix endpoint
const eligibilityRecievePassEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/check-conditions`;
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  currentPhoneNumberSetSubject = new BehaviorSubject<boolean>(false);
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
  scrollToBottomSubject: Subject<string> = new Subject<string>();
  acceptCookieSubject = new Subject<string>();
  userInfo: any;
  private SubscriptionHttpCache: Map<string, Observable<any>> = new Map<
    string,
    Observable<any>
  >();
  subscriptionUpdatedSubject: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) {}

  get currentPhoneNumbersubscriptionUpdated() {
    return this.subscriptionUpdatedSubject.asObservable();
  }

  // accept cookies
  acceptCookies() {
    ls.set('acceptCookies', 'yes');
    this.acceptCookieSubject.next();
  }

  acceptCookieEvent() {
    return this.acceptCookieSubject.asObservable();
  }

  // check if user has account or not or is linked with another account
  checkUserStatus(msisdn: string, token: string) {
    return this.http.post(checkUserExistEndpoint, { msisdn, token });
  }

  // send OTP to user
  generateUserOtp(msisdn: string, token: string) {
    return this.http.post(generateCodeOtpEndpoint, { msisdn, token });
  }

  // check OTP sent by user
  checkOtp(verificationData: { msisdn: string; code: string }) {
    return this.http.post(checkCodeOtpEndpoint, verificationData);
  }
  getInfosAbonneWithOTP(msisdn: string, codeOTP: string) {
    return this.http.get(`${abonneInfoWithOTP}/${msisdn}/${codeOTP}`);
  }

  // get user informations
  getAbonneInformation(msisdn: string) {
    return this.http.get(`${userInfosEndpoint}/${msisdn}`);
  }

  // register user
  registerUser(userInfos: RegistrationData) {
    return this.http.post(`${registerUserEndpoint}`, userInfos);
  }

  getCustomerOfferRefact(msisdn: string) {
    return this.http
      .get(`${userSubscriptionEndpoint2}/${msisdn}`)
      .pipe(share());
  }

  // get msisdn subscription
  getSubscriptionCustomerOffer(msisdn: string) {
    // step 1 check if data exists in localstorage
    // step 2 if exists return data from localstorage
    // else call server to get data
    // what to save? 'subXXXXXXXX"
    const lsKey = 'sub' + msisdn;
    const savedData = ls.get(lsKey);
    if (savedData) {
      return of(savedData);
    } else {
      return this.http.get(`${userSubscriptionEndpoint2}/${msisdn}`).pipe(
        map((res: any) => {
          const subscription = {
            clientCode: res.clientCode,
            nomOffre: res.offerName,
            profil: res.offerType,
            code: res.offerId,
          };
          if (
            subscription.profil === PROFILE_TYPE_HYBRID ||
            subscription.profil === PROFILE_TYPE_HYBRID_1 ||
            subscription.profil === PROFILE_TYPE_HYBRID_2
          ) {
            subscription.code = JAMONO_ALLO_CODE_FORMULE;
          }
          if (isFixPostpaid(subscription.nomOffre)) {
            subscription.profil = PROFILE_TYPE_POSTPAID;
          }
          const lsKey = 'sub' + msisdn;
          ls.set(lsKey, subscription);
          this.subscriptionUpdatedSubject.next(subscription);
          return subscription;
        })
      );
    }
  }

  // get msisdn subscription
  getSubscription(msisdn: string) {
    const lsKey = 'sub' + msisdn;
    const savedData = ls.get(lsKey);
    if (savedData) {
      return of(savedData).pipe(take(1));
    } else {
      return this.getCustomerOfferRefact(msisdn).pipe(
        map((res: any) => {
          const subscription = {
            clientCode: res.clientCode,
            nomOffre: res.offerName,
            profil: res.offerType,
            code: res.offerId,
          };
          if (
            subscription.profil === PROFILE_TYPE_HYBRID ||
            subscription.profil === PROFILE_TYPE_HYBRID_1 ||
            subscription.profil === PROFILE_TYPE_HYBRID_2
          ) {
            subscription.code = JAMONO_ALLO_CODE_FORMULE;
          }
          if (isFixPostpaid(subscription.nomOffre)) {
            subscription.profil = PROFILE_TYPE_POSTPAID;
          }
          const lsKey = 'sub' + msisdn;
          ls.set(lsKey, subscription);
          // this.subscriptionUpdatedSubject.next(subscription);
          return subscription;
        })
      );
    }
    // if (!this.SubscriptionHttpCache.has(msisdn)) {
    //   this.SubscriptionHttpCache[msisdn] = this.getSubscriptionCustomerOffer(
    //     msisdn
    //   ).pipe(shareReplay(1));
    // }
    // return this.SubscriptionHttpCache[msisdn];
  }

  getSubscriptionCustomerOfferForTiers(msisdn: string) {
    // step 1 check if data exists in localstorage
    // step 2 if exists return data from localstorage
    // else call server to get data
    // what to save? 'subXXXXXXXX"
    return this.http.get(`${SUBSCRIPTION_ENDPOINT_FOR_TIER}/${msisdn}`).pipe(
      map((res: any) => {
        const subscription = {
          nomOffre: res.offerName,
          profil: res.offerType,
          code: res.offerId,
        };
        if (
          subscription.profil === PROFILE_TYPE_HYBRID ||
          subscription.profil === PROFILE_TYPE_HYBRID_1 ||
          subscription.profil === PROFILE_TYPE_HYBRID_2
        ) {
          subscription.code = JAMONO_ALLO_CODE_FORMULE;
        }
        if (isFixPostpaid(subscription.nomOffre)) {
          subscription.profil = PROFILE_TYPE_POSTPAID;
        }
        const lsKey = 'subtiers' + msisdn;
        ls.set(lsKey, subscription);
        this.subscriptionUpdatedSubject.next(subscription);
        return subscription;
      })
    );
  }

  getSubscriptionForTiers(msisdn: string): Observable<any> {
    const lsKey = 'subtiers' + msisdn;
    const savedData = ls.get(lsKey);
    if (savedData) {
      return of(savedData);
    } else {
      return this.getSubscriptionCustomerOfferForTiers(msisdn).pipe(share());
    }
  }

  getSubscriptionData(msisdn) {
    return this.http.get(`${userSubscriptionInfo}/${msisdn}`).pipe(
      map((subscription: any) => {
        const result = {
          nomOffre: subscription.nomOffre,
          profil: subscription.profil
            ? subscription.profil.toString().toUpperCase()
            : subscription.profil,
          code: subscription.code,
        };
        if (
          result.profil === PROFILE_TYPE_HYBRID ||
          result.profil === PROFILE_TYPE_HYBRID_1 ||
          result.profil === PROFILE_TYPE_HYBRID_2
        ) {
          result.code = JAMONO_ALLO_CODE_FORMULE;
        }
        const lsKey = 'sub' + msisdn;
        ls.set(lsKey, result);
        return result;
      })
    );
  }

  canRecieveCredit(msisdn: string): Observable<any> {
    // return this.isPostpaid(msisdn).pipe(
    //   map((isPostPaid: any) => {
    //     return !isPostPaid;
    //   })
    // );
    return this.getSubscriptionForTiers(msisdn).pipe(
      map((res: SubscriptionModel) => {
        const codeFormule = res.code;
        const profil = res.profil;
        if (
          (profil === PROFILE_TYPE_POSTPAID &&
            codeFormule != KILIMANJARO_FORMULE) ||
          isPrepaidFix(res)
        ) {
          return false;
        }
        return true;
      })
    );
  }

  checkUserEligibility(msisdn) {
    // return of({
    //   message: 'Vous avez déjà un illimix en cours.',
    //   eligible: false,
    // });
    return this.http.get(`${eligibilityRecievePassEndpoint}/${msisdn}`);
  }

  deleteSubFromStorage(msisdn: string) {
    const lsKey = 'sub' + msisdn;
    const savedData = ls.get(lsKey);
    if (savedData) {
      ls.remove(lsKey);
    }
    if (this.SubscriptionHttpCache.has(msisdn)) {
      this.SubscriptionHttpCache.delete(msisdn);
    }
  }

  // isPostpaid
  isPostpaid(msisdn: string) {
    const mainPhoneNumber = this.getUserMainPhoneNumber();
    return this.http.get(
      `${userSubscriptionIsPostpaidEndpoint}/${mainPhoneNumber}/${msisdn}`
    );
  }

  hasToken() {
    return !!this.getToken() || null;
  }

  getToken() {
    return ls.get('token');
  }

  getLightToken() {
    return ls.get('light-token');
  }

  login(credential: {
    username: string;
    password: string;
    rememberMe?: boolean;
  }) {
    return this.http.post(loginEndpoint, credential).pipe(
      tap((res: any) => {
        this.storeAuthenticationData(res, credential);
        this.isLoginSubject.next(true);
        // this.getSubscription(credential.username).subscribe();
      })
    );
  }

  logout() {
    this.http
      .post(logoutEndpoint, '')
      .pipe(
        tap(() => {
          this.isLoginSubject.next(false);
        })
      )
      .subscribe();
    this.cleanCache();
  }

  captcha(token: string, ip: string) {
    return this.http.post(
      captchaEndpoint + '?token=' + token + '&ip=' + ip,
      null
    );
  }

  cleanCache() {
    ls.remove('currentPhoneNumber');
    this.currentPhoneNumberSetSubject.next(false);
    this.removeAuthenticationData();
    this.removeUserInfos();
    this.isLoginSubject.next(false);
    ls.removeAll();
    window.localStorage.clear();
  }
  get isLoggedIn() {
    return this.isLoginSubject.asObservable();
  }

  checkEmailAlreadyUsed(email: string) {
    const data = { email };
    return this.http.post(checkEmailEndpoint, data);
  }

  getUserMainPhoneNumber() {
    return ls.get('mainPhoneNumber');
  }

  getLocalUserInfos() {
    try {
      const User = ls.get('user');
      return User;
    } catch (err) {
      return null;
    }
  }

  storeUserInfos(userInfos) {
    ls.set('user', userInfos);
    this.currentPhoneNumberSetSubject.next(true);
  }

  removeUserInfos() {
    ls.remove('user');
    ls.remove('deviceInfo');
  }

  private storeAuthenticationData(authenticationData: any, user: any) {
    ls.set('token', authenticationData.access_token);
    ls.set('mainPhoneNumber', user.username);
    ls.set('currentPhoneNumber', user.username);
    ls.set('refresh_token', authenticationData.refresh_token);
    ls.set('banner', true);
  }

  private removeAuthenticationData() {
    ls.remove('token');
  }

  scrollChatBox() {
    this.scrollToBottomSubject.next();
  }

  get scrollToBottomEvent() {
    return this.scrollToBottomSubject.asObservable();
  }

  getAccessTokenInfo(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  getMsisdnByNetwork() {
    // return of({ msisdn: '775896287' }).pipe(delay(2000));
    return this.http.get(GET_MSISDN_BY_NETWORK_URL);
  }

  confirmMsisdnByNetwork(msisdn: string) {
    // return of({ msisdn: '775896287', status: true, hmac: '' }).pipe(delay(2000));
    return this.http.get(`${CONFIRM_MSISDN_BY_NETWORK_URL}/${msisdn}`);
  }

  getTokenFromBackend() {
    return this.http.get(tokenEndpoint).pipe(
      tap((res: any) => {
        ls.set('light-token', res.access_token);
      })
    );
  }

  checkNumber(checkNumberPayload: { msisdn: string; hmac: string }) {
    return this.getTokenFromBackend().pipe(
      switchMap(() => {
        const msisdn = checkNumberPayload.msisdn.substring(
          checkNumberPayload.msisdn.length - 9
        );
        return this.getSubscriptionForTiers(msisdn).pipe(
          switchMap((sub: SubscriptionModel) => {
            const isProMobile = sub.code === JAMONO_PRO_CODE_FORMULE;
            if (!isProMobile) {
              return this.http.post(checkNumberEndpoint, checkNumberPayload);
            } else {
              const error = {
                status: 400,
                errorKey: PRO_MOBILE_ERROR_CODE,
                message: 'Ce numéro ne peut pas accéder à Orange et Moi',
              };
              return throwError(error);
            }
          }),
          catchError((err) => {
            return throwError(err);
          })
        );
      })
    );
  }

  register(registerPayload: RegistrationModel) {
    return this.http.post(registerEndpoint, registerPayload);
  }

  resetPassword(resetPwdPayload: ResetPwdModel) {
    return this.http.post(resetPwdEndpoint, resetPwdPayload);
  }

  // Update Notification Info for user
  UpdateNotificationInfo() {
    delay(10000);
    const info = {} as NotificationInfoModel;
    info.firebaseId = ls.get('firebaseId');
    info.msisdn = this.getUserMainPhoneNumber();
    const lsKey = 'sub' + info.msisdn;
    const savedData = ls.get(lsKey);
    info.codeFormule = savedData.code;
    if (info.msisdn && info.codeFormule) {
      this.http.put(notificationInfoEndpoint, info).subscribe();
    }
  }

  setHmacOnLs(hmac: string) {
    ls.set('hmac', hmac);
  }

  getHmac() {
    return ls.get('hmac');
  }
}

export interface RegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  login: string;
  password: string;
}

export interface RegistrationModel {
  email: string;
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  hmac: string;
  clientId: any
}

export interface ConfirmMsisdnModel {
  hmac: string;
  msisdn: string;
  status: boolean;
}

export interface ResetPwdModel {
  newPassword: string;
  hmac: string;
  login: string;
}

export function http_retry(maxRetry = 10, delayMs = 10000) {
  return (src: Observable<any>) => {
    return src.pipe(
      retryWhen((_) => {
        return interval(delayMs).pipe(
          flatMap((count) =>
            count === maxRetry ? throwError('Giving up') : of(count)
          )
        );
      })
    );
  };
}
