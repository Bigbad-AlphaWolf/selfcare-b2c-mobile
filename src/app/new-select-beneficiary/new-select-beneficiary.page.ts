import { Component, OnInit } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { ModalController } from '@ionic/angular';
import { from, of, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { OPERATION_TRANSFER_OM, REGEX_DIGIT, REGEX_NUMBER_ALLOWED_COUNTRY_CODE_LONG, REGEX_NUMBER_ALLOWED_COUNTRY_CODE_SHORT, REGEX_NUMBER_OM } from 'src/shared';
import { NoOmAccountModalComponent } from 'src/shared/no-om-account-modal/no-om-account-modal.component';
import { PermissionSettingsPopupComponent } from '../components/permission-settings-popup/permission-settings-popup.component';
import { ContactOem } from '../models/contact-oem.model';
import { CountryOem } from '../models/country-oem.model';
import { RecentsOem } from '../models/recents-oem.model';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { ContactsService } from '../services/contacts-service/contacts.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { RecentsService } from '../services/recents-service/recents.service';
import { TRANSFER_OM_INTERNATIONAL_COUNTRIES } from '../utils/constants';
import { OPERATION_TYPE_INTERNATIONAL_TRANSFER } from '../utils/operations.constants';
import { getCountryInfos, replaceWhiteSpaceWithCaracter } from '../utils/utils';


@Component( {
	selector: 'app-new-select-beneficiary',
	templateUrl: './new-select-beneficiary.page.html',
	styleUrls: ['./new-select-beneficiary.page.scss']
} )
export class NewSelectBeneficiaryPage implements OnInit {
	listContact: ContactOem[] = [];
	listFilteredContacts: ContactOem[] = [];
	recents: ContactOem[] = [];
	country: CountryOem;
	errorMsg: string = null;
	contactError: boolean;
	isProcessing: boolean;
	searchTerm$ = new Subject<string>();
	searchValue: string;
	currentNumber = this.dashboardServ.getCurrentPhoneNumber();
	loadingRecents: boolean;
	inputFocused: boolean;
	isLoadingContacts: boolean;
	constructor(
		private diagnostic: Diagnostic,
		private dashboardServ: DashboardService,
		private followAnalyticsService: FollowAnalyticsService,
		private contactService: ContactsService,
		private appRouting: ApplicationRoutingService,
		private omService: OrangeMoneyService,
		private modalController: ModalController,
		private recentsService: RecentsService	) { }

	ngOnInit() {
		this.checkContactsAuthorizationStatus();
	}

	ionViewWillEnter() {
		this.retrievContacts();
	}

	async checkContactsAuthorizationStatus() {
		this.contactError = false;
		this.errorMsg = null;
		await from( this.diagnostic.getContactsAuthorizationStatus() ).pipe(
			tap( contactStatus => {
				console.log('authorization', contactStatus);

				if (
					contactStatus === this.diagnostic.permissionStatus.NOT_REQUESTED ||
					contactStatus === this.diagnostic.permissionStatus.DENIED_ALWAYS
				) {
					this.isLoadingContacts = false;
					this.contactError = true;
					this.errorMsg =
						"Pour afficher vos contacts/bénéficiaires récents, vous devez autoriser l'accés à vos contacts.";
				}
				console.log('contactStatus', contactStatus);

			} ),
			catchError( err => {
				this.contactError = true;
				this.errorMsg =
					"Pour afficher vos contacts/bénéficiaires récents, vous devez autoriser l'accés à vos contacts.";
				return throwError( err );
			} )
		);
	}

	retrievContacts(refresh?: boolean) {
		this.isLoadingContacts = true;
		this.listFilteredContacts = this.listContact = [];
		this.contactService
			.getAllContacts(refresh)
			.pipe(
				tap( ( res: ContactOem[] ) => {
					this.isLoadingContacts = false;
					console.log('called here', res);

					this.getRecents(res);
					res.forEach( item => {
						if ( item.numbers.length > 1 ) {
							item.numbers = [...new Set(item.numbers)];
							const contacts: ContactOem[] = item.numbers.map( elt => {
								return { displayName: item.displayName, phoneNumber: elt, country: getCountryInfos(elt), formatedPhoneNumber: this.formatPhoneNumber(elt), thumbnail: item.thumbnail };
							} );
							this.listContact.push( ...contacts );
						} else if ( item.numbers.length === 1 ) {
							this.listContact.push( {
								displayName: item.displayName,
								thumbnail: item.thumbnail,
								country: getCountryInfos(item.numbers[0]),
								formatedPhoneNumber: this.formatPhoneNumber(item.numbers[0]),
								phoneNumber: item.numbers.length === 1 ? item.numbers[0] : ''
							} );
						}
					} );
					this.listContact = this.listContact.filter((item) => {
						return !!item?.country
					});
					const sortedContact = this.listContact.sort( ( a, b ) => {
						if ( a.displayName && b.displayName ) {
							return a?.displayName[0]?.localeCompare( b?.displayName[0] )
						}
						return -1;
					} );
					this.listFilteredContacts = sortedContact;
					this.listContact = sortedContact;
					this.activeSearchContact();
					if ( !res.length ) {
						this.checkContactsAuthorizationStatus();
					}
				} ),
				catchError((err) => {
					console.log('err', err);
					this.isLoadingContacts = false;
					return of([])
				})
			)
			.subscribe();
	}

	formatPhoneNumber(phoneNumber: string) {
		if(REGEX_NUMBER_ALLOWED_COUNTRY_CODE_SHORT.test(phoneNumber)) {
			return phoneNumber.substring(4);
		} else if(REGEX_NUMBER_ALLOWED_COUNTRY_CODE_LONG.test(phoneNumber)) {
			return phoneNumber.substring(5);
		} else if(REGEX_NUMBER_OM.test(phoneNumber) && phoneNumber.length === 9) {
			return phoneNumber;
		}

	}


	activeSearchContact() {
		this.contactService.searchTermChanged(this.searchTerm$, this.listContact).subscribe((res: ContactOem[]) => {
			this.listFilteredContacts = [...res];
		})
	}

	onContactSelected(item: ContactOem) {
			this.processInfos(item);
	}

	confirm() {
		const [item] = this.listFilteredContacts;
		this.processInfos(item);
	}

	processInfos(contact: ContactOem) {
		const payload = {
			senderMsisdn: '',
			recipientMsisdn: contact.formatedPhoneNumber,
			recipientFirstname: contact?.displayName,
			recipientLastname: '',
			recipientName: contact?.displayName
		};
		this.checkTransferType(payload, contact);
	}

	checkTransferType(payload: any, contact: ContactOem) {
    if (
      contact?.country?.callId === TRANSFER_OM_INTERNATIONAL_COUNTRIES[0].callId
    ) {
      this.getOmPhoneNumberAndCheckrecipientHasOMAccount(payload);
    } else {
      const pageData = Object.assign(payload, {
        purchaseType: OPERATION_TYPE_INTERNATIONAL_TRANSFER,
        country: contact.country,
      });
      this.appRouting.goSetTransferAmountPage(pageData);
    }
  }

	getOmPhoneNumberAndCheckrecipientHasOMAccount(payload: {
    senderMsisdn: string;
    recipientMsisdn: string;
    recipientFirstname: string;
    recipientLastname: string;
  }) {
    this.isProcessing = true;

    this.omService.getOmMsisdn().subscribe((userMsisdn) => {
      this.isProcessing = false;
      if (userMsisdn !== 'error') {
        this.checkRecipientHasOMAccount(payload);
      } else {
        this.modalController.dismiss();
        this.openPinpad();
      }
    });
  }

	async openPinpad(payload?: any) {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: null,
      },
    });
    modal.onDidDismiss().then((response) => {
      if (response.data && response.data.success && payload) {
        this.getOmPhoneNumberAndCheckrecipientHasOMAccount(payload);
      }
    });
    return await modal.present();
  }

	async openNoOMAccountModal(payload: {
    senderMsisdn: string;
    recipientMsisdn: string;
    recipientFirstname: string;
    recipientLastname: string;
  }) {
    const modal = await this.modalController.create({
      component: NoOmAccountModalComponent,
      cssClass: 'customModalNoOMAccountModal',
    });
    modal.onDidDismiss().then((response) => {
      if (response && response.data && response.data.continue) {
        const pageData = Object.assign(payload, {
          userHasNoOmAccount: true,
          purchaseType: 'TRANSFER_MONEY_WITH_CODE',
        });
        this.modalController.dismiss();
        this.appRouting.goSetTransferAmountPage(pageData);
      }
    });
    return await modal.present();
  }

	checkRecipientHasOMAccount(
    payload: {
      senderMsisdn: string;
      recipientMsisdn: string;
      recipientFirstname: string;
      recipientLastname: string;
    }
  ) {
		const pageData = Object.assign(payload, {
			purchaseType: 'TRANSFER_MONEY',
		});
		this.processInfosTogoToAmountPage(pageData);
  }

	processInfosTogoToAmountPage(payload: {
		senderMsisdn: string;
		recipientMsisdn: string;
		recipientFirstname: string;
		recipientLastname: string;
	}) {
		this.appRouting.goSetTransferAmountPage(payload);
	}

	getRecents(listContact: ContactOem[]) {
    this.loadingRecents = true;
    this.recentsService
      .fetchRecentsV2(OPERATION_TRANSFER_OM, 5, listContact)
      .pipe(
        map((recents: RecentsOem[]) => {
          this.loadingRecents = false;
          let results: ContactOem[] = [];

          recents.forEach((el) => {
            results.push({
              displayName: el.name,
              formatedPhoneNumber: el.destinataire,
							country: getCountryInfos(el.destinataire)
            });
          });
          return results;
        }),
        tap((res: ContactOem[]) => {
          this.recents = res;
					this.followAnalyticsService.registerEventFollow(
						'Recuperation_destinataire_transfert_om_recents_success',
						'event',
						this.dashboardServ.getCurrentPhoneNumber()
					);
        }),
        catchError((err) => {
          this.loadingRecents = false;
					this.followAnalyticsService.registerEventFollow( 'Recuperation_destinataire_transfert_om_recents_failed', 'error', {
						msisdn: this.dashboardServ.getMainPhoneNumber(),
						error: err.status
					} );
          throw new Error(err);
        })
      )
      .subscribe();
  }

	async openSettingsPopup() {
    await this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: PermissionSettingsPopupComponent,
      cssClass: 'success-or-fail-modal',
    });
    modal.onDidDismiss().then((response) => {});
    return modal.present();
  }

	onValueChange(event) {
		const typedValue = event.target.value.trim();
		const value = REGEX_DIGIT.test(typedValue) ? replaceWhiteSpaceWithCaracter(event.target.value.trim(), '') : typedValue;
		this.searchTerm$.next(value);
		this.searchValue = value;
		console.log('searchValue', this.searchValue);

	}
}
