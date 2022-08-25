import { Injectable } from '@angular/core';
import { of, from, Observable } from 'rxjs';
import {
  map,
  catchError,
  debounceTime,
  switchMap,
} from 'rxjs/operators';
import { formatPhoneNumber, REGEX_NUMBER_OM } from 'src/shared';
import { ContactOem } from 'src/app/models/contact-oem.model';
import { getCountryInfos } from 'src/app/utils/utils';
declare var navigator: any;

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  public static allContacts: any[];
  constructor() {}

  getAllContacts(refresh?: boolean): Observable<any> {
    if (ContactsService.allContacts && !refresh) {
      return of(ContactsService.allContacts);
    }
    return from(this.getAll()).pipe(
      map((contacts: any[]) => {
        const result = contacts.map(
          ({ displayName, phoneNumbers, thumbnail }) => {
            if (phoneNumbers) {
              let numbers = phoneNumbers.map(element => {
                return formatPhoneNumber(element.normalizedNumber);
              });
							numbers = [...new Set(numbers)];
              return { displayName, numbers, thumbnail };
            }
            return { displayName, thumbnail, numbers: [] };
          }
        );
        ContactsService.allContacts = result;
        console.log('our final result',result);

        return result;
      }),
      catchError(() => {
        if (ContactsService.allContacts) return of(ContactsService.allContacts);
        return of([]);
      })
    );
  }

  getAll() {
    return new Promise<any[]>((resolve) => {
      navigator.contactsPhoneNumbers.list((contacts: any[]) => {
        //console.log(contacts);
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

    const result = this.applyFilter(formattedContact, term);
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

	applyFilter(list: ContactOem[], term: string) {
		const termWithoutAccent = term
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
		return	list.filter(item => {
      return (
				this.searchingTerm(item?.displayName?.toLowerCase(),term.toLowerCase()) ||
				this.searchingTerm(item?.displayName?.toLowerCase()?.normalize('NFD')?.replace(/[\u0300-\u036f]/g, ''), termWithoutAccent) ||
        item.phoneNumber?.toLowerCase()?.includes(termWithoutAccent.toLowerCase())
      );
    })
	}

	searchingTerm(text: string, searchTerm: string) {
		return text.includes(searchTerm) || this.searchingTermsGroup(text,searchTerm);
	}
	searchingTermsGroup(text: string, searchingTermgroup: string) {
		const regex = searchingTermgroup.split(" ")
        .map(word => "(?=.*\\b" + word + "\\b)")
        .join('');
    const searchExp = new RegExp(regex, "gi");
    return searchExp.test(text);
	}

	findContact(msisdn: string): ContactOem {
		return ContactsService.allContacts.find( (contact: ContactOem) => {
			return contact.numbers.find((number) => {
				return number.includes(msisdn);
			});
		} )
	}
}
