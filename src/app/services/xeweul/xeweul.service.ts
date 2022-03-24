import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
    XEWEUL_PAYMENT_ENDPOINT,
    XEWEUL_PATH,
} from '../utils/counter.endpoints';

import {OrangeMoneyService} from '../orange-money-service/orange-money.service';
import {map, switchMap} from 'rxjs/operators';
import {throwError, Observable} from 'rxjs';
import {IXeweulCard} from '../../models/xeweul/card.model';
import {IXeweulBalance} from '../../models/xeweul/xeweul-balance.model';

export type EntityResponseType = HttpResponse<IXeweulCard>;
export type EntityArrayResponseType = HttpResponse<IXeweulCard[]>;

@Injectable({
    providedIn: 'root',
})
export class XeweulService {

     protected resourceUrl = XEWEUL_PATH;


    constructor(private http: HttpClient, private omServ: OrangeMoneyService) {
    }

    chargeCard(body: any, confirmPayload?) {
        const queryParams = confirmPayload?.txnId
            ? `?txnId=${confirmPayload?.txnId}`
            : '';
        return this.http.post(`${XEWEUL_PAYMENT_ENDPOINT}/${body.msisdn}/charge${queryParams}`, body).pipe(
            map(() => {
                const mappedOmResponse = {
                    content: {
                        data: {
                            status_code: '200',
                        },
                    },
                    status_code: 'Success-001',
                };
                return mappedOmResponse;
            })
        );
    }

    getSolde(counterNumber: string): Observable<HttpResponse<IXeweulBalance>> {
        return this.omServ.getOmMsisdn().pipe(
            switchMap((msisdn: string) => {
                if (msisdn === 'error') {
                    const error = {
                        status: 400,
                        message: 'Pas de numero OM',
                    };
                    return throwError(error);
                }
                return this.http.get<IXeweulBalance>(
                    `${this.resourceUrl}/cards/${msisdn.trim()}/balance?cardNum=${counterNumber}`, {observe: 'response'}
                );
            })
        );
    }

    favoritesByService(): Observable<IXeweulCard[]> {
        return this.omServ.getOmMsisdn().pipe(
             switchMap(omPhonenumber => {
                 console.log('appel favoritesByService');
                 console.log(`${this.resourceUrl}/cards/${omPhonenumber.trim()}/list`);
                 console.log('appel favoritesByService');
                 return this.http.get<IXeweulCard[]>(`${this.resourceUrl}/cards/${omPhonenumber.trim()}/list`);
             })
         );
    }
}
