import { TestBed } from '@angular/core/testing';
import { Contacts } from '@ionic-native/contacts';

import { ContactsService } from './contacts.service';

describe( 'ContactsService', () => {
	beforeEach( () => TestBed.configureTestingModule( {
		providers: [
			{
				provide: Contacts
			}
		]
	} ) );

	it( 'should be created', () => {
		const service: ContactsService = TestBed.get( ContactsService );
		expect( service ).toBeTruthy();
	} );
} );
