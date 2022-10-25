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
  FIXE = 'FIXE',
  MOBILE = 'MOBILE',
  SENEAU = 'SENEAU',
  SENELEC = 'SENELEC'
}
