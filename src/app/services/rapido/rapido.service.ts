import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RAPIDO_PAYMENT_ENDPOINT, RAPIDO_SOLDE_ENDPOINT } from '../utils/counter.endpoints';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';
import { switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RapidoService {

  constructor(private http: HttpClient,private omServ: OrangeMoneyService) {
  }


  pay(body: any) {
    return this.http.post(RAPIDO_PAYMENT_ENDPOINT, body); 
  }

  getSolde(counterNumber: string) {
    return this.omServ.getOmMsisdn().pipe(switchMap((msisdn: string)=> {
      if(msisdn !== 'error'){
        return this.http.get(RAPIDO_SOLDE_ENDPOINT + `/${msisdn}?cardNum=${counterNumber}`); 
      } else {
        const error = {
          status: 400,
          message: 'Pas de numero OM',
        };
        return throwError(error)
      }
    }))
  }

}
