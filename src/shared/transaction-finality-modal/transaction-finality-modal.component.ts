import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OPERATION_TYPE_CARD_TO_WALLET } from 'src/app/utils/operations.constants';
import { OPERATION_TRANSACTION_STATUS } from '..';

@Component({
  selector: 'app-transaction-finality-modal',
  templateUrl: './transaction-finality-modal.component.html',
  styleUrls: ['./transaction-finality-modal.component.scss'],
})
export class TransactionFinalityModalComponent implements OnInit {
  @Input() operationStatus: string;
  @Input() purchaseType: string;
  @Input() recipientMsisdn: string;
  @Input() buyForMe: boolean;
  @Input() recipientName: string;
  @Input() paymentMod: string;
  @Input() msisdnBuyer: string;
  @Input() amount: string;
  @Input() dateAchat = this.dashboardService.getCurrentDate();
  OPERATION_TRANSACTION_STATUS = OPERATION_TRANSACTION_STATUS;
  OPERATION_TYPE_CARD_TO_WALLET = OPERATION_TYPE_CARD_TO_WALLET;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {}

  terminer() {
    this.modalController.dismiss();
    this.router.navigate(['/dashboard']);
  }
}
