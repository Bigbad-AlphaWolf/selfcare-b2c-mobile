import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
    XEWEUL_SOLDE_ENDPOINT,
    XEWEUL_PAYMENT_ENDPOINT,
    XEWEUL_PATH_LOCAL,
} from '../utils/counter.endpoints';

const {OM_SERVICE, SERVER_API_URL, LOCAL_OM} = environment;
import {OrangeMoneyService} from '../orange-money-service/orange-money.service';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import {of, throwError, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {IXeweulCard} from '../../models/xeweul/card.model';
import {IXeweulBalance} from '../../models/xeweul/xeweul-balance.model';

export type EntityResponseType = HttpResponse<IXeweulCard>;
export type EntityArrayResponseType = HttpResponse<IXeweulCard[]>;

@Injectable({
    providedIn: 'root',
})
export class XeweulService {

     protected resourceUrl = SERVER_API_URL + '/' + OM_SERVICE;
    // protected resourceUrl = XEWEUL_PATH_LOCAL;


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

    favoritesByService(): Observable<EntityArrayResponseType> {
        return this.http.get<IXeweulCard[]>(`${this.resourceUrl}/cards/782363572/list`, {observe: 'response'});
        /* return this.omServ.getOmMsisdn().pipe(
             switchMap(omPhonenumber => {
                 console.log('appel favoritesByService');
                 console.log(`${this.resourceUrl}/cards/${omPhonenumber.trim()}/list`);
                 console.log('appel favoritesByService');
                 return this.http.get<IXeweulCard[]>(`${this.resourceUrl}/cards/${omPhonenumber.trim()}/list`, {observe: 'response'});
             })
         );*/
    }
}
