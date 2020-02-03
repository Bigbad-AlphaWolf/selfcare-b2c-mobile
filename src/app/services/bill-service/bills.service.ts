import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { MAIL_URL } from 'src/shared';
import { ModalSuccessComponent } from 'src/shared/modal-success/modal-success.component';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import * as SecureLS from 'secure-ls';
import { Platform } from '@ionic/angular';
import { FollowAnalyticsService } from '../follow-analytics/follow-analytics.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
const { BILL_SERVICE, SERVER_API_URL } = environment;
const billsPackageDownloadEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/download-bordereau-fixe`;
const lastSlipEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/last-bordereau`;
const billsEndpointAPI = `${SERVER_API_URL}/${BILL_SERVICE}/api/v1/bordereau`;
const billsDetailEndpointAPI = `${SERVER_API_URL}/${BILL_SERVICE}/api/v1/facture`;
const billsEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/v1/bordereau`;
const billsDetailEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/v1/facture`;

@Injectable({
  providedIn: 'root'
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
    private file: File,
    private platform: Platform,
    private followServ: FollowAnalyticsService,
    private inAppBrowser: InAppBrowser
  ) {
    this.currentNumber = this.dashboardService.getCurrentPhoneNumber();
  }

  /* getBills() {
    const login = this.dashboardService.getCurrentPhoneNumber();
    return this.http.get(`${billsEndpoint}/${login}`);
  } */
  getBills(numClient: string) {
    return this.http.get(`${billsEndpoint}/${numClient}?sort=summaryYear,desc&sort=summaryMonth,desc&type=MOBILE&size=20&page=0`);
}
  getBillsPackage(numClient: string) {
    return this.http.get(`${billsEndpoint}/${numClient}?sort=summaryYear,desc&sort=summaryMonth,desc&type=LANDLINE&size=20&page=0`);
  }
  getBillsAPI(numClient: string) {
    return this.http.get(
      `${billsEndpointAPI}/${numClient}?sort=summaryYear,desc&sort=summaryMonth,desc&type=MOBILE&size=20&page=0`
    );
  }
  getBillsPackageAPI(numClient: string) {
    return this.http.get(
      `${billsEndpointAPI}/${numClient}?sort=summaryYear,desc&sort=summaryMonth,desc&type=LANDLINE&size=20&page=0`
    );
  }

  getUserBillsPackage(numClient: string) {
    this.getBillsPackage(numClient).subscribe(
        (res: any[]) => {
          this.followServ.registerEventFollow('Factures_Bordereaux_Fixe_Success','event', this.currentNumber);
            this.getBillsPackageSubject.next(res);
        },
        () => {
          this.followServ.registerEventFollow('Factures_Bordereaux_Fixe_Error', 'error',this.currentNumber);
            this.getBillsPackageSubject.next('error');
        }
    );
}

  /* getUserBills() {
    this.getBills().subscribe(
      (res: any[]) => {
        res.sort((x, y) => {
          if (x.annee === y.annee) {
            return y.mois - x.mois;
          } else {
            return y.annee - x.annee;
          }
        });

        this.getBillsSubject.next(res);
      },
      err => {
        this.getBillsSubject.next('error');
      }
    );
  } */
  getUserBills(numClient: string) {
    this.getBills(numClient).subscribe(
        (res: any[]) => {
            res.sort((x, y) => {
                if (x.annee === y.annee) {
                    return y.mois - x.mois;
                } else {
                    return y.annee - x.annee;
                }
            });
            this.followServ.registerEventFollow('Factures_Bordereaux_Mobile_Success', 'event', this.currentNumber)
            // FollowAnalytics.logEvent('Factures_Bordereaux_Mobile_Success', this.currentNumber);
            this.getBillsSubject.next(res);
        },
        () => {
          this.followServ.registerEventFollow('Factures_Bordereaux_Mobile_Error', 'error', this.currentNumber)
            // FollowAnalytics.logEvent('Factures_Bordereaux_Mobile_Error', this.currentNumber);
            this.getBillsSubject.next('error');
        }
    );
}

  getUserBillsAPI(idClient: string) {
    this.getBillsAPI(idClient).subscribe(
      (res: any[]) => {
        res.sort((x, y) => {
          if (x.annee === y.annee) {
            return y.mois - x.mois;
          } else {
            return y.annee - x.annee;
          }
        });

        this.getBillsSubject.next(res);
      },
      () => {
        this.getBillsSubject.next('error');
      }
    );
  }
/* 
  getBillsPackage(numClient: string) {
    return this.http.get(`${billsPackageEndpoint}/${numClient}/0/500`);
  }
 */
  /* getUserBillsPackage(numClient: string) {
    this.getBillsPackage(numClient).subscribe(
      (res: any[]) => {
        this.getBillsPackageSubject.next(res);
      },
      err => {
        this.getBillsPackageSubject.next('error');
      }
    );
  } */

  getUserBillsPackageAPI(numClient: string) {
    this.getBillsPackageAPI(numClient).subscribe(
      (res: any[]) => {
        this.getBillsPackageSubject.next(res);
      },
      () => {
        this.getBillsPackageSubject.next('error');
      }
    );
  }

  getBillsDetailAPI(payload: {
    numClient: string;
    groupage: string;
    mois: number;
    annee: number;
  }) {
    //api/v1/facture/365915?type=MOBILE&search=year:2019,month:11
    if (this.currentNumber.startsWith('33')) {
      return this.http.get(
        `${billsDetailEndpointAPI}/${payload.numClient}?type=LANDLINE&search=year:${payload.annee},month:${payload.mois}`
      );
    } else {
      return this.http.get(
        `${billsDetailEndpointAPI}/${payload.numClient}?type=MOBILE&search=year:${payload.annee},month:${payload.mois}`
      );
    }
  }

  getBillsDetail(payload: { numClient: string; groupage: string; mois: number; annee: number }) {
    //api/v1/facture/365915?type=MOBILE&search=year:2019,month:11
    if (this.currentNumber.startsWith('33')) {
        return this.http.get(
            `${billsDetailEndpoint}/${payload.numClient}?type=LANDLINE&search=year:${payload.annee},month:${payload.mois}`
        );
    } else {
        return this.http.get(
            `${billsDetailEndpoint}/${payload.numClient}?type=MOBILE&search=year:${payload.annee},month:${payload.mois}`
        );
    }
}


  getUserBillsDetail(payload: {
    numClient: string;
    groupage: string;
    mois: number;
    annee: number;
  }) {
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
    /* this.http.get(bill.url).subscribe(
      (x: any) => {
        bill.downloading = false;
        const fileName = bill.numeroFacture + '.pdf';
        this.file
          .writeFile(
            path,
            fileName,
            this.convertBase64ToBlob(x.file, 'application/pdf'),
            { replace: true }
          )
          .then(() => {
            this.fileOpener
              .open(path + fileName, 'application/pdf')
              .catch(() => {
                // log error console.log('Error opening pdf file');
              });
          })
          .catch(() => {
            // log error console.error('Error writing pdf file');
          });
      },
      () => {
        bill.downloading = false;
        this.openNotAvailableDialog();
      }
    ); */
  } else{
      this.openNotAvailableDialog();
    }
  }

  downloadUserBill(bill: any) {
    bill.downloading = true;
    this.downloadBill(bill);
  }
  downloadUserBillAPI(bill: any) {
    // FollowAnalytics.logEvent('download_bill', this.currentNumber);
    bill.downloading = true;

    const pdfWindow = window.open('');
    pdfWindow.document.write(
      "<iframe width='100%' height='100%' src='" + bill.url + "'></iframe>"
    );
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
      data: { type }
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  mailToCustomerService() {
    window.location.href = MAIL_URL;
  }

  downloadBillPackage(billPack: any) {
    const numeroClient = billPack.ncli;
    const mois = billPack.moisfact;
    const annee = billPack.annefact;
    const tranche = billPack.tranche;
    const groupage = billPack.groupage;
    return this.http.get(
      `${billsPackageDownloadEndpoint}/pdf/${numeroClient}/${mois}/${annee}/${tranche}/${groupage}`
    );
  }

  downloadUserBillPackageAPI(billPack: any) {
    // FollowAnalytics.logEvent('download_bill', this.currentNumber);
    billPack.downloading = true;

    const pdfWindow = window.open('');
    pdfWindow.document.write(
      "<iframe width='100%' height='100%' src='" + billPack.url + "'></iframe>"
    );
    billPack.downloading = false;
  }

  downloadUserBillPackage(billPack: any) {
    billPack.downloading = true;
    this.downloadBillPackage(billPack).subscribe(
      (res: any) => {
        billPack.downloading = false;
        const base64 = res.file;
        if (navigator.userAgent.match(/crios|CriOS/i)) {
          // Only for chrome on IOS
          const pdfWindow = window.open('');
          pdfWindow.document.write(
            "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
              encodeURI(base64) +
              "'></iframe>"
          );
        } else {
          const linkSource = `data:application/pdf;base64,${base64}`;
          const downloadLink = document.createElement('a');
          const fileName = `FACTURE_${billPack.ncli}`;
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      },
      () => {
        billPack.downloading = false;
        this.openNotAvailableDialog();
      }
    );
  }

  getIdClient() {
    return this.dashboardService.getIdClient();
  }

  getLastSlip(idClient: any) {
    return this.http.get(`${lastSlipEndpoint}/${idClient}`);
  }
}
