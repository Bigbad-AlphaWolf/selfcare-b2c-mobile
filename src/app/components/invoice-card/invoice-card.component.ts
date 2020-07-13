import { Component, OnInit, Input } from '@angular/core';
import { InvoiceOrange } from 'src/app/models/invoice-orange.model';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { BillsService } from 'src/app/services/bill-service/bills.service';

@Component({
  selector: 'invoice-card',
  templateUrl: './invoice-card.component.html',
  styleUrls: ['./invoice-card.component.scss'],
})
export class InvoiceCardComponent implements OnInit {
  @Input('invoice') invoice:InvoiceOrange;
  @Input('title') title:string;
  constructor(    private billsService: BillsService,

    private followAnalyticsService: FollowAnalyticsService) { }

  ngOnInit() {}

  downloadBill(bill: any) {
    this.followAnalyticsService.registerEventFollow(
      'click_download_bill',
      'event',
      'clicked'
    );
    this.billsService.downloadBill(bill);
  }

}
