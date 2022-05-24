import { Injectable } from '@angular/core';
import { of, from, Observable } from 'rxjs';
import { Contacts } from '@ionic-native/contacts';
import {
  map,
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { formatPhoneNumber, REGEX_NUMBER_OM } from 'src/shared';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { ContactOem } from 'src/app/models/contact-oem.model';
import { getCountryInfos } from 'src/app/utils/utils';
declare var navigator: any;

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

  getAllContacts(refresh?: boolean): Observable<any> {
    if (ContactsService.allContacts && !refresh) {
      return of(ContactsService.allContacts);
    }
    return from(this.getAll()).pipe(
      map((contacts: any[]) => {
        console.log('our result', contacts);
        const result = contacts.map(
          ({ displayName, phoneNumbers, thumbnail, ...left }) => {
            if (phoneNumbers) {
              const numbers = phoneNumbers.map(element => {
                return formatPhoneNumber(element.number);
              });
              console.log({ displayName, numbers, thumbnail });
              return { displayName, numbers, thumbnail };
            }
            return { displayName, thumbnail, numbers: [] };
          }
        );
        ContactsService.allContacts = result;
        console.log(result);

        return result;
      }),
      catchError(err => {
        if (ContactsService.allContacts) return of(ContactsService.allContacts);
        return of([]);
      })
    );
  }

  getAll() {
    return new Promise<any[]>((resolve, reject) => {
      navigator.contactsPhoneNumbers.list((contacts: any[]) => {
        console.log(contacts);
        resolve(contacts);
      });
    });
  }

  searchTermChanged(terms: Observable<string>, formattedContact: ContactOem[]) {
    return terms.pipe(
      debounceTime(600),
      switchMap(term => {
        if (term.length) {
          return of(this.searchOnContacts(term, formattedContact));
        } else {
          return of(formattedContact);
        }
      })
    );
  }

  searchOnContacts(term: string, formattedContact: ContactOem[]) {
    // remove accent on accentued caracter. Ex: replace ètre by etre
    const termWithoutAccent = term
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    let result = formattedContact.filter(item => {
      return (
        item.displayName.toLowerCase().includes(term.toLowerCase()) ||
        item.displayName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .includes(termWithoutAccent) ||
        item.phoneNumber.toLowerCase().includes(termWithoutAccent.toLowerCase())
      );
    });
    if (!result.length && REGEX_NUMBER_OM.test(term)) {
      const item: ContactOem = {
        displayName: '',
        phoneNumber: term,
        formatedPhoneNumber: term,
        country: getCountryInfos(term),
      };
      return [item];
    }
    return result;
  }
}
