import { Component, OnInit } from '@angular/core';
import { previousMonths } from 'src/app/utils/utils';
import { MonthOem } from 'src/app/models/month.model';
import { BillsService } from 'src/app/services/bill-service/bills.service';
import { InvoiceOrange } from 'src/app/models/invoice-orange.model';
import { Observable } from 'rxjs';
import { SessionOem } from 'src/app/services/session-oem/session-oem.service';
import { REGEX_FIX_NUMBER } from 'src/shared';

@Component({
  selector: 'app-orange-bills',
  templateUrl: './orange-bills.page.html',
  styleUrls: ['./orange-bills.page.scss'],
 
})
export class OrangeBillsPage implements OnInit {
  months : MonthOem[] = [];
  bordereau$:Observable<InvoiceOrange>;
  factures$:Observable<InvoiceOrange[]>;
  invoiceType:string ;
  phone:string;
  constructor(private billsService:BillsService, private session:SessionOem) { }
  onChangeLine($evt:CustomEvent){
    let month:MonthOem = this.months.find((m)=>m.position == $evt.detail.value);
    this.initData(month);
    
  }
  ngOnInit() {
    this.months = previousMonths(8);
    this.phone = SessionOem.PHONE;
    this.updatePhoneType();

    this.initData(this.months[0]);
  }

  updatePhoneType(){
    (REGEX_FIX_NUMBER.test(this.phone))? this.invoiceType = 'LANDLINE':this.invoiceType = 'MOBILE';
  }

  initData(month:MonthOem){
    this.bordereau$ = this.billsService.bordereau(SessionOem.CODE_CLIENT, this.invoiceType, month);
    this.factures$ = this.billsService.invoices(SessionOem.CODE_CLIENT,  this.invoiceType, this.phone, month);
  }

}
