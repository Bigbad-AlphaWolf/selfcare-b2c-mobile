import { Injectable } from '@angular/core';
import { of, from, Observable } from 'rxjs';
import { Contacts } from '@ionic-native/contacts';
import { map, catchError } from 'rxjs/operators';
import { formatPhoneNumber } from 'src/shared';
import { Platform } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
declare var navigator: any

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  public static allContacts: any[];
  mockContactsProcessed = [
    {
      name: {
        familyName: 'KEBE',
        givenName: 'Papa Abdoulaye',
        formatted: 'Papa Abdoulaye KEBE',
      },
      phoneNumbers: ['776148081'],
    },
    {
      name: {
        familyName: 'DIOP',
        givenName: 'Abdoul Karim',
        formatted: 'Abdoul Karim DIOP',
      },
      phoneNumbers: ['781210942'],
    },
    {
      name: {
        familyName: 'KEBE',
        givenName: 'Aminata',
        formatted: 'Aminata KEBE',
      },
      phoneNumbers: ['777559155', '775109027'],
    },
  ];
  mockContacts = [
    {
      name: { familyName: 'string', formatted: 'TEST 1', givenName: 'string' },
      phoneNumbers: [{ value: '781210942' }],
    },
    {
      name: { familyName: 'string', formatted: 'TEST 2', givenName: 'string' },
      phoneNumbers: [{ value: '776148081' }],
    },
    {
      name: { familyName: 'string', formatted: 'TEST 3', givenName: 'string' },
      phoneNumbers: [{ value: '781040956' }],
    },
  ];
  constructor(private contacts: Contacts, private diagnostic: Diagnostic) {}

  getAllContacts(): Observable<any> {
    if (ContactsService.allContacts) {
      return of(ContactsService.allContacts);
    }
    return from(
      this.getAll()
    ).pipe(
      map((contacts: any[]) => {
        console.log("our result", contacts);
        const result = contacts.map(({ displayName, phoneNumbers, ...left }) => {
          if (phoneNumbers) {
            const numbers = phoneNumbers.map((element) => {
              return formatPhoneNumber(element.number);
            });
            console.log({ displayName, numbers });
            return { displayName, numbers };
          }
          return { displayName, numbers: [] };
        });
        ContactsService.allContacts = result;
        console.log(result);

        return result;
      }),
      catchError((err) => {
        return of([]);
      })
    );
  }

  getAll() {
    return new Promise<any[]>((resolve, reject) => {
      navigator.contactsPhoneNumbers.list((contacts: any[]) => {
        console.log(contacts);
        resolve(contacts)
      })
    })
  }
}
