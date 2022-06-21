import { Component, OnInit, Input } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { ModalController } from '@ionic/angular';
import { SessionOem } from 'src/app/services/session-oem/session-oem.service';
import { MSISDN_TYPE, REGEX_FIX_NUMBER, REGEX_NUMBER, SubscriptionModel } from 'src/shared';
import {
	isPostpaidFix,
	isPostpaidMobile,
	PROFILE_TYPE_HYBRID,
	PROFILE_TYPE_HYBRID_1,
	PROFILE_TYPE_HYBRID_2,
	PROFILE_TYPE_POSTPAID
} from 'src/app/dashboard';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component( {
	selector: 'app-lines',
	templateUrl: './lines.component.html',
	styleUrls: ['./lines.component.scss']
} )
export class LinesComponent implements OnInit {
	phones$: Observable<any[]>;
	phones: any[] = null;

	isProcessing: boolean;

	@Input() phone: any;
	@Input() phoneType: string;
	codeClient: String;
	currentPhoneSelected: string;
	MSISDN_TYPE_MOBILE = MSISDN_TYPE.MOBILE;
	constructor( private modalController: ModalController, private dashbServ: DashboardService, private authServ: AuthenticationService ) { }

	ngOnInit() {
		this.isProcessing = true;
		this.dashbServ
			.attachedNumbers()
			.pipe(
				switchMap( ( elements: any ) => {
					let numbers = [];
					let oemSouscriptions: Observable<any>[] = [];
					oemSouscriptions.push( this.authServ.getSubscription( SessionOem.MAIN_PHONE ) );
					numbers.push( SessionOem.MAIN_PHONE );

					elements.forEach( ( element: any ) => {
						const msisdn = '' + element.msisdn;
						oemSouscriptions.push( this.authServ.getSubscription( msisdn ) );
						numbers.push( msisdn );
					} );
					return forkJoin( oemSouscriptions ).pipe(
						map( ( results: SubscriptionModel[] ) => {
							let fNumbers = [];
							results.forEach( ( sub: SubscriptionModel, i: number ) => {
								const sousc = sub;
								if ( this.phoneType === MSISDN_TYPE.FIXE ) {
									if ( this.isFixeNumber( numbers[i], sousc ) ) {
										fNumbers.push( {
											phone: numbers[i],
											codeClient: sub.clientCode,
											souscription: sousc
										} );
									}
								} else if ( this.phoneType === MSISDN_TYPE.MOBILE ) {
									if ( this.isMobilePostpaidOrHybrid( sub, numbers[i] ) ) {
										fNumbers.push( {
											phone: numbers[i],
											codeClient: sub.clientCode
										} );
									}
								} else {
									if ( this.isLineNumber( numbers[i], sousc ) )
										fNumbers.push( {
											phone: numbers[i],
											codeClient: sub.clientCode
										} );
								}
							} );
							if ( fNumbers.length && !this.phone ) {
								this.phone = fNumbers[0];
							}
							this.isProcessing = false;
							return fNumbers;
						} )
					);
				} ),
				tap( res => {
					this.phones = res;
				} )
			)
			.subscribe();
	}

	isMobilePostpaidOrHybrid( subscription: SubscriptionModel, msisdn: string ) {
		const postpaidProfiles = [PROFILE_TYPE_HYBRID, PROFILE_TYPE_HYBRID_1, PROFILE_TYPE_HYBRID_2, PROFILE_TYPE_POSTPAID];
		return postpaidProfiles.includes( subscription.profil ) && msisdn.match( REGEX_NUMBER );
	}

	isLineNumber( phone: string, souscription: SubscriptionModel ) {
		return (
			( REGEX_FIX_NUMBER.test( phone ) && isPostpaidFix( souscription ) ) ||
			( !REGEX_FIX_NUMBER.test( phone ) && isPostpaidMobile( souscription ) ) ||
			souscription.profil === PROFILE_TYPE_HYBRID ||
			souscription.profil === PROFILE_TYPE_HYBRID_1 ||
			souscription.profil === PROFILE_TYPE_HYBRID_2
		);
	}

	isFixeNumber( phone: string, souscription: SubscriptionModel ) {
		return REGEX_FIX_NUMBER.test( phone ) && isPostpaidFix( souscription );
	}

	async onConfirmer() {
		this.modalController.dismiss( this.phone );
	}

	onOptionChange( value: any ) {
		this.phone = value;
	}
}
