import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { QrPaymentMarchandResponseModel, QrPaymentMarchandTextResponseModel } from 'src/app/models/qr-payment-marchand-response';
import { OPERATION_TYPE_MERCHANT_PAYMENT } from 'src/shared';
import { ApplicationRoutingService } from '../application-routing/application-routing.service';

@Injectable({
  providedIn: 'root'
})
export class QrScannerService {

  constructor(private qrScanner: BarcodeScanner, private appRouting: ApplicationRoutingService) { }

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
			}

    }).catch((e: any) => {
      console.log('Caught error', e);
    });
  };
}
