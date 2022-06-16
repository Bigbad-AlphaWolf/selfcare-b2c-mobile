import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { OPERATION_ABONNEMENT_WIDO, PassInternetModel } from 'src/shared';
import { OffreService } from '../models/offre-service.model';
import { PageHeader } from '../models/page-header.model';
import { PassAbonnementWidoService } from '../services/pass-abonnement-wido-service /pass-abonnement-wido.service';
import { PassInternetService } from '../services/pass-internet-service/pass-internet.service';
import { getPageHeader } from '../utils/title.util';

@Component( {
	selector: 'app-list-pass-usage',
	templateUrl: './list-pass-usage.page.html',
	styleUrls: ['./list-pass-usage.page.scss'],
} )
export class ListPassUsagePage implements OnInit {
	loadingPass: boolean;
	errorLoadingPass: boolean;
	listPass: any[];
	serviceUsage: OffreService;
	recipientMsisdn: string;
	state: any;
	pageInfos: PageHeader;
	OPERATION_ABONNEMENT_WIDO = OPERATION_ABONNEMENT_WIDO;
	constructor(
		private router: Router,
		private navController: NavController,
		private passService: PassInternetService,
		private passAbonnementWido: PassAbonnementWidoService
	) { }

	ngOnInit() {
		this.getPageParams();
	}

	getPageParams() {
		if ( this.router && this.router.getCurrentNavigation() ) {
			let state = this.router.getCurrentNavigation().extras.state;
			this.state = state ? state : history.state;
			console.log( this.state );
			this.serviceUsage = state.serviceUsage;
			this.recipientMsisdn = state.recipientMsisdn;
			this.pageInfos =	getPageHeader(this.serviceUsage.code, this.serviceUsage)
			this.loadPass();
		}
	}

	loadPass() {
		this.loadingPass = true;
		this.errorLoadingPass = false;
		if ( this.serviceUsage ) {
			if(this.serviceUsage.code === OPERATION_ABONNEMENT_WIDO) {
				this.passAbonnementWido
          .getListPassAbonnementWido(this.recipientMsisdn)
          .pipe(
            tap((res: PassInternetModel[]) => {
              this.loadingPass = false;
              this.listPass = res;
            }),
            catchError(err => {
              this.loadingPass = false;
							this.errorLoadingPass = true;
              return throwError(err);
            })
          )
          .subscribe();
			} else {
				this.passService
					.getPassUsage( this.serviceUsage.code, this.recipientMsisdn )
					.subscribe(
						( res ) => {
							this.loadingPass = false;
							this.listPass = res;
						},
						( err ) => {
							this.loadingPass = false;
							this.errorLoadingPass = true;
						}
					);
			}
		}
	}

	goBack() {
		this.navController.pop();
	}

	choosePass( pass ) {
		this.state.pass = pass;
		console.log( 'state to send', this.state );

		let navigationExtras: NavigationExtras = {
			state: this.state,
		};
		this.router.navigate( ['/operation-recap'], navigationExtras );
	}
}
