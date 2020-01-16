import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { MatDialog } from '@angular/material';
import { Subject, of } from 'rxjs';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { MAIL_URL } from 'src/shared';
import { ModalSuccessComponent } from 'src/shared/modal-success/modal-success.component';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import * as SecureLS from 'secure-ls';
import { Platform } from '@ionic/angular';
const ls = new SecureLS({ encodingType: 'aes' });
const { BILL_SERVICE, SERVER_API_URL } = environment;
const downloadBillEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/download-facture-mobile`;
const billsEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/facture-mobile`;
const billsPackageEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/bordereau-fixe`;
const billsDetailEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/facture-fixe`;
const billsPackageDownloadEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/download-bordereau-fixe`;
const idClientEndpoint = `${SERVER_API_URL}/selfcare-gateway/api/numero-client`;
const lastSlipEndpoint = `${SERVER_API_URL}/${BILL_SERVICE}/api/last-bordereau`;
const billsEndpointAPI = `${SERVER_API_URL}/${BILL_SERVICE}/api/v1/bordereau`;
const billsDetailEndpointAPI = `${SERVER_API_URL}/${BILL_SERVICE}/api/v1/facture`;
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
    private fileOpener: FileOpener,
    private platform: Platform
  ) {
    this.currentNumber = this.dashboardService.getCurrentPhoneNumber();
  }

  getBills() {
    const login = this.dashboardService.getCurrentPhoneNumber();
    return this.http.get(`${billsEndpoint}/${login}`);
  }

getBillsAPI(numClient: string) {
    return this.http.get(`${billsEndpointAPI}/${numClient}?sort=summaryYear,desc&sort=summaryMonth,desc&type=MOBILE&size=20&page=0`);
}
getBillsPackageAPI(numClient: string) {
  return this.http.get(`${billsEndpointAPI}/${numClient}?sort=summaryYear,desc&sort=summaryMonth,desc&type=LANDLINE&size=20&page=0`);
}

  getUserBills() {
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
  }

  getBillsPackage(numClient: string) {
    return this.http.get(`${billsPackageEndpoint}/${numClient}/0/500`);
  }

  getUserBillsPackage(numClient: string) {
    this.getBillsPackage(numClient).subscribe(
      (res: any[]) => {
        this.getBillsPackageSubject.next(res);
      },
      err => {
        this.getBillsPackageSubject.next('error');
      }
    );
  }

  getUserBillsPackageAPI(numClient: string) {
    this.getBillsPackage(numClient).subscribe(
      (res: any[]) => {
        this.getBillsPackageSubject.next(res);
      },
      err => {
        this.getBillsPackageSubject.next('error');
      }
    );
  }

  getBillsDetailAPI(payload: { numClient: string; groupage: string; mois: number; annee: number }) {
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

  getBillsDetail(payload: {
    numClient: string;
    groupage: string;
    mois: number;
    annee: number;
  }) {
    return this.http.get(
      `${billsDetailEndpoint}/${payload.numClient}/${payload.groupage}/${
        payload.mois
      }/${payload.annee}/0/500`
    );
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
      err => {
        this.getBillsDetailSubject.next('error');
      }
    );
  }

  downloadBill(bill: any) {
    const numeroClient = bill.numeroClient;
    const numeroFacture = bill.numeroFacture;
    const mois = bill.mois;
    const annee = bill.annee;
    const url = `${downloadBillEndpoint}/${numeroFacture}?months=${mois}&year=${annee}`;
    const token = ls.get('token');
    const headers = { Authorization: `Bearer ${token}` };
    let path = this.file.dataDirectory;
    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    }
    this.http.get(url).subscribe((x: any) => {
        bill.downloading = false;
        const fileName = bill.numeroFacture + '.pdf';
        this.file.writeFile(path, fileName, this.convertBase64ToBlob(x.file, 'application/pdf'), {replace: true})
        .then(() => {
          this.fileOpener.open(path + fileName, 'application/pdf')
              .catch(() => {
                  // log error console.log('Error opening pdf file');
              });
      })
      .catch(() => {
          // log error console.error('Error writing pdf file');
      });

      },
      err => {
        bill.downloading = false;
        this.openNotAvailableDialog();
      }
      );
  }

  downloadUserBill(bill: any) {
    bill.downloading = true;
    this.downloadBill(bill);
  }
  downloadUserBillAPI(bill: any) {
    // FollowAnalytics.logEvent('download_bill', this.currentNumber);
    bill.downloading = true;

    const pdfWindow = window.open('');
    pdfWindow.document.write("<iframe width='100%' height='100%' src='" + bill.url + "'></iframe>");
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
    return new Blob(byteArrays, {type: contentType});
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
    dialogRef.afterClosed().subscribe(confirmresult => {});
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
    pdfWindow.document.write("<iframe width='100%' height='100%' src='" + billPack.url + "'></iframe>");
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
            '<iframe width=\'100%\' height=\'100%\' src=\'data:application/pdf;base64, ' +
              encodeURI(base64) +
              '\'></iframe>'
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
      err => {
        billPack.downloading = false;
        this.openNotAvailableDialog();
      }
    );
  }

  getIdClient() {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    return this.http.get(`${idClientEndpoint}/${msisdn}`);
  }

  getLastSlip(idClient: any) {
    return this.http.get(`${lastSlipEndpoint}/${idClient}`);
  }
}
