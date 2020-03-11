import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BillsService } from 'src/app/services/bill-service/bills.service';

@Component({
  selector: 'app-bills-details-mobile',
  templateUrl: './bills-details-mobile.component.html',
  styleUrls: ['./bills-details-mobile.component.scss']
})
export class BillsDetailsMobileComponent implements OnInit {
  @Input() detailsParams;
  months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
  ];
  loading = true;
  error;
  details;
  mois;
  annee;
  @Output() goback = new EventEmitter();

  constructor(private billsService: BillsService) {}

  ngOnInit() {
    this.getBills();
  }

  getBills() {
    if (this.detailsParams) {
      this.mois = this.months[this.detailsParams.mois - 1];
      this.annee = this.detailsParams.annee;
  }
    this.billsService.getBillsDetail(this.detailsParams).subscribe(res => {
      this.details = res;
      this.loading = false;
  });
  }

  downloadBill(bill: any) {
    this.billsService.downloadBill(bill);
}

  goBack() {
    this.goback.emit();
  }
}
