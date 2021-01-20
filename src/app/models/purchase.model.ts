export interface PurchaseModel {
    typeAchat: string;
    amount: number;
    name: string;
    channel: string;
    operationDate: string;
    operationType: 'DEBIT' | 'CREDIT';
    details: any[];
    label?: string;
    prenomReceiver?: string;
    nomReceiver?: string;
    msisdnReceiver?: string;
    txnid?: string
  }