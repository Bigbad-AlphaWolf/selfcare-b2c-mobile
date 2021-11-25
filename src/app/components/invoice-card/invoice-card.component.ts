import {Component, OnInit, Input} from '@angular/core';
import {BILL_STATUS, InvoiceOrange} from 'src/app/models/invoice-orange.model';
import {FollowAnalyticsService} from 'src/app/services/follow-analytics/follow-analytics.service';
import {BillsService} from 'src/app/services/bill-service/bills.service';
import {NavigationExtras} from '@angular/router';
import {NavController} from '@ionic/angular';
import {OperationExtras} from 'src/app/models/operation-extras.model';
import {OPERATION_BLOCK_TRANSFER, OPERATION_PAY_ORANGE_BILLS} from 'src/shared';

@Component({
  selector: 'invoice-card',
  templateUrl: './invoice-card.component.html',
  styleUrls: ['./invoice-card.component.scss']
})
export class InvoiceCardComponent implements OnInit {
  @Input('invoice') invoice: InvoiceOrange;
  @Input('title') title: string;
  @Input() canPayBills: boolean;
  @Input() componentStyle: 'v1' | 'v2' = 'v1';
  billStatus = BILL_STATUS;
  constructor(
    private billsService: BillsService,
    private followAnalyticsService: FollowAnalyticsService,
    private navController: NavController
  ) {}

  ngOnInit() {
    console.log('canPayBills', this.canPayBills);
  }

  downloadBill(bill: any) {
    this.followAnalyticsService.registerEventFollow('click_download_bill', 'event', 'clicked');
    this.billsService.downloadBill(bill);
  }

  payBill(invoice: any) {
    const opXtras: OperationExtras = {
      purchaseType: OPERATION_PAY_ORANGE_BILLS,
      invoice
    };
    const navExtras: NavigationExtras = {state: opXtras};
    this.navController.navigateForward(['/operation-recap'], navExtras);
  }
}
