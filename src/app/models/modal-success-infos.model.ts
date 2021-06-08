import { OperationExtras } from './operation-extras.model';

export interface ModalSuccessModel {
  purchaseType?: string;
  passBought?: any;
  success?: boolean;
  recipientMsisdn?: string;
  recipientName?: string;
  buyForMe?: boolean;
  paymentMod?: string;
  msisdnBuyer?: string;
  errorMsg?: string;
  amount?: number;
  merchantName?: string;
  merchantCode?: number;
  opXtras?: OperationExtras;
  dalal?: any;
  historyTransactionItem?: any;
  isOpenedFromHistory?: boolean;
}
