import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { MatDialog } from '@angular/material/dialog';
import { Subject, of, Observable } from 'rxjs';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { isDelayedBill, MAIL_URL, MAXIMUM_PAYABLE_BILL_AMOUNT, UNKNOWN_ECHEANCE } from 'src/shared';
import { ModalSuccessComponent } from 'src/shared/modal-success/modal-success.component';
import * as SecureLS from 'secure-ls';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { tap, map, catchError } from 'rxjs/operators';
import { InvoiceOrange } from 'src/app/models/invoice-orange.model';
import { MonthOem } from 'src/app/models/month.model';
import { BillPaymentCbModel, BillPaymentCbResponseModel, BillPaymentModel } from 'src/app/models/bill-payment.model';
import { OemLoggingService } from '../oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';
const ls = new SecureLS({ encodingType: 'aes' });
const { BILL_SERVICE, SERVER_API_URL } = environment;
const lastSlipEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/last-bordereau`;
const BORDEREAU_ENDPOINT = `${SERVER_API_URL}/${BILL_SERVICE}/api/v1/bordereau`;
const INVOICE_ENDPOINT = `${SERVER_API_URL}/${BILL_SERVICE}/api/v1/facture`;
const INVOICE_MOIS_DISPO_ENDPOINT = `${SERVER_API_URL}/${BILL_SERVICE}/api/get-last-month`;
const billsEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/v1/bordereau`;
const billsDetailEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/v1/facture`;
const paybillsEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/v1/bill-payment`;
const unpaidBillEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/v1/unpaid-bill`;
const billAmountLimitEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/bill-amount-limit`;
const billPayBycbInitEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/v1/card-bill-payment`;

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  getBillsSubject: Subject<any> = new Subject<any>();
  getBillsPackageSubject: Subject<any> = new Subject<any>();
  getBillsDetailSubject: Subject<any> = new Subject<any>();
  currentNumber;

  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService,
    private dialog: MatDialog,
    private platform: Platform,
    private oemLoggingService: OemLoggingService,
    private inAppBrowser: InAppBrowser
  ) {
    this.currentNumber = this.dashboardService.getCurrentPhoneNumber();
  }

  getBillsMobile(numClient: string) {
    this.currentNumber = this.dashboardService.getCurrentPhoneNumber();
    return this.http.get(`${INVOICE_ENDPOINT}/${numClient}?sort=summaryYear,desc&sort=summaryMonth,desc&type=MOBILE&size=20&page=0`).pipe(
      tap(
        () => this.oemLoggingService.registerEvent('Bordereaux_Mobile_Success', convertObjectToLoggingPayload({ msisdn: this.currentNumber })),
        () => this.oemLoggingService.registerEvent('Bordereaux_Mobile_Error', convertObjectToLoggingPayload({ msisdn: this.currentNumber }))
      )
    );
  }
  bordereau(codeClient: string, type: string, phone?: string, month?: MonthOem): Observable<InvoiceOrange> {
    return this.http.get(`${BORDEREAU_ENDPOINT}/${codeClient}?type=${type}&search=summaryYear:${month.year},summaryMonth:${month.position}`).pipe(
      tap(
        () => this.oemLoggingService.registerEvent('Bordereaux_Mobile_Success', convertObjectToLoggingPayload({ phone: phone })),
        () => this.oemLoggingService.registerEvent('Bordereaux_Mobile_Error', convertObjectToLoggingPayload({ phone: phone }))
      ),
      map((rs: any) => {
        if (rs.length) return rs[0];
        return null;
      })
    );
  }

  invoices(codeClient: string, type: string, phone?: string, month?: MonthOem): Observable<InvoiceOrange[]> {
    return this.http.get<InvoiceOrange[]>(`${INVOICE_ENDPOINT}/${codeClient}?type=${type}&line=${phone}&search=${phone ? 'phoneNumber:' + phone + ',' : ''}`).pipe(
      map(res => {
        res.forEach(bill => (bill.isDelayed = isDelayedBill(bill)));
        return res;
      }),
      tap(
        () => this.oemLoggingService.registerEvent('Facture_Mobile_Success', convertObjectToLoggingPayload({ phone: phone })),
        () => this.oemLoggingService.registerEvent('Facture_Mobile_Error', convertObjectToLoggingPayload({ phone: phone }))
      )
    );
  }

  async moisDisponible(codeClient: string, type: string, phone?: string) {
    return await this.http
      .get<string>(`${INVOICE_MOIS_DISPO_ENDPOINT}/${codeClient}?type=${type}${type === 'MOBILE' ? '&search=phoneNumber:' + phone : ''}`)
      .pipe(
        catchError(() => {
          return of(null);
        })
      )
      .toPromise<number>();
  }
  getBillsPackage(numClient: string) {
    this.currentNumber = this.dashboardService.getCurrentPhoneNumber();
    return this.http.get(`${billsEndpoint}/${numClient}?sort=summaryYear,desc&sort=summaryMonth,desc&type=LANDLINE&size=20&page=0`).pipe(
      tap(
        (billsPackage: any) => {
          if (billsPackage && billsPackage.length) {
            this.oemLoggingService.registerEvent('Bordereaux_Fixe_Success', convertObjectToLoggingPayload({ phone: this.currentNumber }));
            ls.set(`lastBillsPackage_${this.currentNumber}`, billsPackage);
            return billsPackage;
          } else {
            const lastLoadedBillsPackage = ls.get(`lastBillsPackage_${this.currentNumber}`);
            return lastLoadedBillsPackage;
          }
        },
        () => {
          this.oemLoggingService.registerEvent('Birdereaux_Fixe_Error', convertObjectToLoggingPayload({ phone: this.currentNumber }));
        }
      )
    );
  }

  getFactureMobile(numClient: string) {
    // api/v1/facture/365915?type=MOBILE&search=year:2019,month:11
    this.currentNumber = this.dashboardService.getCurrentPhoneNumber();
    return this.http.get(`${INVOICE_ENDPOINT}/${numClient}?type=MOBILE&search=phoneNumber:${this.currentNumber}&sort=year,desc&sort=month,desc`).pipe(
      map(
        (bills: any) => {
          if (bills && bills.length) {
            this.oemLoggingService.registerEvent('Factures_Mobile_Success', convertObjectToLoggingPayload({ phone: this.currentNumber }));
            ls.set(`lastBills_${this.currentNumber}`, bills);
            return bills;
          } else {
            const lastLoadedBills = ls.get(`lastBills_${this.currentNumber}`);
            return lastLoadedBills;
          }
        },
        () => {
          this.oemLoggingService.registerEvent('Factures_Mobile_Error', convertObjectToLoggingPayload({ phone: this.currentNumber }));
        }
      )
    );
  }

  getBillsDetail(payload: { numClient: string; groupage: string; mois: number; annee: number }) {
    // api/v1/facture/365915?type=MOBILE&search=year:2019,month:11
    if (!payload) return of({});

    if (this.currentNumber.startsWith('33')) {
      return this.http.get(`${billsDetailEndpoint}/${payload.numClient}?type=LANDLINE&search=year:${payload.annee},month:${payload.mois}`).pipe(
        tap(
          () => this.oemLoggingService.registerEvent('Factures_Fixe_Success', convertObjectToLoggingPayload({ phone: this.currentNumber })),
          () => this.oemLoggingService.registerEvent('Factures_Fixe_Error', convertObjectToLoggingPayload({ phone: this.currentNumber }))
        )
      );
    } else {
      return this.http.get(`${billsDetailEndpoint}/${payload.numClient}?type=MOBILE&search=year:${payload.annee},month:${payload.mois}`).pipe(
        tap(
          () => this.oemLoggingService.registerEvent('Factures_Mobile_Success', convertObjectToLoggingPayload({ phone: this.currentNumber })),
          () => this.oemLoggingService.registerEvent('Factures_Mobile_Error', convertObjectToLoggingPayload({ phone: this.currentNumber }))
        )
      );
    }
  }

  getBillAmountLimit() {
    return this.http.get<number>(`${billAmountLimitEndpoint}`).pipe(
      catchError(_ => {
        return of(MAXIMUM_PAYABLE_BILL_AMOUNT);
      })
    );
  }

  getUserBillsDetail(payload: { numClient: string; groupage: string; mois: number; annee: number }) {
    this.getBillsDetail(payload).subscribe(
      res => {
        this.getBillsDetailSubject.next(res);
      },
      () => {
        this.getBillsDetailSubject.next('error');
      }
    );
  }

  downloadBill(bill: any) {
    if (bill.contentNotNull) {
      if (this.platform.is('ios')) {
      }
      this.inAppBrowser.create(bill.url, '_system');
      this.oemLoggingService.registerEvent('download_bill_success');
    } else {
      this.oemLoggingService.registerEvent('download_bill_error');
      this.openNotAvailableDialog();
    }
  }

  downloadUserBill(bill: any) {
    bill.downloading = true;
    this.downloadBill(bill);
    bill.downloading = false;
  }
  
  convertBase64ToBlob(b64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  getBillsEmit() {
    return this.getBillsSubject.asObservable();
  }

  getBillPackageEmit() {
    return this.getBillsPackageSubject.asObservable();
  }

  getBillDetailEmit() {
    return this.getBillsDetailSubject.asObservable();
  }

  openNotAvailableDialog() {
    const type = 'facture';
    const dialogRef = this.dialog.open(ModalSuccessComponent, {
      data: { type },
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  mailToCustomerService() {
    window.location.href = MAIL_URL;
  }

  downloadUserBillPackageAPI(billPack: any) {
    // FollowAnalytics.logEvent('download_bill', this.currentNumber);
    billPack.downloading = true;

    const pdfWindow = window.open('');
    pdfWindow.document.write(
      // tslint:disable-next-line: quotemark
      "<iframe width='100%' height='100%' src='" + billPack.url + "'></iframe>"
    );
    billPack.downloading = false;
  }

  getIdClient() {
    return this.dashboardService.getIdClient();
  }

  getLastSlip(idClient: any) {
    return this.http.get(`${lastSlipEndpoint}/${idClient}`);
  }

  payBill(data: BillPaymentModel) {
    return this.http.post(`${paybillsEndpoint}`, data).pipe(
      tap(success => {
        const eventName = `PAIEMENT_FACTURES_${data.paymentCategory}_SUCCESS`;
        const { payerEncodedPin, payerEm, ...followParams } = data;
        this.oemLoggingService.registerEvent(eventName, convertObjectToLoggingPayload(followParams));
      }),
      catchError(err => {
        const errorName = `PAIEMENT_FACTURES_${data.paymentCategory}_FAILED`;
        const { payerEncodedPin, payerEm, ...followParams } = data;
        followParams['error'] = err;
        this.oemLoggingService.registerEvent(errorName, convertObjectToLoggingPayload(followParams));
        throw new Error(err);
      })
    );
  }

  getNumberUnpaidBills(payload: { ligne: string; type: string }) {
    return this.http.get<InvoiceOrange[]>(`${unpaidBillEndpoint}/${payload.ligne}?category=${payload.type}`).pipe(
      map(res => {
        res.forEach(bill => {
          bill.statutFacture = bill.statutFacture.toLowerCase();
          const dates = bill.dateEmissionfacture.split('-').map(date => +date);
          const month = dates[1];
          const year = dates[0];
          bill.annee = month === 1 ? year - 1 : year;
          bill.mois = month === 1 ? 12 : month - 1;
          bill.dateEcheance = UNKNOWN_ECHEANCE;
        });
        return res;
      })
    );
  }

  initBilPaymentByBankCard(payload: BillPaymentCbModel) {
    return this.http.post<BillPaymentCbResponseModel>(`${billPayBycbInitEndpoint}`, payload)
  }
}
