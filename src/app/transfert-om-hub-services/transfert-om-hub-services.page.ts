import { Component, OnInit } from '@angular/core';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { ModalController } from '@ionic/angular';
import { SelectBeneficiaryPopUpComponent } from './components/select-beneficiary-pop-up/select-beneficiary-pop-up.component';

@Component({
  selector: 'app-transfert-om-hub-services',
  templateUrl: './transfert-om-hub-services.page.html',
  styleUrls: ['./transfert-om-hub-services.page.scss'],
})
export class TransfertOmHubServicesPage implements OnInit {
  options: {
    title: string;
    subtitle: string;
    icon: string;
    type: 'TRANSFERT_OM_WITH_CODE' | 'TRANSFERT_OM_WITHOUT_CODE';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  }[] = [
    {
      title: 'Sans code',
      subtitle: 'Retrait avec numéro de téléphone',
      icon: '/assets/images/ic-transfer-data.png',
      action: 'POPUP',
      type: 'TRANSFERT_OM_WITHOUT_CODE',
      url: '',
    },
    {
      title: 'Avec code',
      subtitle: 'Retrait avec pièce d’identité',
      icon: '/assets/images/ic-barcode-reader.png',
      action: 'POPUP',
      type: 'TRANSFERT_OM_WITH_CODE',
      url: '',
    },
  ];
  constructor(
    private appRouting: ApplicationRoutingService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  goToDashboard() {
    this.appRouting.goToDashboard();
  }

  goTo(opt: {
    title: string;
    subtitle: string;
    icon: string;
    type: 'TRANSFERT_OM_WITH_CODE' | 'TRANSFERT_OM_WITHOUT_CODE';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  }) {
    this.showBeneficiaryModal(opt.type);
  }

  goToTransfertHubServicesPage() {
    this.appRouting.goToTransfertHubServicesPage('TRANSFER');
  }

  async showBeneficiaryModal(operationType: string) {
    const modal = await this.modalController.create({
      component: SelectBeneficiaryPopUpComponent,
      cssClass: 'customModalCssTrasnfertOMWithoutCode',
      componentProps: {
        operationType: operationType,
      },
    });
    return await modal.present();
  }
}
