import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BoosterModel, BoosterTrigger } from '../models/booster.model';
const { SERVER_API_URL, BOOSTER_SERVICE } = environment;
const boostersEndpoint = `${SERVER_API_URL}/${BOOSTER_SERVICE}/api/boosters/active-boosters`;
const boosterTransactionEndpoint = `${SERVER_API_URL}/${BOOSTER_SERVICE}/api/boosters/booster-promo-transaction`;

@Injectable({
  providedIn: 'root',
})
export class BoosterService {
  static lastBoostersList: BoosterModel[] = [];
  constructor(private http: HttpClient) {}

  getBoosters(boosterPayload: {
    trigger: BoosterTrigger;
    codeFormuleRecipient?: string;
    msisdn?: string;
  }): Observable<BoosterModel[]> {
    let url = boosterPayload.trigger
      ? boostersEndpoint +
        `?trigger=${boosterPayload.trigger}&msisdn=${boosterPayload.msisdn}&code=${boosterPayload.codeFormuleRecipient}`
      : boostersEndpoint;
    return this.http.get(url).pipe(
      map((res: BoosterModel[]) => {
        return res;
      })
    );
  }

  getCoupon(recipientMsisdn: string, boosterId: number) {
    return this.http
      .get(
        `${boosterTransactionEndpoint}?msisdn=${recipientMsisdn}&boosterId=${boosterId}`
      )
      .pipe(
        map((res: any) => {
          if (
            res &&
            res.transactionDetails &&
            res.transactionDetails.transactionValue
          ) {
            return res.transactionDetails.transactionValue;
          }
          return null;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }
}
