import { TestBed } from '@angular/core/testing';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';

import { FileOemService } from './file-oem.service';

describe( 'FileOemService', () => {
	beforeEach( () => TestBed.configureTestingModule( {
		providers: [
			{
				provide: FileOpener
			},
			{
				provide: File
			},
			{
				provide: Platform
			}
		]
	} ) );

	it( 'should be created', () => {
		const service: FileOemService = TestBed.get( FileOemService );
		expect( service ).toBeTruthy();
	} );
} );
