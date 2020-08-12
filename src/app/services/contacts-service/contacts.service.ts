import { Injectable } from '@angular/core';
import { of, from, Observable, throwError } from 'rxjs';
import { Contacts, Contact } from '@ionic-native/contacts';
import { map, catchError } from 'rxjs/operators';
import { formatPhoneNumber } from 'src/shared';

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
  constructor(private contacts: Contacts) {}

  getAllContacts(): Observable<any> {
    // return of(this.mockContactsProcessed);
    if (ContactsService.allContacts) {
      return of(ContactsService.allContacts);
    }
    // return from(
    //   this.contacts.find(['displayName', 'name', 'phoneNumbers', 'emails'], {
    //     filter: '',
    //     multiple: true,
    //   })
    // )
    return of(this.mockContacts).pipe(
      map((contacts: any[]) => {
        const result = contacts.map(({ name, phoneNumbers, ...left }) => {
          const numbers = phoneNumbers.map((element) => {
            return formatPhoneNumber(element.value);
          });
          return { name, numbers };
        });
        ContactsService.allContacts = result;
        return result;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
