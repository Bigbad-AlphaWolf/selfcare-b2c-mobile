import { BillCompany } from "./bill-company.model";
import { CounterOem } from "./counter-oem.model";
import { OmSession } from './om-session.model';

export interface OperationExtras {
  senderMsisdn?: string;
  recipientMsisdn?: string;
  recipientFirstname?: string;
  recipientLastname?: string;
  recipientName?: string;
  recipientFromContact?: boolean;
  purchaseType?: string;
  forSelf?: boolean;

  userHasNoOmAccount?: boolean;
  amount?: any;
  includeFee?: any;
  fee?: any;

  billData?: { company?: BillCompany; counter?: CounterOem, codeRecharge?:string, kw?:number };
  omSession?: OmSession;
}
