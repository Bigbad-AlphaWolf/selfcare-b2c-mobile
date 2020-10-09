import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RAPIDO_PAYMENT_ENDPOINT } from '../utils/counter.endpoints';

@Injectable({
  providedIn: 'root'
})
export class RapidoService {

  constructor(private http: HttpClient) {
  }


  pay(body: any) {
    return this.http.post(RAPIDO_PAYMENT_ENDPOINT, body); 
  }

}
