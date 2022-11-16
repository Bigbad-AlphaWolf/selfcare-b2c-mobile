export interface BillPaymentModel {
  billingAccountId: any;
  payementAmount: number;
  payerEm: string;
  payerEncodedPin: string;
  payerMsisdn: string;
  billNumber: string;
  paymentCategory: PAYMENT_BILLS_CATEGORY | string;
}

export enum PAYMENT_BILLS_CATEGORY {
  FIXE = "FIXE",
  MOBILE = "MOBILE",
  SENEAU = "SENEAU",
  SENELEC = "SENELEC",
}

export interface BillPaymentCbModel {
  nclient: string;
  billingAccountId: string;
  billNumber: string;
  payerMsisdn: string;
  paymentAmount: string;
  paymentCategory: string;
  firstName?: string;
  lastName?: string;
}

export interface BillPaymentCbResponseModel {
  cardPaymentTransactionId: string;
  paymentCancelUrl: string;
  paymentUrl: string;
}
