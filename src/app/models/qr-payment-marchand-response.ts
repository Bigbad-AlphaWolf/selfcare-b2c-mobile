export interface QrPaymentMarchandResponseModel {
  cancelled: boolean;
  format: 'QR_CODE';
  text: string;
}

export interface QrPaymentMarchandTextResponseModel {
  hmac: string;
  scope: string;
  amount: number;
  merchant_name: string;
  merchant_code: string;
	id?: string;
}
