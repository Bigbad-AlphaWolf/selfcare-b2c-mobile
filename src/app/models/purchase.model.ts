export interface PurchaseModel {
  typeAchat?: string;
  amount?: number;
  name?: string;
  channel?: string;
  operationDate?: string;
  operationType?: 'DEBIT' | 'CREDIT';
  details?: any[];
  label?: string;
  prenomReceiver?: string;
  nomReceiver?: string;
  msisdnReceiver?: string;
  txnid?: string;
  fees?: number;
	msisdnSender?: string;
  transactionMetadata?: {
    a_ma_charge?: string;
    amount?: string;
    cashout_fees?: string;
    fees?: string;
    send_fees?: string;
  };
}
