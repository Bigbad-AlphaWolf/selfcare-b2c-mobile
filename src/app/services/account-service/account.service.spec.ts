import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalController } from '@ionic/angular';
import { AccountService } from './account.service';

describe( 'DashboardService', () => {
	beforeEach( () => {
		TestBed.configureTestingModule( {
			imports: [MatDialogModule],
			providers: [
				AccountService,
				{ provide: HttpClient, useValue: {} },
				{ provide: MatDialogRef, useValue: {} },
				{
					provide: ModalController
				},
				{
					provide: MatDialog
				}
			]
		} );
	} );

	it(
		'should be created',
		inject( [AccountService], ( service: AccountService ) => {
			expect( service ).toBeDefined();
		} )
	);
} );
