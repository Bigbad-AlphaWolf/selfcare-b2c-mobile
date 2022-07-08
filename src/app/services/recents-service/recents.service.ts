import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';
import { OM_RECENTS_ENDPOINT } from '../utils/om.endpoints';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CustomContact } from 'src/app/models/customized-contact.model';
import { RecentsOem } from 'src/app/models/recents-oem.model';
import { OM_RECENT_TYPES } from 'src/app/utils/constants';
import { of } from 'rxjs';
import { SERVICES_TO_MATCH_CONTACTS } from '.';
import { ContactsService } from '../contacts-service/contacts.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class RecentsService {
  constructor(
    private http: HttpClient,
    private omService: OrangeMoneyService,
    private contactService: ContactsService,
    private platform: Platform
  ) {
    console.log(this.platform.is('mobileweb'));
  }

  recentType(opType: string) {
    let recentType = OM_RECENT_TYPES.find(
      (rt: any) => rt.operationType === opType
    );
    return recentType ? recentType.recentType : '';
  }

  fetchRecents(op: string, numberToDisplay: number) {
    let service = this.recentType(op);
    return this.omService.getOmMsisdn().pipe(
      switchMap((omPhonenumber) => {
        return this.http
          .get(
            `${OM_RECENTS_ENDPOINT}/${omPhonenumber.trim()}?service=${service}`
          )
          .pipe(
            switchMap((response: any) => {
              const recents: RecentsOem[] = this.parseRecentsResponse(
                response,
                numberToDisplay
              );
              if (this.platform.is('mobileweb')) {
                return of(recents);
              }
              // if (!SERVICES_TO_MATCH_CONTACTS.includes(service))
              return this.contactService.getAllContacts().pipe(
                map((contacts: CustomContact[]) => {
                  const res = this.mapRecentsToContacts(recents, contacts);
                  return res;
                }),
                catchError((err) => {
                  console.log('caught error', err);
                  return recents;
                })
              );
            }),
            catchError((err) => {
              return of([]);
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
    let recents: any = response.content.data.historiqueTransactions;
    recents =
      recents.length > 0
        ? recents.sort((r1, r2) => {
            if (r1.date > r2.date) return -1;
            if (r1.date < r2.date) return 1;
            return 0;
          })
        : [];
    return recents.slice(0, numberToDisplay);
  }

  mapRecentsToContacts(recents: RecentsOem[], contacts: CustomContact[]) {
    recents.forEach((recent) => {
      const msisdn = recent.destinataire;
      for (let contact of contacts) {
        if (this.checkContactNumbersContainsMsisdn(contact.numbers, msisdn)) {
          recent.name = contact.displayName;
          break;
        }
      }
    });
    return recents;
  }

  checkContactNumbersContainsMsisdn(numbers: string[], msisdn) {
    const nums = [];
    for (let number of numbers) {
      let num;
      switch (true) {
        case number.startsWith('+221'):
          num = number.substring(4);
          break;
        case number.startsWith('221'):
          num = number.substring(3);
          break;
        case number.startsWith('00221'):
          num = number.substring(5);
          break;
        default:
          num = number;
          break;
      }
      nums.push(num);
    }
    //console.log(nums);
    return nums.includes(msisdn);
  }
}
