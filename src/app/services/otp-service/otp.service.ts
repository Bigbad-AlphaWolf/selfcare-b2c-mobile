import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CheckOtpCodeModel, CheckOtpOem } from 'src/app/models/check-otp-oem.model';
import { GenerateOtpOem } from 'src/app/models/generate-otp-oem.model';
import { environment } from 'src/environments/environment';
import { LOCAL_STORAGE_KEYS } from 'src/shared';
import { LocalStorageService } from '../localStorage-service/local-storage.service';
import { nanoid } from 'nanoid';
import { DashboardService } from '../dashboard-service/dashboard.service';

const { OTP_SERVICE, ACCOUNT_MNGT_SERVICE, SERVER_API_URL } = environment;

const generateOTPEndpoint = `${SERVER_API_URL}/${OTP_SERVICE}/api/code-otp-link/generate`;
const checkOTPEndpoint = `${SERVER_API_URL}/${OTP_SERVICE}/api/code-otp-link/check`;
const checkOTPCodeEndpoint = `${SERVER_API_URL}/${OTP_SERVICE}/api/code-otp-infos/check`;
const generateOTPCodeEndpoint = `${SERVER_API_URL}/${OTP_SERVICE}/api/code-otp-infos/generate`;
const generateOTPCodeWithCaptchaEndpoint = `${SERVER_API_URL}/${OTP_SERVICE}/api/v2/code-otp-infos/generate`;
const validateRattachByOTPCodeEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/v1/rattachement-lignes/register/by-otp`;
@Injectable({
  providedIn: 'root',
})
export class OtpService {
  static isChecking = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private localStorage: LocalStorageService, private dashbService: DashboardService) {}

  generateOTPBySMS(data: GenerateOtpOem) {
    data.uuid = this.localStorage.getFromLocalStorage(LOCAL_STORAGE_KEYS.X_UUID);
    return this.http.post(`${generateOTPEndpoint}`, data);
  }

  checkOTPSMS(data: CheckOtpOem) {
    data.msisdn = this.localStorage.getFromLocalStorage(LOCAL_STORAGE_KEYS.NUMBER_FOR_OTP_REGISTRATION);
    data.uuid = this.localStorage.getFromLocalStorage(LOCAL_STORAGE_KEYS.X_UUID);
    this.localStorage.clearFromLocalStorage(LOCAL_STORAGE_KEYS.HMAC_FROM_OTP);
    this.localStorage.clearFromLocalStorage(LOCAL_STORAGE_KEYS.IS_HMAC_FROM_OTP_VALID);
    OtpService.isChecking.next(true);
    return this.http.post(`${checkOTPEndpoint}`, data).pipe(
      tap((res: { hmac: string; check: boolean }) => {
        this.localStorage.saveToLocalStorage(LOCAL_STORAGE_KEYS.IS_HMAC_FROM_OTP_VALID, res.check);
        this.localStorage.saveToLocalStorage(LOCAL_STORAGE_KEYS.HMAC_FROM_OTP, res.hmac);
        OtpService.isChecking.next(false);
      }),
      catchError(err => {
        this.localStorage.saveToLocalStorage(LOCAL_STORAGE_KEYS.IS_HMAC_FROM_OTP_VALID, false);
        OtpService.isChecking.next(false);
        return throwError(err);
      })
    );
  }

  checkOtpCode(payload: CheckOtpCodeModel) {
    payload.uuid = this.localStorage.getFromLocalStorage(LOCAL_STORAGE_KEYS.X_UUID);
    return this.http.post<CheckOtpCodeModel>(checkOTPCodeEndpoint, payload);
  }

  generateOTPCode(msisdn: string) {
    const data = {
      token: nanoid(5),
      msisdn,
    };
    return this.http.post(`${generateOTPCodeEndpoint}`, data);
  }

  generateOTPCaptchaCode(msisdn: string, token: string) {
    const data = {
      token,
      msisdn,
    };

    return this.http.post(`${generateOTPCodeWithCaptchaEndpoint}`, data);
  }

  rattachNumberByOTPCode(msisdn: string, code: string, login: string) {
    const data = {
      numero: msisdn,
      identificationId: code,
      login,
      typeNumero: 'MOBILE',
    };
    return this.http.post(`${validateRattachByOTPCodeEndpoint}`, data).pipe(
      tap(() => {
        DashboardService.rattachedNumbers = null;
        this.dashbService.attachedNumbers().subscribe();
        this.dashbService.attachedNumbersChangedSubject.next();
      })
    );
  }
}
