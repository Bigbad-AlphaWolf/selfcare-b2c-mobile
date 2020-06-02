import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { formatPhoneNumber, REGEX_NUMBER, REGEX_FIX_NUMBER, SubscriptionModel, OPERATION_TYPE_PASS_INTERNET, OPERATION_TYPE_PASS_ILLIMIX, OPERATION_TYPE_RECHARGE_CREDIT } from 'src/shared';
import { SelectNumberPopupComponent } from 'src/shared/select-number-popup/select-number-popup.component';
import { MatDialog } from '@angular/material';
import { Contacts, Contact } from '@ionic-native/contacts';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { IonInput, IonSelect } from '@ionic/angular';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { PROFILE_TYPE_POSTPAID, isPrepaidFix } from '../dashboard';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-select-beneficiary-v2',
  templateUrl: './select-beneficiary-v2.page.html',
  styleUrls: ['./select-beneficiary-v2.page.scss'],
})
export class SelectBeneficiaryV2Page implements OnInit {
  currentUserNumber: string;
  recipientNumber: string;
  isUserRecipient = true;
  customPopOverOptions: any = {
    header: 'Selectionner un numéro',
    message: 'Liste des numéros rattachés',
    translucent: true
  };
  listUserNumber: {msisdn: string, profil: string, formule: string}[] = [];
  hasError: boolean;
  isLoaded: boolean;
  mainPhoneNumber: string;
  otherBeneficiaryNumber:string;
  hasErrorGetContact:boolean;
  errorGetContact: string;
  recipientContactInfos: any;
  isProcessing = false;
  @ViewChild('inputTel') ionicInput: IonInput;
  @ViewChild('selectNumbers') ionicSelect: IonSelect;
  errorMsg: string;
  hasErrorProcessing: boolean;
  purchaseType: string;
  constructor(private dashbbServ: DashboardService, private appRouting: ApplicationRoutingService, private dialog: MatDialog,private contacts: Contacts,
    private authServ: AuthenticationService, private followAnalyticsService: FollowAnalyticsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (
        this.router.getCurrentNavigation().extras.state &&
        this.router.getCurrentNavigation().extras.state.payload
      ) {
        this.purchaseType = this.router.getCurrentNavigation().extras.state.payload;

      }else{
        this.appRouting.goToDashboard();
      }
    });
  }

  ionViewWillEnter(){
    this.currentUserNumber = this.dashbbServ.getCurrentPhoneNumber();
    this.mainPhoneNumber = this.dashbbServ.getMainPhoneNumber();
    this.getListeRattachedNumber();
  }

  selectUserAsBeneficiary(){
    this.isUserRecipient = true;
    this.recipientNumber = this.currentUserNumber;
    this.recipientContactInfos = null;
    this.otherBeneficiaryNumber = null;
    if(this.listUserNumber.length === 0){
      this.validatePhoneNumberProfil();
    }
  }

  selectOtherAsBeneficiary(){
    this.isUserRecipient = false;
  }

  getListeRattachedNumber(){
    this.isLoaded = false;
    this.listUserNumber = [];
    this.dashbbServ.getAttachedNumbers().subscribe((res: any[])=>{
      this.isLoaded = true;
      this.hasError = false;
      if(res.length){        
        this.listUserNumber.push(...res);
      }
      this.recipientNumber = this.currentUserNumber;
    },(err: any)=>{
      this.isLoaded = true;
      this.hasError = true;
      this.recipientNumber = this.currentUserNumber;
    });
  }

  goToDashboard(){
    this.appRouting.goToDashboard();
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
            this.processGetContactInfos(contact, selectedNumber);
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
      this.errorGetContact = "Ce destinataire ne peux pas bénéficier de ce service."
    }
  }

  getContactFormattedName(contact: any) {
    const givenName = contact.name.givenName;
    const familyName = contact.name.familyName ? contact.name.familyName : '';
    const middleName = contact.name.middleName ? ` ${contact.name.middleName}` : '';
    this.recipientContactInfos = contact.name && contact.name.formatted ? contact.name.formatted : givenName + middleName + familyName;

  }

 validateNumber(phoneNumber: string) {
    return REGEX_NUMBER.test(phoneNumber) || REGEX_FIX_NUMBER.test(phoneNumber);
  }

  processInfoUser(){
    this.hasErrorGetContact = false;
    this.hasError = false;
    this.errorGetContact = null;
    this.errorMsg = null;
    if(this.isUserRecipient){
      this.recipientNumber = this.ionicSelect.value;
      this.validatePhoneNumberProfil();
    }else {
      if(this.ionicInput && this.ionicInput.value && this.validateNumber(this.ionicInput.value)){
        this.recipientNumber = formatPhoneNumber(this.ionicInput.value);
        this.validatePhoneNumberProfil()
      }else if(this.otherBeneficiaryNumber && this.recipientContactInfos){
        this.recipientNumber = this.otherBeneficiaryNumber;
        this.validatePhoneNumberProfil()
      } else{
        this.hasErrorProcessing = true;
        this.errorMsg = "Veuillez choisir un numéro de destinataire valide pour continuer"
      }
    }

    
    
  }

  validatePhoneNumberProfil(){
    this.isProcessing = true;
    this.hasErrorGetContact = false;
    this.errorGetContact = null;
    if(this.recipientNumber){
      this.authServ.getSubscription(this.recipientNumber).subscribe((res: SubscriptionModel)=>{
        this.isProcessing = false;
        const codeFormule = res.code;
        const profil = res.profil;
          if(profil === PROFILE_TYPE_POSTPAID || isPrepaidFix(res) && this.purchaseType === OPERATION_TYPE_PASS_ILLIMIX){
            this.hasErrorGetContact = true;
            this.errorGetContact = "Ce destinataire ne peux pas bénéficier de ce service.";
          }else{
            const data = { destinataire: this.recipientNumber, code: codeFormule, recipientName: this.recipientContactInfos };
            this.redirection(data);
          }

      },(err: any)=>{
        this.isProcessing = false;
        this.hasErrorGetContact = true;
        this.errorGetContact = "Une erreur est survenue. Veuillez réessayer"
      })
    }
  }

  redirection(data: any){
    switch (this.purchaseType) {
      case OPERATION_TYPE_PASS_INTERNET:
        this.goToListPassInternet(data)
        break;
      case OPERATION_TYPE_PASS_ILLIMIX:
        this.goToListPassIllimix(data);
        break;
      case OPERATION_TYPE_RECHARGE_CREDIT:
        break;
      default:
        break;
    }
  }

  goToListPassInternet(data: any){
    this.followAnalyticsService.registerEventFollow(
      'Pass_Internet_ChoixDestinataire',
      'event',
      data.destinataire
    );
    this.appRouting.goToListPassInternet(data)
  }

  goToListPassIllimix(data: any){
    this.followAnalyticsService.registerEventFollow(
      'Pass_Illimix_ChoixDestinataire',
      'event',
      data.destinataire
    );
    this.appRouting.goToListPassIllimix(data)
  }
}
