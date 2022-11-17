import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AnnulationSuccessPopupComponent } from 'src/app/details-conso/components/annulation-success-popup/annulation-success-popup.component';
import { PurchaseModel } from 'src/app/models/purchase.model';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { OPERATION_CANCEL_TRX_MLITE, OPERATION_CONFIRM_DELETE_RATTACH_NUMBER, OPERATION_CONFIRM_RATTACHMENT, OPERATION_SUGGEST_RATTACH_NUMBER } from '..';
import { FaceIdRequestModalComponent } from '../face-id-request-modal/face-id-request-modal.component';

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
  OPERATION_CONFIRM_RATTACHMENT = OPERATION_CONFIRM_RATTACHMENT;
  constructor(private modal: ModalController, private modalSuccess: ModalController, private omService: OrangeMoneyService) {}

  ngOnInit() {}

  process(yesOrNo: boolean) {
    if (this.typeModal === OPERATION_CANCEL_TRX_MLITE) {
      this.isLoading = true;
      this.hasErrorMsg = null;
      this.omService.validateAnnulationTrxMarchandLite({ txnId: this.transaction?.txnid, confirm: +yesOrNo }).subscribe(
        res => {
          console.log('res', res);
          this.isLoading = false;
          this.successModalAnnulationTrxLite(yesOrNo);
        },
        err => {
          this.isLoading = false;
          this.hasErrorMsg = 'Votre requête ne peux être traitée pour le moment. Veuillez réessayer.';
          console.log('err');
        }
      );
    } else {
      this.modal.dismiss({
        continue: yesOrNo,
      });
    }
  }

  async successModalAnnulationTrxLite(accept: boolean) {
    this.modal.dismiss({
      continue: true,
    });
    const modalSuccess = await this.modalSuccess.create({
      component: AnnulationSuccessPopupComponent,
      cssClass: 'select-recipient-modal',
      backdropDismiss: true,
      componentProps: {
        acceptAnnulation: accept,
      },
    });
    modalSuccess.onDidDismiss().then(() => {});
    return await modalSuccess.present();
  }
}
