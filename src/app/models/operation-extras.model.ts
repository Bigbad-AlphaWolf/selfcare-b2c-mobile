import { BillCompany } from "./bill-company.model";
import { CounterOem } from "./counter-oem.model";
import { OmSession } from './om-session.model';
import { OfferPlan } from 'src/shared/models/offer-plan.model';
import { MarchandOem } from './marchand-oem.model';

export interface OperationExtras {
  senderMsisdn?: string;
  recipientMsisdn?: string;
  destinataire?:string;
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

  code?:any;
  profil?:any;

  billData?: { company?: BillCompany; counter?: CounterOem, codeRecharge?:string, kw?:number };
  omSession?: OmSession;

  offerPlan?: OfferPlan,
  merchant?: MarchandOem
}
