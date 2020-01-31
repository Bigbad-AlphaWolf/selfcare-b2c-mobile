import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillsService } from '../services/bill-service/bills.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { REGEX_FIX_NUMBER } from 'src/shared';
import { BillModel, billsFixePostpaidOpened } from '../dashboard';
import { AuthenticationService } from '../services/authentication-service/authentication.service';

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
  clientId;

  constructor(
    private router: Router,
    private billsService: BillsService,
    private dashboardService: DashboardService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.currentNumber = this.dashboardService.getCurrentPhoneNumber();
    this.authService.getSubscription(this.currentNumber).subscribe(
      (res: any) => {
          this.clientId = res.clientCode;
          this.error = false;
          this.subscribeBillServices(this.clientId);
      },
      err => {
          this.error = true;
      }
  );

  billsFixePostpaidOpened.subscribe(x => {
    console.log('getIN');
    
    this.authService.getSubscription(this.currentNumber).subscribe(
      (res: any) => {
          this.clientId = res.clientCode;
          this.error = false;
          this.subscribeBillServices(this.clientId);
      },
      err => {
          this.error = true;
      }
  );
  } )
  }

  // subscribeBillServices() {
  //   if (REGEX_FIX_NUMBER.test(this.currentNumber)) {
  //     this.bordereau = true;
  //     this.billsService.getIdClient().subscribe((idClient: string) => {
  //       this.billsService.getBillsPackageAPI(idClient).subscribe(res => {
  //         this.loading = false;
  //         res === 'error' ? (this.error = true) : (this.bills = res);
  //       });
  //     });
  //   } else {
  //     this.billsService.getUserBills();
  //     this.billsService.getBillsEmit().subscribe(res => {
  //       this.loading = false;
  //       res === 'error' ? (this.error = true) : (this.bills = res);
  //     });
  //   }
  // }

  subscribeBillServices(clientId: string) {
    if (REGEX_FIX_NUMBER.test(this.currentNumber)) {
        this.bordereau = true;
        this.billsService.getBillsPackage(clientId).subscribe(
            res => {
                this.loading = false;
                this.bills = res;
            },
            error => {
                this.loading = false;
                this.error = true;
            }
        );
        this.billsService.getUserBillsPackage(clientId);
    } else {
      console.log('ici');
      
        this.billsService.getUserBills(this.clientId);
        this.billsService.getBills(this.clientId).subscribe(res => {
            this.loading = false;
            res === 'error' ? (this.error = true) : (this.bills = res);
        });
    }
}

  /* getBills() {
    this.billsService.getUserBills();
  } */
  getBills() {
    this.billsService.getUserBills(this.clientId);
}

  mailToCustomerService() {
    this.billsService.mailToCustomerService();
  }

  downloadBill(bill: any) {
    this.billsService.downloadBill(bill);
}

  goToMenu() {
    this.router.navigate(['/dashboard']);
  }

  goBillsDetails(bill: BillModel) {
    const numClient = this.clientId;
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
