import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LinesComponent } from 'src/app/components/lines/lines.component';
import { ErreurTransactionOmModel } from 'src/app/models/erreur-transaction-om.model';
import { PurchaseModel } from 'src/app/models/purchase.model';
import { ReclamationOmOem } from 'src/app/models/reclamation-OM-oem.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { RECLAMATION_TRANSACTIONS_CONDITIONS } from 'src/app/services/orange-money-service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { getPageHeader } from 'src/app/utils/title.util';
import { OPERATION_RECLAMATION_ERREUR_TRANSACTION_OM } from 'src/shared';
import { HistorikTransactionByTypeModalComponent } from './components/historik-transaction-by-type-modal/historik-transaction-by-type-modal.component';
import * as SecureLS from 'secure-ls';
import { DatePipe } from '@angular/common';
import { OperationSuccessFailModalPage } from 'src/app/operation-success-fail-modal/operation-success-fail-modal.page';
const ls = new SecureLS({ encodingType: 'aes' });

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
	isSubmitting: boolean;
	ERROR_SUBMITTING_FORM = "Une erreur est survenue. Veuillez réessayer"
	ERROR_FULFILLING_FORM = "Veuillez remplir tous les champs du formulaire et accepter les conditions avant de soumettre les informations";

	constructor(
		private navCtrl: NavController,
		private dashbServ: DashboardService,
		private modalController: ModalController,
		private omService: OrangeMoneyService,
		private datepipe: DatePipe
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
				'typePhone' : 'MOBILE'
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
		const currentUserNumber = this.dashbServ.getCurrentPhoneNumber();
		const user = ls.get('user');
		const firstName = user.firstName ? user.firstName : "";
		const lastName = user.lastName ? user.lastName : "";
		if(this.acceptConditions && this.infosReclamationsOM.amountTransaction && this.infosReclamationsOM.dateTransaction && this.infosReclamationsOM.recipientTransaction && this.infosReclamationsOM.refTransaction) {
			this.isSubmitting = true;
			const data: ErreurTransactionOmModel = {
				email: this.infosReclamationsOM.email,
				referenceTransaction: this.infosReclamationsOM.refTransaction,
				dateTransaction: this.datepipe.transform( this.infosReclamationsOM.dateTransaction, 'dd/MM/yyyy H:mm'),
				firstName: firstName,
				lastName: lastName,
				montantTransfert: this.infosReclamationsOM.amountTransaction+"",
				msisdnBeneficiaire: this.infosReclamationsOM.recipientTransaction,
				numero: currentUserNumber}
			this.omService.sendRequestErreurTransactionOM(data).pipe(
				tap( _ => {
					this.isSubmitting = false;
					this.hasErrorSubmiting = false;
					this.openSuccessModal();
				}),
				catchError((err: any) => {
					this.hasErrorSubmiting = true;
					this.errorFormSubmission = this.ERROR_SUBMITTING_FORM;
					return of(err)
				})
			).subscribe();
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
				this.infosReclamationsOM.refTransaction = data.txnid;
				this.infosReclamationsOM.amountTransaction = Math.abs(data.amount);
				this.infosReclamationsOM.recipientTransaction = data.msisdnReceiver;
				this.infosReclamationsOM.dateTransaction = data.operationDate;
			}
		});
		return await modal.present();
	}

	async openSuccessModal() {
		const modal = await this.modalController.create({
		  component: OperationSuccessFailModalPage,
		  cssClass: 'success-modal',
		  componentProps: {
			  purchaseType: OPERATION_RECLAMATION_ERREUR_TRANSACTION_OM,
			  success: true
		  },
		  backdropDismiss: false,
		});
		modal.onDidDismiss().then(() => {});
		return await modal.present();
	  }
}
