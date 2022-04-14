import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, of, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {CheckOtpOem} from 'src/app/models/check-otp-oem.model';
import {GenerateOtpOem} from 'src/app/models/generate-otp-oem.model';
import {environment} from 'src/environments/environment';
import {LOCAL_STORAGE_KEYS} from 'src/shared';
import {LocalStorageService} from '../localStorage-service/local-storage.service';
const {OTP_SERVICE, SERVER_API_URL} = environment;

const generateOTPEndpoint = `${SERVER_API_URL}/${OTP_SERVICE}/api/code-otp-link/generate`;
const checkOTPEndpoint = `${SERVER_API_URL}/${OTP_SERVICE}/api/code-otp-link/check`;
@Injectable({
  providedIn: 'root'
})
export class OtpService {
  static isChecking = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private localStorage: LocalStorageService) {}

  generateOTPBySMS(data: GenerateOtpOem) {
    data.uuid = this.localStorage.getFromLocalStorage(LOCAL_STORAGE_KEYS.X_UUID);
    return this.http.post(`${generateOTPEndpoint}`, data);
  }

  checkOTPSMS(data: CheckOtpOem) {
    data.msisdn = this.localStorage.getFromLocalStorage(LOCAL_STORAGE_KEYS.NUMBER_FOR_OTP_REGISTRATION);
    data.uuid = this.localStorage.getFromLocalStorage(LOCAL_STORAGE_KEYS.X_UUID);
    OtpService.isChecking.next(true);
    return this.http.post(`${checkOTPEndpoint}`, data).pipe(
      tap((res: {hmac: string; check: boolean}) => {
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
}
