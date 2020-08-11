import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';
import { OM_RECENTS_ENDPOINT } from '../utils/om.endpoints';
import { MarchandOem } from '../../models/marchand-oem.model';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ContactsService } from '../contacts-service/contacts.service';
import { CustomContact } from 'src/app/models/customized-contact.model';
import { RecentsOem } from 'src/app/models/recents-oem.model';
import { SERVICES_TO_MATCH_CONTACTS } from '.';

@Injectable({
  providedIn: 'root',
})
export class RecentsService {
  constructor(
    private http: HttpClient,
    private omService: OrangeMoneyService,
    private contactService: ContactsService
  ) {}

  fetchRecents(service: string, numberToDisplay: number) {
    return this.omService.getOmMsisdn().pipe(
      switchMap((omPhonenumber) => {
        return this.http
          .get<MarchandOem[]>(
            `${OM_RECENTS_ENDPOINT}/${omPhonenumber}?service=${service}`
          )
          .pipe(
            switchMap((response: any) => {
              const recents: RecentsOem[] = this.parseRecentsResponse(
                response,
                numberToDisplay
              );
              if (!SERVICES_TO_MATCH_CONTACTS.includes(service))
                return of(recents);
              return this.contactService.getAllContacts().pipe(
                map((contacts: CustomContact[]) => {
                  const res = this.mapRecentsToContacts(recents, contacts);
                  return res;
                }),
                catchError((err) => {
                  console.log('caught error', err);
                  return of(recents);
                })
              );
            })
          );
      })
    );
  }

  parseRecentsResponse(response, numberToDisplay: number) {
    let error: boolean = !(
      response &&
      (response.status_code === 'Success-001' ||
        response.content.data.status === '200')
    );
    if (error) return [];
    const recents: any = response.content.data.historiqueTransactions.slice(
      0,
      numberToDisplay
    );
    return recents.length > 0 ? recents : [];
  }

  mapRecentsToContacts(recents: RecentsOem[], contacts: CustomContact[]) {
    recents.forEach((recent) => {
      const msisdn = recent.destinataire;
      for (let j = 0; j < contacts.length; j++) {
        if (contacts[j].numbers.includes(msisdn)) {
          recent.name = contacts[j].name.formatted;
          break;
        }
      }
    });
    return recents;
  }
}
