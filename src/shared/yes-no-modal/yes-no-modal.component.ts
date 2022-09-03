import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PurchaseModel } from 'src/app/models/purchase.model';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { OPERATION_CANCEL_TRX_MLITE, OPERATION_CONFIRM_DELETE_RATTACH_NUMBER, OPERATION_SUGGEST_RATTACH_NUMBER } from '..';

@Component({
  selector: 'app-yes-no-modal',
  templateUrl: './yes-no-modal.component.html',
  styleUrls: ['./yes-no-modal.component.scss'],
})
export class YesNoModalComponent implements OnInit {
  @Input() typeModal: string;
  @Input() numero: string;
  @Input() transaction: PurchaseModel;
	isLoading: boolean;
	hasErrorMsg: string;
  OPERATION_CONFIRM_DELETE_RATTACH_NUMBER = OPERATION_CONFIRM_DELETE_RATTACH_NUMBER;
  OPERATION_SUGGEST_RATTACH_NUMBER = OPERATION_SUGGEST_RATTACH_NUMBER;
  OPERATION_CANCEL_TRX_MLITE = OPERATION_CANCEL_TRX_MLITE;
  constructor(private modal: ModalController,  private omService: OrangeMoneyService) { }

  ngOnInit() {}

  process(yesOrNo: boolean){
		if(this.typeModal === OPERATION_CANCEL_TRX_MLITE) {
			this.isLoading = true;
			this.hasErrorMsg = null;
			this.omService.validateAnnulationTrxMarchandLite({txnId: this.transaction?.txnid, confirm: +yesOrNo}).subscribe((res) => {
				console.log('res', res);
				this.isLoading = false;
				this.modal.dismiss({
					'continue': true
				})
			}, (err) => {
				this.isLoading = false;
				this.hasErrorMsg = 'Votre requête ne peux être traitée pour le moment. Veuillez réessayer.'
				console.log('err');

			})
		}else {
			this.modal.dismiss({
				'continue': yesOrNo
			})
		}

  }

}
