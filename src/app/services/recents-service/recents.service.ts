import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';
import { OM_RECENTS_ENDPOINT } from '../utils/om.endpoints';
import { MarchandOem } from '../../models/marchand-oem.model';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecentsService {
  constructor(
    private http: HttpClient,
    private omService: OrangeMoneyService
  ) {}

  fetchRecents(service: string) {
    const omPhonenumber = this.omService.getOrangeMoneyNumber();
    return this.http
      .get<MarchandOem[]>(
        `${OM_RECENTS_ENDPOINT}/${omPhonenumber}?service=${service}`
      )
      .pipe(
        map((r: any) => {
          let error: boolean = !(
            r &&
            (r.status_code === 'Success-001' || r.content.data.status === '200')
          );

          if (error) return [];

          const recents: any = r.content.data.historiqueTransactions;
          return recents.length > 0 ? recents : [];
        })
      );
  }
}
