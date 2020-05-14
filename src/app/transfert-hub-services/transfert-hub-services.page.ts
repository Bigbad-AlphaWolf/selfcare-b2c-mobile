import { Component, OnInit } from '@angular/core';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { ModalController } from '@ionic/angular';
import { SelectBeneficiaryPopUpComponent } from './components/select-beneficiary-pop-up/select-beneficiary-pop-up.component';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { Router } from '@angular/router';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { NoOmAccountModalComponent } from 'src/shared/no-om-account-modal/no-om-account-modal.component';

@Component({
  selector: 'app-transfert-hub-services',
  templateUrl: './transfert-hub-services.page.html',
  styleUrls: ['./transfert-hub-services.page.scss'],
})
export class TransfertHubServicesPage implements OnInit {
  options: {
    title: string;
    subtitle: string;
    icon: string;
    type: 'TRANSFERT_MONEY' | 'TRANSFERT_CREDIT' | 'TRANSFERT_BONUS';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
}[] = [
  {
    title: 'Transfert',
    subtitle: "d'argent",
    icon: "/assets/images/icOrangeMoney.png",
    action: "REDIRECT",
    type: "TRANSFERT_MONEY",
    url:""
  },
  {
    title: 'Transfert',
    subtitle: "de crédit",
    icon: "/assets/images/ic-top-up-mobile@2x.png",
    action: "REDIRECT",
    type: "TRANSFERT_CREDIT",
    url:""
  },
  {
    title: 'Transfert',
    subtitle: "de bonus",
    icon: "/assets/images/ic-reward.png",
    action: "REDIRECT",
    type: "TRANSFERT_BONUS",
    url:""
  }
];
  omPhoneNumber: string;
  isProcessing: boolean;
  errorMsg: string;
  senderMsisdn: string;
  dataPayload: any;
  constructor(private appRouting: ApplicationRoutingService, private modalController: ModalController, private omService: OrangeMoneyService, private router: Router, private followAnalytics: FollowAnalyticsService, private dashbServ: DashboardService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.senderMsisdn = this.dashbServ.getCurrentPhoneNumber();
  }

  goToDashboard(){
    this.appRouting.goToDashboard();
  }

  goTo(opt: {
    title: string;
    subtitle: string;
    icon: string;
    type: 'TRANSFERT_MONEY' | 'TRANSFERT_CREDIT' | 'TRANSFERT_BONUS';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
} ){
    switch (opt.type) {
      case 'TRANSFERT_MONEY':
        if(opt.action === 'REDIRECT'){
          this.showBeneficiaryModal();
        }
        break;
      case 'TRANSFERT_CREDIT':
        if(opt.action === 'REDIRECT'){
          this.appRouting.goToTransfertCreditPage();
        }
        break;
      case 'TRANSFERT_BONUS':
        if(opt.action === 'REDIRECT'){
          this.appRouting.goToTransfertBonusPage();
        }
        break;
      default:
        break;
      }
  }

  async showBeneficiaryModal() {
    const modal = await this.modalController.create({
      component: SelectBeneficiaryPopUpComponent,
      cssClass: 'customModalCssTrasnfertOMWithoutCode'
    });
    modal.onWillDismiss().then((response: any)=>{
      if( response && response.data && response.data.recipientMsisdn){
        const payload = {
          senderMsisdn: this.senderMsisdn,
          recipientMsisdn: response.data.recipientMsisdn,
          recipientFirstname: response.data.recipientFirstname,
          recipientLastname: response.data.recipientLastname
        };  
        this.dataPayload = payload;        
        this.getOmPhoneNumberAndCheckrecipientHasOMAccount(this.dataPayload);
      }    
    })
    return await modal.present();
  }

  checkUserHasOMAccount(){

  }

  getOmPhoneNumberAndCheckrecipientHasOMAccount(payload: {
    senderMsisdn: string,
    recipientMsisdn: string,
    recipientFirstname: string,
    recipientLastname: string
  }) {
    this.isProcessing = true;
    
    this.omService.getOmMsisdn().subscribe(userMsisdn => {
      this.isProcessing = false;      
      if(userMsisdn !== 'error'){
        this.omPhoneNumber = userMsisdn;
        this.checkOMToken(userMsisdn, payload);
      }else{
        this.router.navigate(['/see-solde-om'])
      }
    }
    );
  }

  checkRecipientHasOMAccount(userOMNumber: string, payload: {
    senderMsisdn: string,
    recipientMsisdn: string,
    recipientFirstname: string,
    recipientLastname: string
  }) {    
    this.isProcessing = true;
    this.errorMsg = null;
    this.omService
      .checkUserHasAccount(this.omPhoneNumber, payload.recipientMsisdn)
      .subscribe(
        (res: any) => {
          this.isProcessing = false;
          if (res) {
            if (res.status_code.match('Success')) {
              const pageData = Object.assign(payload, {transfertOMType: "TRANSFERT_OM_WITHOUT_CODE"})
              this.appRouting.goToTransfertMoneySetAmountPage(pageData)
              this.followAnalytics.registerEventFollow(
                'destinataire_transfert_has_om_account_success',
                'event',
                {
                  transfert_om_numero_sender: userOMNumber,
                  transfert_om_numero_receiver: payload.recipientMsisdn,
                  has_om: 'true'
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
                  has_om: 'false'
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
          if(err && err.error.title){
            let error: string = err.error.title;
            error = error.toLowerCase();            
            isAccessTokenExpired = error.includes("principal") && error.includes("token") && error.includes("expired")
          }
          if(isAccessTokenExpired){
            this.openPinpad(this.dataPayload)
          }
          if (err.status === 400) {
            this.openNoOMAccountModal(payload);
            this.followAnalytics.registerEventFollow(
              'destinataire_transfert_has_om_account',
              'event',
              {
                transfert_om_numero_destinataire: payload.recipientMsisdn,
                has_om: 'false'
              }
            );
          }else {
            this.followAnalytics.registerEventFollow(
              'destinataire_transfert_has_om_account_error',
              'error',
              {
                transfert_om_numero_sender: userOMNumber,
                transfert_om_numero_receiver: payload.recipientMsisdn,
                error: 'Une error ' + err.status + ' est survenue' + err && err.error ? err.error.title : ''
              }
            );
            this.errorMsg = 'Une erreur est survenue, veuillez reessayer';
          }
          
        }
      );
  }

  async openPinpad(payload: any) {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: null
      },
    });
    modal.onDidDismiss().then((response) => {
      if (response.data && response.data.success) {
        this.getOmPhoneNumberAndCheckrecipientHasOMAccount(payload);
      }
    });
    return await modal.present();
  }

  async openNoOMAccountModal(payload: {
    senderMsisdn: string,
    recipientMsisdn: string,
    recipientFirstname: string,
    recipientLastname: string
  }) {
    const modal = await this.modalController.create({
      component: NoOmAccountModalComponent,
      cssClass: 'customModalNoOMAccountModal'
    });
    modal.onDidDismiss().then((response) => {
      if (response && response.data && response.data.continue) {
        const pageData = Object.assign(payload,{transfertOMType: "TRANSFERT_OM_WITH_CODE"})
        if(response.data.continue){
          this.appRouting.goToTransfertMoneySetAmountPage(pageData)
        }
      }
    });
    return await modal.present();
  }


  checkOMToken(userOMMsisdn: string, payload: {
    senderMsisdn: string,
    recipientMsisdn: string,
    recipientFirstname: string,
    recipientLastname: string
  }) {
    this.isProcessing = true;

    this.omService.GetUserAuthInfo(userOMMsisdn).subscribe((omUser: any) => {
      this.isProcessing = false;
      // If user already connected open pinpad
      if (!omUser.hasApiKey || omUser.loginExpired || !omUser.accessToken) {
        this.router.navigate(['/see-solde-om']);

      }else{

        this.checkRecipientHasOMAccount(userOMMsisdn,payload);
      }
    },()=>{
      this.isProcessing = false;
    });
  }
}
