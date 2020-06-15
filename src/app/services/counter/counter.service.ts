import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CounterOem } from "src/app/models/counter-oem.model";
import {
  COUNTER_RECENTS_COUNTER_ENDPOINT,
  COUNTER_PAYMENT_ENDPOINT,
  COUNTER_FEES_ENDPOINT,
} from "../utils/counter.endpoints";
import { catchError, map } from "rxjs/operators";
import { of } from "rxjs";
import { WOYOFAL_DEFAULT_FEES } from "src/app/utils/bills.util";

@Injectable({
  providedIn: "root",
})
export class CounterService {
  fees: any[] = WOYOFAL_DEFAULT_FEES;
  feesIncludes: any[] = WOYOFAL_DEFAULT_FEES;

  constructor(private http: HttpClient) {
    this.initFees();
  }

  fetchRecentsCounters() {
    return this.http.get<CounterOem[]>(COUNTER_RECENTS_COUNTER_ENDPOINT);
  }

  pay(body: any) {
    let result = {
      act_app_vers: "string",
      act_conf_vers: "string",
      conf_string: "string",
      content: {
        data: {
          available_credit: "string",
          code_woyofal: "26492313076595740952",
          current_balance: "string",
          date_time: "string",
          last_update: "string",
          message: "string",
          montant_recharge: "string",
          numero_compteur: "string",
          status_code: "Success",
          txn_id: "string",
          unique_number: "string",
          valeur_recharge: 109,
        },
      },
      nb_notif: 0,
      status_code: "Success",
      status_wording: "string",
    };
    // return of(result);
    return this.http.post(COUNTER_PAYMENT_ENDPOINT, body).pipe(
      catchError(_=>of(result)),
    );
  }

  async initFees() {
    await this.http
      .get(`${COUNTER_FEES_ENDPOINT}/?msisdn=782363572`)
      .pipe(
        map((r:any) => {
          // console.log('io', r.paliers[0].woyofal);
          if(!(r && r.length>0)) return null;
          this.fees = r.paliers[0].woyofal;
          this.feesIncludes = this.parseToIncludesFees(r.paliers[0].woyofal);
        }),
      )
      .toPromise();
  }
  parseToIncludesFees(fees: any[]): any[] {
    
    let results = [];
    let prev:any;
    fees.forEach((el) => {
      if(prev)
        el.montant_min = el.montant_min + prev.tarif;
      el.montant_max = el.montant_max + el.tarif;
      results.push(el);
      prev = el;
    });
    console.log(results);
    
    return results;
  }

  findAmountFee(amount: number, includeFee?:boolean) {
    let fees = includeFee?this.feesIncludes:this.fees;
    let fee = fees.find(
      (fee) => amount >= +fee.montant_min && amount <= +fee.montant_max
    );
    return fee.tarif;
  }
}
