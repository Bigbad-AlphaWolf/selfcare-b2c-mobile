import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ACCOUNT_REQUESTS_ENDPOINT, ACCOUNT_REQUESTS_STATUS_ENDPOINT, CREATE_REQUESTS_DEMANDE_ENDPOINT } from '../utils/account.endpoints';
import { RequestOem } from 'src/app/models/request-oem.model';
import { tap } from 'rxjs/operators';
import { CreateRequestOem } from 'src/app/models/create-request-oem.model';
@Injectable({
  providedIn: 'root',
})
export class RequestOemService {
  currentRequestStatus: RequestOem[];
  currentRequestStatusId: string;
  constructor(private http: HttpClient) {}

  fetchRequests(phoneFix: string): Observable<RequestOem[]> {
    // return of(DATA_REQUESTS);
    return this.http.get<RequestOem[]>(`${ACCOUNT_REQUESTS_ENDPOINT}?msisdn=${phoneFix}`);
  }

  requestStatus(requestId: string) {
    // this.currentRequestStatus = DATA_REQUESTS;
    // return of(DATA_REQUESTS);
    return this.http.get<RequestOem[]>(`${ACCOUNT_REQUESTS_STATUS_ENDPOINT}/${requestId}`).pipe(
      tap(r => {
        this.currentRequestStatus = r.sort((r1, r2) => r1.order - r2.order);
      })
    );
  }

  createRequestOrDerangement(data: CreateRequestOem) {
    return this.http.post(`${CREATE_REQUESTS_DEMANDE_ENDPOINT}/${data?.msisdn}`, data);
  }
}
