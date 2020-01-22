import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillsService } from '../services/bill-service/bills.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { REGEX_FIX_NUMBER } from 'src/shared';
import { BillModel } from '../dashboard';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.page.html',
  styleUrls: ['./bills.page.scss']
})
export class BillsPage implements OnInit {
  error;
  loading = true;
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
  bills: any;
  currentNumber;
  currentSouscription: any;
  bordereau;
  detail;
  detailParams;

  constructor(
    private router: Router,
    private billsService: BillsService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.currentNumber = this.dashboardService.getCurrentPhoneNumber();
    this.subscribeBillServices();
  }

  subscribeBillServices() {
    if (REGEX_FIX_NUMBER.test(this.currentNumber)) {
      this.bordereau = true;
      this.billsService.getIdClient().subscribe((idClient: string) => {
        this.billsService.getBillsPackageAPI(idClient).subscribe(res => {
          this.loading = false;
          res === 'error' ? (this.error = true) : (this.bills = res);
        });
      });
    } else {
      this.billsService.getUserBills();
      this.billsService.getBillsEmit().subscribe(res => {
        this.loading = false;
        res === 'error' ? (this.error = true) : (this.bills = res);
      });
    }
  }

  getBills() {
    this.billsService.getUserBills();
  }

  mailToCustomerService() {
    this.billsService.mailToCustomerService();
  }

  downloadBill(bill: any) {
    if (this.bordereau) {
      this.billsService.downloadUserBillPackage(bill);
    } else {
      this.billsService.downloadUserBill(bill);
    }
  }

  goToMenu() {
    this.router.navigate(['/dashboard']);
  }

  goBillsDetails(bill: BillModel) {
    const numClient = bill.ncli;
    const groupage = bill.groupage;
    const mois = bill.moisfact;
    const annee = bill.annefact;
    this.detailParams = { numClient, groupage, mois, annee };
    this.detail = true;
  }

  hideDetails() {
    this.detail = false;
  }
}
