import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OPERATION_CANCEL_TRANSFERT_OM } from 'src/shared';
import { HistorikTransactionByTypeModalComponent } from '../components/historik-transaction-by-type-modal/historik-transaction-by-type-modal.component';
import { CancelOmTransactionPayloadModel } from '../models/cancel-om-transaction-payload.model';
import { PurchaseModel } from '../models/purchase.model';
import { ReclamationOmOem } from '../models/reclamation-OM-oem.model';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { OperationSuccessFailModalPage } from '../operation-success-fail-modal/operation-success-fail-modal.page';
import { ImageService } from '../services/image-service/image.service';
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
	rectoFileName = 'recto.jpeg';
	versoFilled: boolean;
	versoImage: any;
	versoFileName = 'verso.jpeg';
	errorMsg: string;
	isSubmitting: boolean;
	transactionOMInfos: ReclamationOmOem = {
		refTransaction: null,
		email: null,
		amountTransaction: null,
		dateTransaction: null,
		recipientTransaction: null,
	};
	successMsgModal = `Elle sera traité sous un délai prévisionnel de 48H. Vous recevrez une notification après le traitement.`;
	constructor(
		private navCtrl: NavController,
		private formBuilder: FormBuilder,
		private orangeMoneyService: OrangeMoneyService,
		private modalController: ModalController,
		private router: Router,
		private imgService: ImageService
	) {}

	ngOnInit() {
		this.initForms();
		this.getOmMsisdn();
	}

	ionViewWillEnter() {
		this.getStepImage();
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
		this.router.navigate(['/new-deplafonnement-om/take-picture'], {
			state: { step, operation: 'ANNULATION_TRANSFERT' },
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
				this.cancelTransactionOMInfos.patchValue({
					transaction_id: this.transactionOMInfos.refTransaction,
					receiver: this.transactionOMInfos.recipientTransaction,
					dateTransfert: this.transactionOMInfos.dateTransaction,
					montant: this.transactionOMInfos.amountTransaction,
				});
			}
		});
		return await modal.present();
	}

	getStepImage() {
		const state = history.state;
		const step = state ? state.step : null;
		switch (step) {
			case 'recto':
				this.rectoFilled = true;
				this.rectoImage = state.image;
				break;
			case 'verso':
				this.versoFilled = true;
				this.versoImage = state.image;
				break;
			default:
				break;
		}
	}

	async submittingFormsInfos() {
		this.isSubmitting = true;
		this.errorMsg = null;
		const fileRecto = await this.imgService.convertBase64ToBlob(this.rectoImage);
		const fileVerso = await this.imgService.convertBase64ToBlob(this.rectoImage);
		const dataForm: CancelOmTransactionPayloadModel = {
			civility: this.cancelTransactionOMInfos.value.civility,
			firstName: this.cancelTransactionOMInfos.value.firstname,
			lastName: this.cancelTransactionOMInfos.value.lastname,
			msisdnBeneficiaire: this.cancelTransactionOMInfos.value.receiver,
			email: this.cancelTransactionOMInfos.value.email,
			dateTransaction: this.cancelTransactionOMInfos.value.dateTransfert,
			identityType: this.cancelTransactionOMInfos.value.identityType,
			identityNumber: this.cancelTransactionOMInfos.value.nIdentity,
			montantTransfert: this.cancelTransactionOMInfos.value.montant,
			referenceTransaction: this.cancelTransactionOMInfos.value.transaction_id,
			numero: this.omMsisdn
		};
		this.orangeMoneyService.sendInfosCancelationTransfertOM(dataForm, fileRecto, fileVerso).pipe(tap((res: any) => {
			this.isSubmitting = false;
			this.showModal({purchaseType: OPERATION_CANCEL_TRANSFERT_OM, textMsg: this.successMsgModal})
		}),
		catchError((err: any) => {
			this.isSubmitting = false;
			this.errorMsg = 'Une erreur est survenue. Veuillez réesayer';
			return of(err)
		})).subscribe();
	}

	goBack() {
		this.navCtrl.pop();
	}

	async showModal(data: {purchaseType: string, textMsg: string}){
		const modal = await this.modalController.create({
		  component: OperationSuccessFailModalPage,
		  cssClass: 'failed-modal',
		  componentProps: data,
		  backdropDismiss: false,
		});
		modal.onDidDismiss().then(() => {});
		return await modal.present();
	  }

}
