import { Component, OnInit, Input } from '@angular/core';
import {
  BILL_STATUS,
  InvoiceOrange,
} from 'src/app/models/invoice-orange.model';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { BillsService } from 'src/app/services/bill-service/bills.service';
import { NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { OPERATION_PAY_ORANGE_BILLS } from 'src/shared';
import { MONTHS } from 'src/app/utils/constants';
import { UnpaidBillModalComponent } from '../unpaid-bill-modal/unpaid-bill-modal.component';

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
  billStatus = BILL_STATUS;
  MONTHS = MONTHS;
  constructor(
    private billsService: BillsService,
    private followAnalyticsService: FollowAnalyticsService,
    private navController: NavController,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  downloadBill(bill: any) {
    this.followAnalyticsService.registerEventFollow(
      'click_download_bill',
      'event',
      'clicked'
    );
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
      const opXtras: OperationExtras = {
        purchaseType: OPERATION_PAY_ORANGE_BILLS,
        invoice,
        numberToRegister: this.numberToRegister,
      };
      const navExtras: NavigationExtras = { state: opXtras };
      this.navController.navigateForward(['/operation-recap'], navExtras);
    }
  }

  getLastestUnpaidBill() {
    const unpaidBillsArray = this.allBills.filter((bill) => {
      return (
        bill.statutFacture === 'unpaid' &&
        bill.nfact !== this.invoice.nfact &&
        new Date(bill.dateEmissionfacture).getTime() <
          new Date(this.invoice.dateEmissionfacture).getTime()
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
      },
    });
    modal.onDidDismiss().then((response) => {
      if (response?.data) {
        const opXtras: OperationExtras = {
          purchaseType: OPERATION_PAY_ORANGE_BILLS,
          invoice: unpaidBills[0],
        };
        const navExtras: NavigationExtras = { state: opXtras };
        this.navController.navigateForward(['/operation-recap'], navExtras);
      }
    });
    return await modal.present();
  }
}
