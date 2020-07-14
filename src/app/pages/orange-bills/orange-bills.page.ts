import { Component, OnInit } from '@angular/core';
import { previousMonths } from 'src/app/utils/utils';
import { MonthOem } from 'src/app/models/month.model';
import { BillsService } from 'src/app/services/bill-service/bills.service';
import { InvoiceOrange } from 'src/app/models/invoice-orange.model';
import { Observable } from 'rxjs';
import { SessionOem } from 'src/app/services/session-oem/session-oem.service';
import { REGEX_FIX_NUMBER } from 'src/shared';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { MatBottomSheet } from '@angular/material';
import { LinesComponent } from 'src/app/components/lines/lines.component';
import { NavController } from '@ionic/angular';

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
  codeClient: any;
  constructor(
    private billsService:BillsService, 
    private navCtl:NavController, 
    private matBottomSheet: MatBottomSheet,
    ) { }
  onChangeLine(){
    this.openLinesBottomSheet();
    
  }
  onMonthChanged($evt:CustomEvent){
    let month:MonthOem = this.months.find((m)=>m.position == $evt.detail.value);
    this.initData(month);
    
  }
  ngOnInit() {
    this.months = previousMonths(8);
    this.phone = SessionOem.PHONE;
    this.codeClient = SessionOem.CODE_CLIENT;
    this.updatePhoneType();

    this.initData(this.months[0]);
  }

  updatePhoneType(){
    (REGEX_FIX_NUMBER.test(this.phone))? this.invoiceType = 'LANDLINE' : this.invoiceType = 'MOBILE';
  }

  initData(month:MonthOem){
    this.bordereau$ = this.billsService.bordereau(this.codeClient, this.invoiceType, month);
    this.factures$ = this.billsService.invoices(this.codeClient,  this.invoiceType, this.phone, month);
  }


  mailToCustomerService() {
    this.billsService.mailToCustomerService();
  }

  public openLinesBottomSheet() {
    this.matBottomSheet
      .open(LinesComponent, {
        backdropClass: "oem-ion-bottomsheet",
      })
      .afterDismissed()
      .subscribe((result: any) => {
        console.log('ok',result);
        this.phone = result.phone;
        this.updatePhoneType();
    
        this.initData(this.months[0]);
      });
  }

  goBack(){
    this.navCtl.pop();
  }

}
