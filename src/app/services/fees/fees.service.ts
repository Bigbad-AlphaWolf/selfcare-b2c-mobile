import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { FeeModel } from '../orange-money-service';
import { FEES_ENDPOINT } from '../utils/counter.endpoints';

@Injectable({
	providedIn: 'root',
})
export class FeesService {
	fees: any;
	feesIncludes: any;

	constructor(private http: HttpClient, private dashbServ: DashboardService) {}

	parseFees(feesObj) {
		let result = {};
		Object.keys(feesObj).forEach((service) => {
			if (feesObj[service]) result[service] = this.toIncludesFees(feesObj[service]);
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
		let fee = fees.find((fee) => amount >= +fee.montant_min && amount <= +fee.montant_max);
		return fee.tarif;
	}

	getFeesByOMService(service: string, receiver?: string) {
		const msisdn = this.dashbServ.getCurrentPhoneNumber();
		if (!receiver) {
			receiver = msisdn;
		}
		return this.http.get(`${FEES_ENDPOINT}/${receiver}?msisdn=${msisdn}&service-code=${service}`).pipe(
			map((fees: FeeModel[]) => {
				return fees;
			})
		);
	}

	extractFeeWhenFeeIncluded(amount: number, feesArray: FeeModel[]) {
		for (const fees of feesArray) {
			if (amount >= fees.min + fees.effective_fees && amount <= fees.max + fees.effective_fees) {
				return fees;
			}
		}
		return 0;
	}

	extractFees( fees: FeeModel[], amount: number, feeIncluded?: boolean ) {
		 for (let fee of fees) {
		   if (!feeIncluded) {
			   if(amount >= +fee.min && amount <= +fee.max) {
				   if(fee.mode_calcul === 'fixe') {
					   return fee;
				   } else if(fee.mode_calcul === 'pourcent') {
						const computedFee = { effective_fees :amount * (Math.trunc(fee.effective_fees / 100))}
						return computedFee;
				   }
			   }
		   } else if (feeIncluded) {
			   if(amount >= fee.min + fee.effective_fees && amount <= fee.max + fee.effective_fees) {
					return fee
			   }
		   }
		 }
		  return { effective_fees: null }
	  }
}
