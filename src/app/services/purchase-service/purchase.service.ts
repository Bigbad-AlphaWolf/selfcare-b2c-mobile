import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PurchaseModel } from 'src/shared';
import { of } from 'rxjs';

const { SERVER_API_URL ,CONSO_SERVICE } = environment;
const listPurchase = `${SERVER_API_URL}/${CONSO_SERVICE}/api/historique-achats`;

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  constructor(private http: HttpClient) { }

  getAllTransactionByDay(msisdn: string, day: number, filterType?: string) {
    let endpoint = `${listPurchase}/${msisdn}?numberDays=${day}`;
    if(filterType){
      endpoint += `&typeAchat=${filterType}`
    }
    return this.http.get(endpoint);
}

  filterPurchaseByType(listPurchase: PurchaseModel[],typeAchat:{nom: string, value: string}){
    if(typeAchat.value){
      return listPurchase.filter((item: PurchaseModel)=>{
        return item.typeAchat === typeAchat.value;
      })
    }else {      
      return listPurchase;
    }
  }
}
