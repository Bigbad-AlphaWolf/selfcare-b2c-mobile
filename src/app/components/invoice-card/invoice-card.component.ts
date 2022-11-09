import { Component, OnInit, Input } from '@angular/core';
import { BILL_STATUS, InvoiceOrange } from 'src/app/models/invoice-orange.model';
import { BillsService } from 'src/app/services/bill-service/bills.service';
import { NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { MONTHS } from 'src/app/utils/constants';
import { UnpaidBillModalComponent } from '../unpaid-bill-modal/unpaid-bill-modal.component';
import { OPERATION_TYPE_SENEAU_BILLS, OPERATION_TYPE_SENELEC_BILLS } from 'src/app/utils/operations.constants';
import { FeeModel } from 'src/app/services/orange-money-service';
import { FeesService } from 'src/app/services/fees/fees.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';

@Component({
  selector: 'invoice-card',
  templateUrl: './invoice-card.component.html',
  styleUrls: ['./invoice-card.component.scss'],
})
export class InvoiceCardComponent implements OnInit {
  @Input('invoice') invoice: InvoiceOrange;
  @Input() allBills: InvoiceOrange[];
  @Input('title') title: string;
  @Input() canPayBills: boolean;
  @Input() componentStyle: 'v1' | 'v2' = 'v1';
  @Input() hideDownloadBlock: boolean;
  @Input() withBorder: boolean;
  @Input() numberToRegister: string;
  @Input() operation: string;
  @Input() counterToFav: boolean;
  @Input() fees: FeeModel[];
  billStatus = BILL_STATUS;
  MONTHS = MONTHS;
  OPERATION_TYPE_SENELEC_BILLS = OPERATION_TYPE_SENELEC_BILLS;
  OPERATION_TYPE_SENEAU_BILLS = OPERATION_TYPE_SENEAU_BILLS;
  constructor(
    private billsService: BillsService,
    private oemLoggingService: OemLoggingService,
    private navController: NavController,
    private modalController: ModalController,
    private feeService: FeesService
  ) {}

  ngOnInit() {}

  downloadBill(bill: any) {
    this.oemLoggingService.registerEvent('click_download_bill');
    this.billsService.downloadBill(bill);
  }

  payBill(invoice: InvoiceOrange) {
    if (invoice?.statutFacture === BILL_STATUS.UNPAID) {
      const unpaidBills = this.getLastestUnpaidBill();
      if (unpaidBills?.length) {
        // invoice = lastUnpaidBill;
        this.openModalUnpaidBill(unpaidBills);
        return;
      }
      let fee;
      if (this.operation === OPERATION_TYPE_SENELEC_BILLS || this.operation === OPERATION_TYPE_SENEAU_BILLS) {
        fee = this.feeService.extractFees(this.fees, invoice?.montantFacture);
        fee.effective_fees = Math.round(fee.effective_fees);
      }
      const opXtras: OperationExtras = {
        purchaseType: this.operation,
        invoice,
        numberToRegister: this.numberToRegister,
        counterToFav: this.counterToFav,
        fee,
      };
      const navExtras: NavigationExtras = { state: opXtras };
      this.navController.navigateForward(['/operation-recap'], navExtras);
    }
  }

  getLastestUnpaidBill() {
    const unpaidBillsArray = this.allBills.filter(bill => {
      return (
        bill.statutFacture === 'unpaid' && bill.nfact !== this.invoice.nfact && new Date(bill.dateEmissionfacture).getTime() < new Date(this.invoice.dateEmissionfacture).getTime()
      );
    });
    return unpaidBillsArray.reverse();
  }

  async openModalUnpaidBill(unpaidBills) {
    const modal = await this.modalController.create({
      component: UnpaidBillModalComponent,
      cssClass: 'select-recipient-modal',
      componentProps: {
        unpaidBills,
        operation: this.operation,
      },
    });
    modal.onDidDismiss().then(response => {
      if (response?.data) {
        let fee;
        const invoice = unpaidBills[0];
        if (this.operation === OPERATION_TYPE_SENELEC_BILLS || this.operation === OPERATION_TYPE_SENEAU_BILLS) {
          fee = this.feeService.extractFees(this.fees, invoice?.montantFacture);
          fee.effective_fees = Math.round(fee.effective_fees);
        }
        const opXtras: OperationExtras = {
          purchaseType: this.operation,
          invoice,
          fee,
        };
        const navExtras: NavigationExtras = { state: opXtras };
        this.navController.navigateForward(['/operation-recap'], navExtras);
      }
    });
    return await modal.present();
  }
}
