import { Component, OnInit } from '@angular/core';
import { BILLS_COMPANIES_DATA } from 'src/app/utils/bills.util';
import { BillCompany } from 'src/app/models/bill-company.model';
import { ModalController } from '@ionic/angular';
import { CounterSelectionComponent } from 'src/app/components/counter-selection/counter-selection.component';

@Component({
  selector: 'app-bills-hub',
  templateUrl: './bills-hub.page.html',
  styleUrls: ['./bills-hub.page.scss'],
})
export class BillsHubPage implements OnInit {
  public static ROUTE_PATH = '/bills-hub'; 
  companies:any = [];

  constructor(private modalCtl:ModalController) { }

  ngOnInit() {
    this.companies = BILLS_COMPANIES_DATA;
  }

  onCompanySelected(billCompany:BillCompany){
    this.showBeneficiaryModal();
  }

  async showBeneficiaryModal() {
    const modal = await this.modalCtl.create({
      component: CounterSelectionComponent,
      cssClass: 'customModalCssTrasnfertOMWithoutCode',
    });
    modal.onWillDismiss().then((response: any) => {
      if (response && response.data && response.data.recipientMsisdn) {
        const pageData = response.data;
        // this.appRouting.goSetAmountPage(pageData);
        // this.getOmPhoneNumberAndCheckrecipientHasOMAccount(this.dataPayload);
      }
    });
    return await modal.present();
  }

}
