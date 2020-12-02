import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  FEES,
  FEES_INCLUDES,
  WOYOFAL_DEFAULT_FEES,
  WOYOFAL_DEFAULT_FEES_INCLUDES,
} from 'src/app/utils/bills.util';
import { FEES_ENDPOINT } from '../utils/counter.endpoints';

@Injectable({
  providedIn: 'root',
})
export class FeesService {
  fees: any;
  feesIncludes: any;

  constructor(private http: HttpClient) {}

  async initFees(msisdn: any) {
    if (!(this.fees && this.feesIncludes))
      await this.http
        .get(`${FEES_ENDPOINT}/?msisdn=${msisdn}`)
        .pipe(
          map((r: any) => {
            if (!(r && r.paliers[0])) return null;

            this.fees = r.paliers[0];
            this.feesIncludes = this.parseFees(this.fees);
          }),
          catchError((err) => {
            this.fees = FEES;
            this.feesIncludes = FEES_INCLUDES;
            return of(this.fees);
          })
        )
        .toPromise();
  }

  parseFees(feesObj) {
    let result = {};
    Object.keys(feesObj).forEach((service) => {
      if (feesObj[service])
        result[service] = this.toIncludesFees(feesObj[service]);
    });
    return result;
  }

  toIncludesFees(fees: any[]): any[] {
    let results = [];
    let prev: any;
    fees.forEach((ell) => {
      let el = { ...ell };
      el.montant_min += prev ? prev.tarif : el.tarif;
      el.montant_max += el.tarif;
      results.push(el);
      prev = el;
    });

    return results;
  }

  findAmountFee(amount: number, service: string, includeFee?: boolean) {
    let fees = includeFee ? this.feesIncludes[service] : this.fees[service];
    let fee = fees.find(
      (fee) => amount >= +fee.montant_min && amount <= +fee.montant_max
    );
    return fee.tarif;
  }
}
