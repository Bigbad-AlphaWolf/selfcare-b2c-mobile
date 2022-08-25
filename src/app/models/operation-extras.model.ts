import {BillCompany} from './bill-company.model';
import {CounterOem} from './counter-oem.model';
import {OmSession} from './om-session.model';
import {OfferPlan} from 'src/shared/models/offer-plan.model';
import {MarchandOem} from './marchand-oem.model';
import {DalalTonesModel} from './dalal-tones.model';
import {OffreService} from './offre-service.model';
import {InvoiceOrange} from './invoice-orange.model';

export interface OperationExtras {
  senderMsisdn?: string;
  recipientMsisdn?: string;
  destinataire?: string;
  recipientFirstname?: string;
  recipientLastname?: string;
  recipientName?: string;
  recipientFromContact?: boolean;
  purchaseType?: string;
  forSelf?: boolean;
	viaQr?: boolean;

  userHasNoOmAccount?: boolean;
  amount?: any;
  includeFee?: any;
  fee?: any;
  sending_fees?: any;
  sending_fees_Info?: {effective_fees: number; old_fees: number};
  code?: any;
  profil?: any;

  billData?: {
    company?: BillCompany;
    counter?: CounterOem;
    codeRecharge?: string;
    kw?: number;
  };
  omSession?: OmSession;

  offerPlan?: OfferPlan;
  pass?: any;
  merchant?: MarchandOem;
  dalal?: DalalTonesModel;
  title?: string;
  isLightMod?: boolean;
  recipientCodeFormule?;
  serviceUsage?: OffreService;
  fromPage?: string;

  invoice?: InvoiceOrange;
  numberToRegister?: string;
  country?: any;
  reason?: string;

  counterToFav?: boolean;

  checkRecipient?: boolean;
}
