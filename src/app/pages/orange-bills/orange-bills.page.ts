import { Component, OnInit } from '@angular/core';
import { previousMonths } from 'src/app/utils/utils';
import { MonthOem } from 'src/app/models/month.model';
import { BillsService } from 'src/app/services/bill-service/bills.service';
import { BILL_STATUS, InvoiceOrange } from 'src/app/models/invoice-orange.model';
import { Observable, of } from 'rxjs';
import { SessionOem } from 'src/app/services/session-oem/session-oem.service';
import { DEEPLINK_FIXE_BILL_BASE_URL, DEEPLINK_MOBILE_BILL_BASE_URL, MSISDN_TYPE, REGEX_FIX_NUMBER } from 'src/shared';
import { LinesComponent } from 'src/app/components/lines/lines.component';
import { NavController, ModalController } from '@ionic/angular';
import { map, switchMap, tap } from 'rxjs/operators';
import { OPERATION_TYPE_PAY_BILL, OPERATION_TYPE_SENEAU_BILLS, OPERATION_TYPE_SENELEC_BILLS, OPERATION_TYPE_TERANGA_BILL } from 'src/app/utils/operations.constants';
import { FeesService } from 'src/app/services/fees/fees.service';
import { OM_LABEL_SERVICES } from 'src/app/utils/bills.util';
import { FeeModel } from 'src/app/services/orange-money-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-orange-bills',
  templateUrl: './orange-bills.page.html',
  styleUrls: ['./orange-bills.page.scss'],
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
  // isBordereauLoading: boolean;
  isFactureLoading: boolean;
  moisDispo: number;
  canPayBills: boolean;
  filters = [
    { label: 'Impayée', value: BILL_STATUS?.UNPAID },
    { label: 'Payée', value: BILL_STATUS?.PAID },
    { label: 'En traitement', value: BILL_STATUS?.INITIALIZED },
  ];
  selectedFilter;
  factures: InvoiceOrange[];
  filteredFactures: InvoiceOrange[];
  payForOtherInput: {
    ligne: string;
    type: string;
    clientCode: string;
    inputPhone: string;
    operationType: string;
    counterToRattach: boolean;
  };
  operationType: string;
  fees: FeeModel[] = [];
  constructor(
    private billsService: BillsService,
    private authenticationService: AuthenticationService,
    private feesService: FeesService,
    private navCtl: NavController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  selectFilter(filter) {
    this.selectedFilter = filter;
    this.filteredFactures = this.factures.filter(bill => bill.statutFacture === filter?.value);
  }

  onChangeLine() {
    this.openLinesModal();
  }

  onMonthChanged($evt: CustomEvent) {
    this.month = this.months.find(m => m.position == $evt.detail.value);
    this.initData();
  }

  async ngOnInit() {
    this.payForOtherInput = history.state;
    this.operationType = this.payForOtherInput?.operationType;
    console.log(this.payForOtherInput);
    const isDeeplink = await this.checkDeeplinks();
    if (
      (this.payForOtherInput?.ligne && this.payForOtherInput?.type === 'FIXE') ||
      this.operationType === OPERATION_TYPE_SENELEC_BILLS ||
      this.operationType === OPERATION_TYPE_SENEAU_BILLS ||
      isDeeplink
    ) {
      this.canPayBills = true;
      this.isFactureLoading = true;
      this.billsService
        .getNumberUnpaidBills(this.payForOtherInput)
        .pipe(
          switchMap(unpaidBills => {
            if (this.operationType === OPERATION_TYPE_SENELEC_BILLS || this.operationType === OPERATION_TYPE_SENEAU_BILLS) {
              const service = this.operationType === OPERATION_TYPE_SENELEC_BILLS ? OM_LABEL_SERVICES.SENELEC : OM_LABEL_SERVICES.SDE;
              return this.feesService.getFeesByOMService(service).pipe(
                switchMap(fees => {
                  this.fees = fees;
                  return of(unpaidBills);
                })
              );
            } else {
              return of(unpaidBills);
            }
          }),
          tap(res => {
            this.selectedFilter = null;
            this.factures = res;
            this.filteredFactures = res;
            this.isFactureLoading = false;
          })
        )
        .subscribe();
      return;
    }
    const inputPhone = this.payForOtherInput?.inputPhone;
    this.phone = this.payForOtherInput?.ligne ? this.payForOtherInput.ligne : inputPhone ? inputPhone : SessionOem.PHONE;
    this.codeClient = this.payForOtherInput?.ligne
      ? this.payForOtherInput.clientCode
      : inputPhone
      ? this.payForOtherInput.clientCode
      : SessionOem.CODE_CLIENT;
    // this.canPayBills =
    //   isFixPostpaid(SessionOem.FORMULE) ||
    //   POSTPAID_TERANGA_OFFERS_ID.includes(SessionOem.CODE_FORMULE);
    this.canPayBills = true;
    this.updatePhoneType();
    this.initData();
  }

  updatePhoneType() {
    REGEX_FIX_NUMBER.test(this.phone) ? (this.invoiceType = 'LANDLINE') : (this.invoiceType = 'MOBILE');
  }

  async initData() {
    // this.isBordereauLoading = this.invoiceType === 'LANDLINE';
    this.isFactureLoading = true;
    if (!this.moisDispo) this.moisDispo = await this.billsService.moisDisponible(this.codeClient, this.invoiceType, this.phone);

    this.months = previousMonths(this.moisDispo);
    if (!this.month) this.month = this.months[0];

    // this.bordereau$ = this.billsService
    //   .bordereau(this.codeClient, this.invoiceType, this.phone, this.month)
    //   .pipe(tap((r) => (this.isBordereauLoading = false)));

    this.factures$ = this.billsService.invoices(this.codeClient, this.invoiceType, this.phone, this.month).pipe(
      map(res => {
        if (this.payForOtherInput?.ligne) {
          const resp = res.filter(bill => {
            return bill.statutFacture === BILL_STATUS.UNPAID;
          });
          resp.forEach(billEl => {
            billEl.nfact = billEl.nfact.substring(9);
          });
          return resp;
        }
        return res;
      }),
      tap(r => {
        this.selectedFilter = null;
        this.factures = r;
        this.filteredFactures = r;
        this.isFactureLoading = false;
      })
    );
    this.factures$.subscribe();
  }

  mailToCustomerService() {
    this.billsService.mailToCustomerService();
  }

  async openLinesModal() {
    const modal = await this.modalController.create({
      component: LinesComponent,
      cssClass: 'select-recipient-modal',
      componentProps: {
        phone: this.phone,
      },
    });
    modal.onDidDismiss().then(response => {
      if (response?.data) {
        this.phone = response.data.phone;
        this.codeClient = response.data.codeClient;
        this.updatePhoneType();
        this.initData();
      }
    });
    return await modal.present();
  }

  async checkDeeplinks() {
    const ligne = this.route.snapshot.paramMap.get('msisdn');
    if (!ligne) return 0;
    let operationType = OPERATION_TYPE_TERANGA_BILL;
    let type = MSISDN_TYPE.MOBILE;
    if (this.router.url.includes(DEEPLINK_FIXE_BILL_BASE_URL)) {
      operationType = OPERATION_TYPE_PAY_BILL;
      type = MSISDN_TYPE.FIXE;
    }
    const sub = await this.authenticationService.getSubscriptionForTiers(ligne).toPromise();
    const clientCode = sub?.clientCode;
    this.payForOtherInput = {
      ligne,
      type,
      clientCode,
      inputPhone: ligne,
      operationType,
      counterToRattach: false,
    };
    return 1;
  }

  goBack() {
    this.navCtl.pop();
  }
}
