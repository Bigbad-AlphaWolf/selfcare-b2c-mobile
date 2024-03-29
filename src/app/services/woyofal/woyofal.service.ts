import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CounterOem } from 'src/app/models/counter-oem.model';
import {
	WOYOFAL_RECENTS_COUNTER_ENDPOINT,
	WOYOFAL_PAYMENT_ENDPOINT,
} from '../utils/counter.endpoints';

@Injectable( {
	providedIn: 'root',
} )
export class WoyofalService {
	// fees: any[] = WOYOFAL_DEFAULT_FEES;
	// feesIncludes: any[] = WOYOFAL_DEFAULT_FEES_INCLUDES;

	constructor( private http: HttpClient ) {
		// this.initFees();
	}

	fetchRecentsCounters() {
		return this.http.get<CounterOem[]>( WOYOFAL_RECENTS_COUNTER_ENDPOINT );
	}

	pay( body: any ) {
		return this.http.post( WOYOFAL_PAYMENT_ENDPOINT, body );
	}

	// async initFees(msisdn: any) {
	//   await this.http
	//     .get(`${COUNTER_FEES_ENDPOINT}/?msisdn=${msisdn}`)
	//     .pipe(
	//       map((r: any) => {
	//         if (!(r && r.paliers[0].woyofal.length > 0)) return null;

	//         this.fees = r.paliers[0].woyofal;
	//         this.feesIncludes = this.parseToIncludesFees(this.fees);
	//       })
	//     )
	//     .toPromise();
	// }
	parseToIncludesFees( fees: any[] ): any[] {
		let results = [];
		let prev: any;
		fees.forEach( ( ell ) => {
			let el = { ...ell };
			el.montant_min += prev ? prev.tarif : el.tarif;
			el.montant_max += el.tarif;
			results.push( el );
			prev = el;
		} );

		return results;
	}

	// findAmountFee(amount: number, includeFee?: boolean) {
	//   let fees = includeFee ? this.feesIncludes : this.fees;
	//   let fee = fees.find(
	//     (fee) => amount >= +fee.montant_min && amount <= +fee.montant_max
	//   );
	//   return fee.tarif;
	// }
}
