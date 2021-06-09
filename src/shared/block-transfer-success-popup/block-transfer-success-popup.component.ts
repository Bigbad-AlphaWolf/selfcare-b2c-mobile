import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PurchaseModel } from 'src/app/models/purchase.model';
import { ANNULATION_TRANSFER_DEADLINE } from '..';

@Component({
  selector: 'app-block-transfer-success-popup',
  templateUrl: './block-transfer-success-popup.component.html',
  styleUrls: ['./block-transfer-success-popup.component.scss'],
})
export class BlockTransferSuccessPopupComponent implements OnInit {
  @Input() transactionToBlock: PurchaseModel;
  annulationDeadline = ANNULATION_TRANSFER_DEADLINE;

  constructor(
    public modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  formatDate(date: any) {
    return new Date(date);
  }

  close() {
    this.modalController.dismiss();
    this.router.navigate(['/dashboard']);
  }

  goFillAnnulationForm() {
    this.modalController.dismiss();
    this.router.navigate(['/cancel-transaction-om']);
  }
}
