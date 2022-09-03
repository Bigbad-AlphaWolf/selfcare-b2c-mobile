import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PurchaseModel } from 'src/app/models/purchase.model';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { OPERATION_CANCEL_TRX_MLITE } from 'src/shared';
import { YesNoModalComponent } from 'src/shared/yes-no-modal/yes-no-modal.component';

@Component({
  selector: 'app-liste-annulation-trx',
  templateUrl: './liste-annulation-trx.component.html',
  styleUrls: ['./liste-annulation-trx.component.scss'],
})
export class ListeAnnulationTrxComponent implements OnInit {
	@Input() listAnnulationTrx: any;
	isLoading: boolean;
  constructor(private modalController: ModalController, private omService: OrangeMoneyService) { }

  ngOnInit() {}

	async openConfirmModal(transaction: PurchaseModel) {
			const modalCtrl = await this.modalController.create({
				component: YesNoModalComponent,
				componentProps: {
					typeModal: OPERATION_CANCEL_TRX_MLITE,
					transaction
				},
				cssClass: 'select-recipient-modal'
			});

			modalCtrl.onDidDismiss().then((res: any) => {
				res = res.data;
				if (res?.continue === true) {
					this.isLoading = true;
					this.omService.getAnnulationTrxMarchandLite().subscribe((res: any) => {
						this.isLoading = false;
						this.listAnnulationTrx = this.omService.mapToHistorikAchat(res?.content?.data?.content);
					})
				}
			});
			return await modalCtrl.present();
		}

}
