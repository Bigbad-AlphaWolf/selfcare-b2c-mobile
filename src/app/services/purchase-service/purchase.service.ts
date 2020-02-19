import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const { SERVER_API_URL ,CONSO_SERVICE } = environment;
const listPurchase = `${SERVER_API_URL}/${CONSO_SERVICE}/api/historique-achats/by-msisdn/days`;

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http: HttpClient) { }

  getAllTransactionByDay(msisdn: string, day: number, filterType?: string) {
    let endpoint = `${listPurchase}?msisdn=${msisdn}&numberDays=${day}`;
    if(filterType){
      endpoint += `&typeAchat=${filterType}`
    }
    return this.http.get(endpoint);
}
}
