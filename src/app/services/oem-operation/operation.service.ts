import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { DATA_OFFRES_SERVICES } from 'src/app/utils/data';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  offresServices : any [];
  
  constructor(private http: HttpClient) { }

  initData() {
    this.offresServices = DATA_OFFRES_SERVICES;
    return of(DATA_OFFRES_SERVICES);
    this.http.get('');
  }
}
