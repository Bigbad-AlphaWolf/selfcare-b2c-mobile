import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { DATA_REQUESTS } from 'src/app/utils/data';
import { HttpClient } from '@angular/common/http';
import { ACCOUNT_REQUESTS_ENDPOINT } from '../utils/account.endpoints';
import { RequestOem } from 'src/app/models/request-oem.model';
import { tap } from 'rxjs/operators';
const REQUESTS_ENDPOINT = '/api/abonné/request/statue/';
@Injectable({
  providedIn: 'root'
})
export class RequestOemService {
  currentRequestStatus : RequestOem [];
  currentRequestStatusId : string;
  constructor(private http : HttpClient) { }

  fetchRequests(phoneFix : string): Observable<RequestOem[]>{
    return of(DATA_REQUESTS);
    // return this.http.get<RequestOem[]>(`${ACCOUNT_REQUESTS_ENDPOINT}?msisdn=${phoneFix}`);
  }

  requestStatus(requestId : string){
    this.currentRequestStatus = DATA_REQUESTS;
    return of(DATA_REQUESTS);
    return this.http.get<RequestOem[]>(`${ACCOUNT_REQUESTS_ENDPOINT}/${requestId}`).pipe(
      tap((r)=>{
        this.currentRequestStatus = r;
      })
    );
  }
}
