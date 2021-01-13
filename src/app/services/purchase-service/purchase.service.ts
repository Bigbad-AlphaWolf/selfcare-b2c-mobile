import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY } from 'src/shared';
import { CategoryPurchaseHistory } from 'src/app/models/category-purchase-history.model';
import { map } from 'rxjs/operators';
import { PurchaseModel } from 'src/app/models/purchase.model';

const { SERVER_API_URL, CONSO_SERVICE } = environment;
const listPurchase = `${SERVER_API_URL}/${CONSO_SERVICE}/api/historique-achats`;

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
 constructor(private http: HttpClient) {}

  getAllTransactionByDay(msisdn: string, day: number, filterType?: string) {
    let endpoint = `${listPurchase}/${msisdn}?numberDays=${day}`;
    if (filterType) {
      endpoint += `&typeAchat=${filterType}`;
    }
    return this.http.get(endpoint);
  }

  filterPurchaseByType(listPurchase: PurchaseModel[], category: { label: string; typeAchat: string }) {
    if (category.typeAchat) {
      return listPurchase.filter((item: PurchaseModel) => {
        return item.typeAchat === category.typeAchat;
      });
    } else {
      return listPurchase;
    }
  }

  getListCategoryPurchaseHistory(listPurchase :PurchaseModel[]){
    const categories: CategoryPurchaseHistory[] = [DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY]
    for (const item of listPurchase) {
      const values: CategoryPurchaseHistory = {typeAchat: item.typeAchat, label: item.label}
      if( categories.some((value: CategoryPurchaseHistory) => value.typeAchat === item.typeAchat )){
        continue
      }else {
        categories.push(values)
      }
    }
    return categories;
  }

  getCategoriesAndPurchaseHistory(msisdn: string, day: number, filterType?: string){
    return this.getAllTransactionByDay(msisdn,day, filterType).pipe(map((res: PurchaseModel[])=> {
      const categories =  this.getListCategoryPurchaseHistory(res);
      return { categories, listPurchase: res }
    }));
  }
}
