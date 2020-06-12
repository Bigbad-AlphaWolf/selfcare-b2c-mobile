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
  fees: any[] = [];
  constructor(private http: HttpClient) {
    this.initFees();
  }

  fetchRecentsCounters() {
    return this.http.get<CounterOem[]>(COUNTER_RECENTS_COUNTER_ENDPOINT);
  }

  // fetchFavoritesCounters(typeFavoris:string) {
  //   let result = {
  //     content: {
  //       data: {
  //         message: "SUCCESS",
  //         status: "200",
  //         type_favoris: [
  //           {
  //             label: "compteur",
  //             liste_favoris: [
               
  //               {
  //                 service_code: "WOYOFAL",
  //                 ref_num: "14254564108",
  //                 ref_label: "Woyofal Scatt",
  //                 creation_gen_id: "781210942235046",
  //               },
  //               {
  //                 service_code: "WOYOFAL",
  //                 ref_num: "14254564108",
  //                 ref_label: "Kebe Ab",
  //                 creation_gen_id: "781210942235046",
  //               },
               
  //               {
  //                 service_code: "WOYOFAL",
  //                 ref_num: "14254564108",
  //                 ref_label: "Karim Messi",
  //                 creation_gen_id: "781210942235046",
  //               },
               
               
  //             ],
  //           }
         
  //         ],
  //       },
  //     },
  //     act_app_vers: "v1.0",
  //     act_conf_vers: "v1.0",
  //     status_code: "Success-001",
  //     status_wording: "Transaction successfuls",
  //     conf_string: null,
  //     nb_notif: 0,
  //   };
  //   return this.http.get<CounterOem[]>(`${COUNTER_FAVORITES_COUNTER_ENDPOINT}/${typeFavoris}`).pipe(
  //     map((r:any)=>{
  //       if(!(r && (r.status_code === 'Success-001' || r.content.data.status === '200'))) 
  //         return [];

  //       let typeFavoris :any= r.content.data.type_favoris;
  //       return typeFavoris.length >0? typeFavoris.liste_favoris[0].liste_favoris : [];
  //   }),
  //   catchError(_=>of(result))
  //   );
  // }

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
    this.fees = await this.http
      .get(`${COUNTER_FEES_ENDPOINT}/?msisdn=782363572`)
      .pipe(
        map((r) => {
          console.log(r);
        }),
        catchError((_) => of(WOYOFAL_DEFAULT_FEES))
      )
      .toPromise();
  }

  findAmountFee(amount: number) {
    let fee = this.fees.find(
      (fee) => amount >= +fee.montant_min && amount <= +fee.montant_max
    );
    return fee.tarif;
  }
}
