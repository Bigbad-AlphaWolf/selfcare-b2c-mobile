import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { LinesComponent } from 'src/app/components/lines/lines.component';
import { ReclamationOmOem } from 'src/app/models/reclamation-OM-oem.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { RECLAMATION_TRANSACTIONS_CONDITIONS } from 'src/app/services/orange-money-service';
import { getPageHeader } from 'src/app/utils/title.util';
import { OPERATION_RECLAMATION_ERREUR_TRANSACTION_OM, PurchaseModel } from 'src/shared';
import { HistorikTransactionByTypeModalComponent } from './components/historik-transaction-by-type-modal/historik-transaction-by-type-modal.component';

@Component({
	selector: 'app-reclamation-om-transaction',
	templateUrl: './reclamation-om-transaction.page.html',
	styleUrls: ['./reclamation-om-transaction.page.scss'],
})
export class ReclamationOmTransactionPage implements OnInit {
	title = getPageHeader(OPERATION_RECLAMATION_ERREUR_TRANSACTION_OM).title;
	currentNumber: string;
	infosReclamationsOM?: ReclamationOmOem = {
		refTransaction: null,
		email: null,
		amountTransaction: null,
		dateTransaction: null,
		recipientTransaction: null,
	};
	RECLAMATIONS_TRANSACCTIONS_OM_CONDITIONS = RECLAMATION_TRANSACTIONS_CONDITIONS;
	acceptConditions: boolean;
	errorFormSubmission: string;
	hasErrorSubmiting:boolean;
	ERROR_SUBMITTING_FORM = "Une erreur est survenue. Veuillez réessayer"
	ERROR_FULFILLING_FORM = "Veuillez remplir tous les champs du formulaire et accepter les conditions avant de soumettre les informations";
	constructor(
		private navCtrl: NavController,
		private dashbServ: DashboardService,
		private modalController: ModalController
	) {}

	ngOnInit() {
		this.currentNumber = this.dashbServ.getCurrentPhoneNumber();
	}

	goBack() {
		this.navCtrl.pop();
	}

	async openLinesModal() {
		const modal = await this.modalController.create({
			component: LinesComponent,
			componentProps: {
				'phone': this.currentNumber,
				'typeLine' : 'MOBILE'
			},
			cssClass: 'select-recipient-modal',
		});
		modal.onDidDismiss().then((response) => {
			if (response && response.data) {
				this.currentNumber = response.data.phone;
			}
		});
		return await modal.present();
	}

	submitInfos() {
		this.hasErrorSubmiting = false;
		if(this.acceptConditions && this.infosReclamationsOM.amountTransaction && this.infosReclamationsOM.dateTransaction && this.infosReclamationsOM.recipientTransaction && this.infosReclamationsOM.refTransaction) {
			console.log('Submit infos');
		}else {
			this.hasErrorSubmiting = true;
			this.errorFormSubmission = this.ERROR_FULFILLING_FORM;
		}
	}

	async selectTransaction() {
		const modal = await this.modalController.create({
			component: HistorikTransactionByTypeModalComponent,
			cssClass: 'select-recipient-modal',
			componentProps: {
				'typeTransaction': 'OM',
			},
		});
		modal.onDidDismiss().then((res: any) => {
			if (res && res.data) {
				const data: PurchaseModel = res.data.purchaseInfos;
				this.infosReclamationsOM.amountTransaction = Math.abs(data.amount);
				this.infosReclamationsOM.recipientTransaction = data.msisdnReceiver;
				this.infosReclamationsOM.dateTransaction = data.operationDate;
			}
		});
		return await modal.present();
	}
}
