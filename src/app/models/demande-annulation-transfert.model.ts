export interface DemandeAnnulationTransfertModel {
  msisdn?: string;
  titre?: string;
  status?: boolean;
  txnid?: string;
  destinataire?: string;
  blockedStatus?: string;
  date?: string;
  montant?: number;
  type_transaction?: string;
  lastUpdateDate?: string;
}
