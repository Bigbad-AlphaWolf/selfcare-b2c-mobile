import {Component, OnInit} from '@angular/core';
import {previousMonths} from 'src/app/utils/utils';
import {MonthOem} from 'src/app/models/month.model';
import {BillsService} from 'src/app/services/bill-service/bills.service';
import {InvoiceOrange} from 'src/app/models/invoice-orange.model';
import {Observable} from 'rxjs';
import {SessionOem} from 'src/app/services/session-oem/session-oem.service';
import {REGEX_FIX_NUMBER} from 'src/shared';
import {LinesComponent} from 'src/app/components/lines/lines.component';
import {NavController, ModalController} from '@ionic/angular';
import {tap} from 'rxjs/operators';
import {isFixPostpaid} from 'src/app/dashboard';

@Component({
  selector: 'app-orange-bills',
  templateUrl: './orange-bills.page.html',
  styleUrls: ['./orange-bills.page.scss']
})
export class OrangeBillsPage implements OnInit {
  months: MonthOem[] = [];
  bordereau$: Observable<InvoiceOrange>;
  factures$: Observable<InvoiceOrange[]>;
  invoiceType: string;
  phone: string;
  codeClient: any;
  month: MonthOem;
  isProcessing: boolean;
  isBordereauLoading: boolean;
  isFactureLoading: boolean;
  moisDispo: number;
  canPayBills: boolean;
  constructor(private billsService: BillsService, private navCtl: NavController, private modalController: ModalController) {}
  onChangeLine() {
    this.openLinesModal();
  }
  onMonthChanged($evt: CustomEvent) {
    this.month = this.months.find(m => m.position == $evt.detail.value);
    this.initData();
  }
  ngOnInit() {
    this.phone = SessionOem.PHONE;
    this.codeClient = SessionOem.CODE_CLIENT;
    this.canPayBills = isFixPostpaid(SessionOem.FORMULE);
    console.log('canPayBills', this.canPayBills);

    this.updatePhoneType();
    this.initData();
  }

  updatePhoneType() {
    REGEX_FIX_NUMBER.test(this.phone) ? (this.invoiceType = 'LANDLINE') : (this.invoiceType = 'MOBILE');
  }

  async initData() {
    this.isBordereauLoading = this.invoiceType === 'LANDLINE';
    this.isFactureLoading = true;
    if (!this.moisDispo) this.moisDispo = await this.billsService.moisDisponible(this.codeClient, this.invoiceType, this.phone);

    this.months = previousMonths(this.moisDispo);
    if (!this.month) this.month = this.months[0];

    this.bordereau$ = this.billsService
      .bordereau(this.codeClient, this.invoiceType, this.phone, this.month)
      .pipe(tap(r => (this.isBordereauLoading = false)));

    this.factures$ = this.billsService
      .invoices(this.codeClient, this.invoiceType, this.phone, this.month)
      .pipe(tap(r => (this.isFactureLoading = false)));
  }

  mailToCustomerService() {
    this.billsService.mailToCustomerService();
  }

  async openLinesModal() {
    const modal = await this.modalController.create({
      component: LinesComponent,
      cssClass: 'select-recipient-modal',
      componentProps: {
        phone: this.phone
      }
    });
    modal.onDidDismiss().then(response => {
      if (response && response.data) {
        this.phone = response.data.phone;
        this.codeClient = response.data.codeClient;
        this.updatePhoneType();
        this.initData();
      }
    });
    return await modal.present();
  }

  goBack() {
    this.navCtl.pop();
  }
}
