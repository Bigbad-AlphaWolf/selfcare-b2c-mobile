import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PurchaseModel } from 'src/app/models/purchase.model';
import { ApplicationRoutingService } from 'src/app/services/application-routing/application-routing.service';
import { ANNULATION_TRANSFER_DEADLINE } from '..';

@Component({
  selector: 'app-block-transfer-success-popup',
  templateUrl: './block-transfer-success-popup.component.html',
  styleUrls: ['./block-transfer-success-popup.component.scss'],
})
export class BlockTransferSuccessPopupComponent implements OnInit {
  @Input() transactionToBlock: PurchaseModel;
  annulationDeadline = ANNULATION_TRANSFER_DEADLINE;
  MATH = Math;

  constructor(
    public modalController: ModalController,
    private appRouting: ApplicationRoutingService
  ) {}

  ngOnInit() {}

  formatDate(date: any) {
    return new Date(date);
  }

  close() {
    this.modalController.dismiss();
    this.appRouting.goToCancelTransactionOM(this.transactionToBlock);
  }

  goFillAnnulationForm() {
    this.modalController.dismiss();
    this.appRouting.goToCancelTransactionOM(this.transactionToBlock);
  }
}
