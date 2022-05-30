import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { OM_LABEL_SERVICES } from 'src/app/utils/bills.util';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { FeeModel } from '../orange-money-service';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';
import { FEES_ENDPOINT } from '../utils/counter.endpoints';

@Injectable({
  providedIn: 'root',
})
export class FeesService {
  fees: any;
  feesIncludes: any;
  constructor(
    private http: HttpClient,
    private dashbServ: DashboardService,
    private orangeMoneyService: OrangeMoneyService
  ) {}

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

  getFeesByOMService(service: string, receiver?: string) {
    return this.orangeMoneyService.getOmMsisdn().pipe(
      switchMap((omMsisdn: string) => {
        if (!receiver) {
          receiver = omMsisdn;
        }
        return this.http
          .get(
            `${FEES_ENDPOINT}/${receiver}?msisdn=${omMsisdn}&service-code=${service}`
          )
          .pipe(
            map((fees: FeeModel[]) => {
              if (
                service === OM_LABEL_SERVICES.TAF ||
                service === OM_LABEL_SERVICES.TRANSFERT_AVEC_CODE
              ) {
                fees = fees.map((fee) => {
                  fee.effective_fees = fee.transfer_fees;
                  return fee;
                });
              }
              console.log(fees);

              return fees;
            })
          );
      })
    );
  }

  extractFeeWhenFeeIncluded(amount: number, feesArray: FeeModel[]) {
    for (const fees of feesArray) {
      if (
        amount >= fees.min + fees.effective_fees &&
        amount <= fees.max + fees.effective_fees
      ) {
        return fees;
      }
    }
    return 0;
  }

  extractFees(fees: FeeModel[], amount: number, feeIncluded?: boolean) {
    for (let fee of fees) {
      if (!feeIncluded) {
        if (amount >= +fee.min && amount <= +fee.max) {
          if (fee.mode_calcul === 'fixe') {
            return fee;
          } else if (fee.mode_calcul === 'pourcent') {
            const computedFee = fee;
            computedFee.percentFeesValue = fee.effective_fees;
            computedFee.effective_fees = Math.round(amount * fee.effective_fees) / 100;
            return computedFee;
          }
        }
      } else if (feeIncluded) {
        if (
          amount >= fee.min + fee.effective_fees &&
          amount <= fee.max + fee.effective_fees
        ) {
          return fee;
        }
      }
    }
    return { effective_fees: null };
  }

  extractSendingFeesTransfertOM(fees: FeeModel[], amount: number) {
    for (let fee of fees) {
      if (amount >= +fee.min && amount <= +fee.max) {
        const effective_fees =
          fee.mode_calcul === 'fixe'
            ? fee.effective_fees
            : Math.round(amount * fee.effective_fees) / 100;
        const old_fees =
          fee.old_mode_calcul === 'fixe'
            ? fee.old_fees
            : Math.round(amount * fee.old_fees) / 100;
        const cashout_fees =
          fee.mode_calcul === 'fixe'
            ? fee.cashout_fees
            : Math.round(amount * fee.cashout_fees) / 100;
        const computedFee = { effective_fees, old_fees, cashout_fees };
        return computedFee;
      }
    }
    return { effective_fees: null, old_fees: null, cashout_fees: null };
  }
}
