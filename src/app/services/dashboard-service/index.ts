export interface TransfertBonnus {
  amount: number;
  dmsisdn: string;
  smsisdn: string;
}

export interface TransferCreditModel {
  msisdn: string;
  msisdn2: string;
  pin: string;
  amount: number;
}
export interface BuyPassModel {
  codeIN: string;
  type: string;
  amount: number;
  msisdn: string;
  receiver: string;
  serviceId?: string;
  serviceType?: string;
}

export interface BuyPassInternetModel {
  paymentDN: string;
  receiveDN: string;
  pricePlanIndex: number;
}

export interface BannierePubModel {
  action?: {
    typeAction: string;
    description: string;
    url: string;
    libelle: string;
  };
  callToAction: boolean;
  dateDebut: string;
  dateFin: string;
  description: string;
  formuleMobiles: any;
  id: number;
  image: string;
  imageWeb: string;
  priorite: number;
  profil: any;
  type: 'PUBLICITAIRE' | 'NOUVELLE_OFFRE' | 'BON_PLAN' | 'PROMO_NATIONALE';
  zoneAffichage: string;
}
