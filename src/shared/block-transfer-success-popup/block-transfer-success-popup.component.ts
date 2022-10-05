import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PurchaseModel } from 'src/app/models/purchase.model';
import { ApplicationRoutingService } from 'src/app/services/application-routing/application-routing.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { ANNULATION_TRANSFER_DEADLINE } from '..';

@Component({
  selector: 'app-block-transfer-success-popup',
  templateUrl: './block-transfer-success-popup.component.html',
  styleUrls: ['./block-transfer-success-popup.component.scss'],
})
export class BlockTransferSuccessPopupComponent implements OnInit {
  @Input() transactionToBlock: PurchaseModel;
  @Input() isUserOMFull: boolean;
  @Input() isMLite: boolean;
  annulationDeadline = ANNULATION_TRANSFER_DEADLINE;
  MATH = Math;

  constructor(
    public modalController: ModalController,
    private appRouting: ApplicationRoutingService,
    private router: Router
  ) {}

  ngOnInit() {}

  formatDate(date: any) {
    return new Date(date);
  }

  close() {
    this.modalController.dismiss();
  }

  goToDashboard() {
    this.close();
    this.router.navigate(['/dashboard']);
  }

  goFillAnnulationForm() {
    this.modalController.dismiss();
    this.appRouting.goToCancelTransactionOM(this.transactionToBlock);
  }
}
