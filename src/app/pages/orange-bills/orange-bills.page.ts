import { Component, OnInit } from '@angular/core';
import { previousMonths } from 'src/app/utils/utils';
import { MonthOem } from 'src/app/models/month.model';
import { BillsService } from 'src/app/services/bill-service/bills.service';
import { InvoiceOrange } from 'src/app/models/invoice-orange.model';
import { Observable } from 'rxjs';
import { SessionOem } from 'src/app/services/session-oem/session-oem.service';

@Component({
  selector: 'app-orange-bills',
  templateUrl: './orange-bills.page.html',
  styleUrls: ['./orange-bills.page.scss'],
 
})
export class OrangeBillsPage implements OnInit {
  months : MonthOem[] = [];
  bordereau$:Observable<InvoiceOrange>;
  factures$:Observable<InvoiceOrange[]>;
  constructor(private billsService:BillsService, private session:SessionOem) { }
  onChangeLine(){
  }
  ngOnInit() {
    this.months = previousMonths(8);
    this.bordereau$ = this.billsService.bordereau(SessionOem.CODE_CLIENT);
    this.factures$ = this.billsService.invoices(SessionOem.CODE_CLIENT);
  }

}
