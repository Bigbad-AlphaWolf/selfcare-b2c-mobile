import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SelectNumberPopupComponent } from 'src/shared/select-number-popup/select-number-popup.component';
import { formatPhoneNumber, REGEX_NUMBER_OM } from 'src/shared';
import { MatDialog, MatInput, MatFormField } from '@angular/material';
import { Contacts, Contact } from '@ionic-native/contacts';
import { IonInput, ModalController, NavController } from '@ionic/angular';
import { ApplicationRoutingService } from 'src/app/services/application-routing/application-routing.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { NoOmAccountModalComponent } from 'src/shared/no-om-account-modal/no-om-account-modal.component';

@Component({
  selector: 'app-select-beneficiary-pop-up',
  templateUrl: './select-beneficiary-pop-up.component.html',
  styleUrls: ['./select-beneficiary-pop-up.component.scss'],
})
export class SelectBeneficiaryPopUpComponent implements OnInit {
  hasErrorGetContact: boolean;
  errorGetContact: string;
  recipientNumber = '';
  recipientContactInfos: any;
  otherBeneficiaryNumber = '';
  firstName: string;
  lastName; string;
  @ViewChild('inputTel') htmlInput: ElementRef;
  isProcessing: boolean;
  omPhoneNumber: string;
  errorMsg: string;
  dataPayload: any;
  senderMsisdn: string;

  constructor(private dialog: MatDialog,private contacts: Contacts, private modalController: ModalController, private omService: OrangeMoneyService,
    private router: Router, private followAnalytics: FollowAnalyticsService, private dashbServ: DashboardService, private navController: NavController) { }

  ngOnInit() {}
  
  ionViewWillEnter() {
    this.senderMsisdn = this.dashbServ.getCurrentPhoneNumber();
  }

  pickContact() {
    this.hasErrorGetContact = false;
    this.recipientNumber = null;
    this.errorGetContact = null;
      this.contacts
        .pickContact()
        .then((contact: Contact) => {
          if (contact.phoneNumbers.length > 1) {
            this.openPickRecipientModal(contact);
          } else {
            const selectedNumber = formatPhoneNumber(contact.phoneNumbers[0].value);
            this.processGetContactInfos(contact,selectedNumber);
          }
        })
        .catch(err => {
          console.log('err', err);
          
        });
  }

  openPickRecipientModal(contact: any) {
    const dialogRef = this.dialog.open(SelectNumberPopupComponent, {
      data: { phoneNumbers: contact.phoneNumbers }
    });
    dialogRef.afterClosed().subscribe(selectedNumber => {
      const choosedNumber = formatPhoneNumber(selectedNumber);
      this.processGetContactInfos(contact, choosedNumber);
    });
  }

  processGetContactInfos(contact: any, selectedNumber: any){
    if (this.validateNumber(selectedNumber)) {
      this.otherBeneficiaryNumber = selectedNumber;
      this.getContactFormattedName(contact);

    } else {
      this.hasErrorGetContact = true;
      this.errorGetContact = "Veuillez choisir un numéro de destinataire valide pour continuer"
    }
  }

  validateNumber(phoneNumber: string) {
    return REGEX_NUMBER_OM.test(phoneNumber);
  }

  getContactFormattedName(contact: any) {
    const givenName = contact && contact.name.givenName ?  `${contact.name.givenName}` : '' ;
    const familyName = contact && contact.name.familyName ? ` ${contact.name.familyName}` : '';
    const middleName = contact && contact.name.middleName ? ` ${contact.name.middleName}` : '';
    this.recipientContactInfos = contact.name && contact.name.formatted ? contact.name.formatted : givenName + middleName + familyName;
    this.firstName = givenName + middleName;
    this.lastName = familyName;    

  }

  validateBeneficiary(){
    this.hasErrorGetContact = false;
    this.errorGetContact = null;
    
    if(this.htmlInput && this.htmlInput.nativeElement.value && this.validateNumber(this.htmlInput.nativeElement.value)){
      this.recipientNumber = formatPhoneNumber(this.htmlInput.nativeElement.value);
      console.log('OK', this.recipientNumber);
      const payload = {senderMsisdn: "",recipientMsisdn: this.recipientNumber,recipientFirstname: "", recipientLastname: ""  }
      this.getOmPhoneNumberAndCheckrecipientHasOMAccount(payload)
      
    }else if(this.otherBeneficiaryNumber && this.recipientContactInfos){
      this.recipientNumber = this.otherBeneficiaryNumber;
      const payload = {senderMsisdn: "",recipientMsisdn: this.recipientNumber,recipientFirstname: this.firstName, recipientLastname: this.lastName  }
      this.getOmPhoneNumberAndCheckrecipientHasOMAccount(payload)

    } else{
      this.hasErrorGetContact = true;
      this.errorGetContact = "Veuillez choisir un numéro de destinataire valide pour continuer"
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
        this.omPhoneNumber = userMsisdn;
        this.checkOMToken(userMsisdn, payload);
      } else {
        this.modalController.dismiss();
        this.openPinpad();
      }
    });
  }

  

  checkRecipientHasOMAccount(
    userOMNumber: string,
    payload: {
      senderMsisdn: string;
      recipientMsisdn: string;
      recipientFirstname: string;
      recipientLastname: string;
    }
  ) {
    this.isProcessing = true;
    this.errorMsg = null;
    this.omService
      .checkUserHasAccount(this.omPhoneNumber, payload.recipientMsisdn)
      .subscribe(
        (res: any) => {
          this.isProcessing = false;
          if (res) {
            if (res.status_code.match('Success')) {
              const pageData = Object.assign(payload, {
                purchaseType: 'TRANSFER_MONEY',
              });
              this.modalController.dismiss(pageData);

              // this.appRouting.goSetAmountPage(pageData);
              this.followAnalytics.registerEventFollow(
                'destinataire_transfert_has_om_account_success',
                'event',
                {
                  transfert_om_numero_sender: userOMNumber,
                  transfert_om_numero_receiver: payload.recipientMsisdn,
                  has_om: 'true',
                }
              );
            } else {
              this.openNoOMAccountModal(payload);
              this.followAnalytics.registerEventFollow(
                'destinataire_transfert_has_om_account_success',
                'event',
                {
                  transfert_om_numero_sender: userOMNumber,
                  transfert_om_numero_receiver: payload.recipientMsisdn,
                  has_om: 'false',
                }
              );
              this.errorMsg = 'Recipient has No OM ';
              // this.openModalNoOMAccount(this.recipientInfos);
            }
          } else {
            this.router.navigate(['/see-solde-om']);
          }
        },
        (err: HttpErrorResponse) => {
          this.isProcessing = false;
          this.errorMsg = 'Recipient has No OM ';
          let isAccessTokenExpired: boolean;
          if (err && err.error.title) {
            let error: string = err.error.title;
            error = error.toLowerCase();
            isAccessTokenExpired =
              error.includes('principal') &&
              error.includes('token') &&
              error.includes('expired');
          }
          if (isAccessTokenExpired) {
            this.openPinpad(this.dataPayload);
          }
          if (err.status === 400) {
            this.openNoOMAccountModal(payload);
            this.followAnalytics.registerEventFollow(
              'destinataire_transfert_has_om_account',
              'event',
              {
                transfert_om_numero_destinataire: payload.recipientMsisdn,
                has_om: 'false',
              }
            );
          } else {
            this.followAnalytics.registerEventFollow(
              'destinataire_transfert_has_om_account_error',
              'error',
              {
                transfert_om_numero_sender: userOMNumber,
                transfert_om_numero_receiver: payload.recipientMsisdn,
                error:
                  'Une error ' + err.status + ' est survenue' + err && err.error
                    ? err.error.title
                    : '',
              }
            );
            this.errorMsg = 'Une erreur est survenue, veuillez reessayer';
          }
        }
      );
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
      if (response.data && response.data.success && payload ) {
        this.getOmPhoneNumberAndCheckrecipientHasOMAccount(payload);
      }else{
        this.navController.navigateBack(['/dashboard'])
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
        this.modalController.dismiss(pageData);
      }
    });
    return await modal.present();
  }

  checkOMToken(
    userOMMsisdn: string,
    payload: {
      senderMsisdn: string;
      recipientMsisdn: string;
      recipientFirstname: string;
      recipientLastname: string;
    }
  ) {
    this.isProcessing = true;

    this.omService.GetUserAuthInfo(userOMMsisdn).subscribe(
      (omUser: any) => {
        this.isProcessing = false;
        // If user already connected open pinpad
        if (!omUser.hasApiKey  || !omUser.accessToken) {
          this.router.navigate(['/see-solde-om']);
        }else if (omUser.loginExpired) {
          this.openPinpad(payload);
        } else {
          this.checkRecipientHasOMAccount(userOMMsisdn, payload);
        }
      },
      () => {
        this.isProcessing = false;
      }
    );
  }
}
