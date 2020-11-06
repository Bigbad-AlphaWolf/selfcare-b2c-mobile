import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DATA_OFFRES_SERVICES } from 'src/app/utils/data';
import { OFFRE_SERVICES_ENDPOINT } from '../utils/services.endpoints';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  offresServices : any [];
  
  constructor(private http: HttpClient) { }

  initServicesData(codeFormule?: string) {
    let endpointOffresServices = OFFRE_SERVICES_ENDPOINT;
    if(codeFormule) {
      endpointOffresServices += `/${codeFormule}?typeResearch=FORMULE`
    }
    return this.http.get(endpointOffresServices).pipe(
      map((r: any[])=>{
        this.offresServices = r;
      })
    );
  }

  sortByOrdre(arr:any[]){
    return arr.sort((r1, r2) =>r1.ordre - r2.ordre);
  }
}
