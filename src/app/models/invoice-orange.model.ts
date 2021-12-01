export interface InvoiceOrange {
  annee: number;
  contentNotNull?: boolean;
  dateEcheance?: string;
  dateEmissionfacture?: string;
  groupeFact?: string;
  mois: number;
  montantFacture: number;
  nfact: string;
  numeroTelephone: string;
  statutFacture?: string;
  url: string;
}

export enum BILL_STATUS {
  PAID = 'paid',
  UNPAID = 'unpaid',
  IN_PROGRESS = 'in_progress'
}
