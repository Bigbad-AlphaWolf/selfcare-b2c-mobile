import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { LoadingController } from '@ionic/angular';
import { QrPaymentMarchandResponseModel, QrPaymentMarchandTextResponseModel } from 'src/app/models/qr-payment-marchand-response';
import { OPERATION_TRANSFER_OM, OPERATION_TYPE_MERCHANT_PAYMENT } from 'src/shared';
import { ApplicationRoutingService } from '../application-routing/application-routing.service';
import { ContactsService } from '../contacts-service/contacts.service';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';

@Injectable({
  providedIn: 'root'
})
export class QrScannerService {

  constructor(private qrScanner: BarcodeScanner, private appRouting: ApplicationRoutingService, private loaderCtl: LoadingController, private omService: OrangeMoneyService, private dashbService: DashboardService, private contactService: ContactsService) { }

	startScan = async () => {
    const barcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      disableAnimations: false,
      disableSuccessBeep: false,
      prompt: '',
      orientation: 'portrait',
      torchOn: false,
      saveHistory: false,
      resultDisplayDuration: 0
    };
    this.qrScanner.scan(barcodeScannerOptions).then(async (value: QrPaymentMarchandResponseModel) => {
      const payload: QrPaymentMarchandTextResponseModel = value?.text ? JSON.parse(value?.text) : null;

			if(payload?.merchant_code) {
				this.appRouting.goSetAmountPage({
					purchaseType: OPERATION_TYPE_MERCHANT_PAYMENT,
					merchant: {
						merchantCode: payload?.merchant_code,
						name: payload?.merchant_name
					}
				})
			} else if(payload.scope === 'MLITE') {
				const idCard = payload?.id;
				const loader = await this.presentLoadingWithOptions();
				loader.present();

				this.omService.checkMarchandLiteCarteInfos(idCard).subscribe((res: any) => {
					const infoCard: {msisdnCustomer: string, status: string} = res?.content?.data;
					const mLiteContact = this.contactService.findContact(infoCard?.msisdnCustomer);
					const payload = {
					purchaseType: OPERATION_TRANSFER_OM,
					senderMsisdn: this.dashbService.getCurrentPhoneNumber(),
					recipientMsisdn: infoCard?.msisdnCustomer,
					recipientName: mLiteContact?.displayName,
					viaQr: true
				}

				this.loaderCtl.dismiss();
				if(infoCard?.status === 'ACTIVATED') {
					this.appRouting.goSetTransferAmountPage(payload);
				}
				}, (err) => {
					this.loaderCtl.dismiss();
				});
			}

    }).catch((e: any) => {
      console.log('Caught error', e);
    });
  };

	async presentLoadingWithOptions() {
    return await this.loaderCtl.create({
      spinner: 'crescent',
      message: 'Veuillez patienter',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: false,
    });
  }
}
