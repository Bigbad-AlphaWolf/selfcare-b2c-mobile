import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY } from 'src/shared';
import { CategoryPurchaseHistory } from 'src/app/models/category-purchase-history.model';
import { map } from 'rxjs/operators';
import { PurchaseModel } from 'src/app/models/purchase.model';
import { BuyPassUsageModel } from 'src/app/models/buy-pass-usage-payload.model';

const { SERVER_API_URL, CONSO_SERVICE, PURCHASES_SERVICE } = environment;
const listPurchase = `${SERVER_API_URL}/${CONSO_SERVICE}/api/historique-achats`;
const passUsageEndpoint = `${SERVER_API_URL}/${PURCHASES_SERVICE}/api/v1/usage`;

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  constructor(private http: HttpClient) {}

  getAllTransactionByDay(msisdn: string, day: number, filterType?: string) {
    let endpoint = `${listPurchase}/${msisdn}?numberDays=10`;
    if (filterType) {
      endpoint += `&typeAchat=${filterType}`;
    }
    return this.http.get(endpoint).pipe(
      map((response: PurchaseModel[]) => {
        response = response.map((transaction) => {
          transaction.fees =
            transaction.transactionMetadata &&
            transaction.transactionMetadata.a_ma_charge &&
            transaction.transactionMetadata.a_ma_charge === 'true'
              ? +transaction.transactionMetadata.cashout_fees
              : 0;
          return transaction;
        });
        return response;
      })
    );
  }

  filterPurchaseByType(
    listPurchase: PurchaseModel[],
    category: { label: string; typeAchat: string }
  ) {
    if (category.typeAchat) {
      return listPurchase.filter((item: PurchaseModel) => {
        return item.typeAchat === category.typeAchat;
      });
    } else {
      return listPurchase;
    }
  }

  getListCategoryPurchaseHistory(listPurchase: PurchaseModel[]) {
    const categories: CategoryPurchaseHistory[] = [
      DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY,
    ];
    for (const item of listPurchase) {
      const values: CategoryPurchaseHistory = {
        typeAchat: item.typeAchat,
        label: item.typeAchat === 'ALL' ? 'Autres' : item.label,
      };
      if (
        categories.some(
          (value: CategoryPurchaseHistory) => value.typeAchat === item.typeAchat
        )
      ) {
        continue;
      } else {
        categories.push(values);
      }
    }
    return categories;
  }

  getCategoriesAndPurchaseHistory(
    msisdn: string,
    day: number,
    filterType?: string
  ) {
    return this.getAllTransactionByDay(msisdn, day, filterType).pipe(
      map((res: PurchaseModel[]) => {
        const categories = this.getListCategoryPurchaseHistory(res);
        return { categories, listPurchase: res };
      })
    );
  }

  buyPassUsage(payload: BuyPassUsageModel) {
    return this.http.post(passUsageEndpoint, payload);
  }
}
