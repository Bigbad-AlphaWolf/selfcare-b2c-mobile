import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { PurchaseModel } from '../models/purchase.model';
import { ReclamationOmOem } from '../models/reclamation-OM-oem.model';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { HistorikTransactionByTypeModalComponent } from '../pages/reclamation-om-transaction/components/historik-transaction-by-type-modal/historik-transaction-by-type-modal.component';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';

@Component({
	selector: 'app-cancel-transaction-om',
	templateUrl: './cancel-transaction-om.page.html',
	styleUrls: ['./cancel-transaction-om.page.scss'],
})
export class CancelTransactionOmPage implements OnInit {
	saveUserInfos: boolean = true;
	personalInfosForm: FormGroup;
	identityForm: FormGroup;
	cancelTransactionOMInfos: FormGroup;
	omMsisdn: string;
	gettingOmNumber: boolean;
	getMsisdnHasError: boolean;
	rectoFilled: boolean;
	rectoImage: any;
	rectoFileName: string;
	versoFilled: boolean;
	versoImage: any;
	versoFileName: string;
	errorMsg: string;
	isSubmitting: boolean;
	transactionOMInfos: ReclamationOmOem = {
		refTransaction: null,
		email: null,
		amountTransaction: null,
		dateTransaction: null,
		recipientTransaction: null,
	};
	constructor(
		private navCtrl: NavController,
		private formBuilder: FormBuilder,
		private orangeMoneyService: OrangeMoneyService,
		private modalController: ModalController,
		private router: Router
	) {}

	ngOnInit() {
		this.initForms();
		this.getOmMsisdn();
	}

	initForms() {
		this.cancelTransactionOMInfos = this.formBuilder.group({
			transaction_id: [null, [Validators.required]],
			receiver: ['', [Validators.required]],
			dateTransfert: ['', [Validators.required]],
			montant: ['', [Validators.required]],
      		civility: [null, [Validators.required]],
			lastname: ['', [Validators.required]],
			firstname: ['', [Validators.required]],
			email: ['', [Validators.required]],
			nIdentity: [null, [Validators.required]],
			identityType: ['CNI', [Validators.required]],
		});
	}

	getOmMsisdn() {
		this.getMsisdnHasError = false;
		this.gettingOmNumber = true;
		this.orangeMoneyService.getOmMsisdn().subscribe(
			(msisdn: string) => {
				this.gettingOmNumber = false;
				if (msisdn.match('error')) {
					this.openPinpad();
					this.getMsisdnHasError = true;
				} else {
					this.omMsisdn = msisdn;
				}
			},
			(err) => {
				this.getMsisdnHasError = true;
			}
		);
	}

	async openPinpad() {
		const modal = await this.modalController.create({
			component: NewPinpadModalPage,
			cssClass: 'pin-pad-modal',
		});
		modal.onDidDismiss().then((resp) => {
			if (resp && resp.data && resp.data.success) {
				this.getOmMsisdn();
			}
		});
		return await modal.present();
	}

	takePicture(step?: 'recto' | 'verso' | 'selfie') {
		this.router.navigate(['new-deplafonnement-om/take-picture'], {
			state: { step },
		});
	}

	removePicture(step: 'recto' | 'verso') {
		switch (step) {
			case 'recto':
				this.rectoFilled = false;
				this.rectoImage = null;
				break;
			case 'verso':
				this.versoFilled = false;
				this.versoImage = null;
				break;
			default:
				break;
		}
	}

	async selectTransaction() {
		const modal = await this.modalController.create({
			component: HistorikTransactionByTypeModalComponent,
			cssClass: 'select-recipient-modal',
			componentProps: {
				typeTransaction: 'OM',
			},
		});
		modal.onDidDismiss().then((res: any) => {
			if (res && res.data) {
				const data: PurchaseModel = res.data.purchaseInfos;
				this.transactionOMInfos.refTransaction = data.txnid;
				this.transactionOMInfos.amountTransaction = Math.abs(data.amount);
				this.transactionOMInfos.recipientTransaction = data.msisdnReceiver;
				this.transactionOMInfos.dateTransaction = data.operationDate;
				this.cancelTransactionOMInfos.patchValue({ transaction_id: this.transactionOMInfos.refTransaction, receiver: this.transactionOMInfos.recipientTransaction, dateTransfert: this.transactionOMInfos.dateTransaction, montant: this.transactionOMInfos.amountTransaction });

			}
		});
		return await modal.present();
	}

	submittingFormsInfos() {
		console.log('formValues', this.cancelTransactionOMInfos.value);

	}

	goBack() {
		this.navCtrl.pop();
	}
}
