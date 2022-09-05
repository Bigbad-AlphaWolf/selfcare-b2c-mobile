import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LOCAL_STORAGE_KEYS } from 'src/shared';
import { LocalStorageService } from '../localStorage-service/local-storage.service';
import * as CryptoJS from 'crypto-js';

const { SERVER_API_URL, SERVICES_SERVICE, DEFAULT_DATA_CACHE_DURATION } = environment;

const passAbonnementWidoEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/widotv/v1/list`;
const suscriptionWidoEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/widotv/v1/subscribe`;
const encryptionKeyEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/widotv/v1/private-key`;

const passPPVWidoEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/widotv/v1/ppv-list`;

enum PAYMENT_MODE_WIDO {
	AIRTIME = "AIRTIME",
	ORANGEMONEY = "ORANGEMONEY"
}
@Injectable({
  providedIn: 'root',
})
export class PassAbonnementWidoService {
  constructor(private http: HttpClient, private localStorage: LocalStorageService) {}

  getListPassAbonnementWido(recipientMsisdn: string) {
    return this.http.get(`${passAbonnementWidoEndpoint}/${recipientMsisdn}`);
  }

  getListPassPPVWido(recipientMsisdn: string) {
    return this.http.get(`${passPPVWidoEndpoint}/${recipientMsisdn}`);
  }

  suscribeToWido(data: { msisdn: string; packId: number, contentId?: number}) {
		let endpoint = `${suscriptionWidoEndpoint}/${data?.msisdn}`;
		const payload = {
			paymentMode: PAYMENT_MODE_WIDO.AIRTIME,
			packId: data.packId
		};
		if(data?.contentId) {
			payload['contentId'] = data?.contentId;
			endpoint += '?subsciptionTypes=PPV';
		}
    return this.http.post(
      `${endpoint}`,
      payload
    ).pipe(catchError((err) => {
			if(err) return throwError({
				error : {
					message: err?.error?.message
				}
			})
		} ));
  }


  suscribeToWidoByOMoney(data: { msisdn: string; packId: number,  omPin: string, contentId?: number }) {
		const payload = {omPin: data?.omPin , paymentMode: PAYMENT_MODE_WIDO.ORANGEMONEY, packId: data.packId};
		let endpoint = `${suscriptionWidoEndpoint}/${data?.msisdn}`;
		if(data?.contentId) {
			payload['contentId'] = data?.contentId;
			endpoint += '?subsciptionTypes=PPV';
		}
    return this.getEncryptionKey().pipe(
			switchMap((res: {value: string, lastUpdate: any}) => {
				console.log('pin', data.omPin);
				data.omPin = this.getEncryptionAESUsingKey(data.omPin, res.value);
				console.log('pinEncrypted', data.omPin);

				return this.http.post(
					`${endpoint}`,
					payload
				);
			}),
			catchError((err) => {
				return throwError(
					{
						error: {
							message: err?.error?.message
						}
					}
				)
			})
		)
  }

	getEncryptionKey() {
		const encrytionKeyWidoInfos: {value: string, lastUpdate: any} = this.localStorage.getFromLocalStorage(LOCAL_STORAGE_KEYS.ENCRYPTION_KEY_WIDO_BY_OM);
		const hasExpired = !encrytionKeyWidoInfos || Date.now() - encrytionKeyWidoInfos?.lastUpdate > DEFAULT_DATA_CACHE_DURATION
		if(hasExpired ) {
			return this.http.get(`${encryptionKeyEndpoint}`,{
				responseType: 'text',
			}).pipe(
				tap((res: string) => {
					const data : {value: string, lastUpdate: any} = {value: res, lastUpdate: Date.now()}
					this.localStorage.saveToLocalStorage(LOCAL_STORAGE_KEYS.ENCRYPTION_KEY_WIDO_BY_OM, data)
				}),
				catchError((err) => {
					if(encrytionKeyWidoInfos) return of(encrytionKeyWidoInfos);
					return throwError(err);
				})
			);
		}
		return of(encrytionKeyWidoInfos);
	}

	getEncryptionAESUsingKey(value: string, key: string) {
		return CryptoJS.AES.encrypt( value.trim(), CryptoJS.enc.Utf8.parse(key), {
			iv: CryptoJS.enc.Utf8.parse(key),
			keySize: 128,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
	}).toString()
	}
}
