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
    let result = {
      content: {
        data: {
          message: 'Success',
          status: '200',
          historiqueTransactions: [
            {
              date: '2020-06-12T11:48:35.793',
              description: 'Paiement marchand effectué',
              status: 'effectué',
              msisdn: '782363572',
              channel: 'mobile',
              payload:
                '{“last_update“:“2020-06-12T11:48:35.792“,“code_marchand“:“369942“,“current_balance“:12270}',
              titre: 'Paiement marchand',
              operation: 'Paiement marchand',
              statusCode: 'TS',
              direction: null,
              type_transaction: 'paiement_marchand',
              destinataire: '369942',
              montant: 1.0,
              txnid: 'MP200612.1148.C55514',
              fees: 0.0,
              montant_total: null,
              label_destinataire: null,
              icone_url: null,
            },
            {
              date: '2020-06-02T11:06:15.651',
              description: 'Paiement marchand effectué',
              status: 'effectué',
              msisdn: '782363572',
              channel: 'mobile',
              payload:
                '{“nom_marchand“:“AUCHAN“,“last_update“:“2020-06-02T11:06:15.650“,“code_marchand“:“218705“,“current_balance“:27205}',
              titre: 'Paiement marchand',
              operation: 'Paiement marchand',
              statusCode: 'TS',
              direction: null,
              type_transaction: 'paiement_marchand',
              destinataire: '218705',
              montant: 1.0,
              txnid: 'MP200602.1106.A37569',
              fees: 0.0,
              montant_total: null,
              label_destinataire: null,
              icone_url: null,
            },
          ],
        },
      },
      act_app_vers: 'v1.0',
      act_conf_vers: 'v1.0',
      status_code: 'Success-001',
      status_wording: 'Transaction successfuls',
      conf_string: null,
      nb_notif: 0,
    };
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
        }),
        catchError((_) => {
          return of(result.content.data.historiqueTransactions);
        })
      );
  }
}
