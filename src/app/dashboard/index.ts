import { Subject } from 'rxjs';
import { REGEX_POSTPAID_FIXE, REGEX_PREPAID_FIXE } from 'src/shared';

// differents profiles
export const PROFILE_TYPE_PREPAID = 'PREPAID';
export const PROFILE_TYPE_HYBRID = 'HYBRID';
export const PROFILE_TYPE_POSTPAID = 'POSTPAID';
export const PROFILE_TYPE_HYBRID_1 = 'ND';
export const PROFILE_TYPE_HYBRID_2 = 'HYBRIDE';
export const HOME_PREPAID_FORMULE = 'BOX BI';
export const FIX_PREPAID_FORMULE = 'KEURGUI_KH';
export const USER_CONS_CATEGORY_CALL = 'APPEL';
export const USER_CONS_CATEGORY_INTERNET = 'INTERNET';
export const USER_CONS_CATEGORY_SMS = 'SMS';
export const KIRENE_Formule = 'New Kirene Avec Orange';
export const CODE_COMPTEUR_VOLUME_NUIT_1 = 184;
export const CODE_COMPTEUR_VOLUME_NUIT_2 = 196;
export const CODE_COMPTEUR_VOLUME_NUIT_3 = 77;
export const OPERATION_TYPE_SARGAL_CONVERSION = 'SARGAL_CONVERSION';
export const PAYMENT_MOD_SARGAL = 'SARGAL';
export const SARGAL_NOT_SUBSCRIBED = 'NOT_SUBSCRIBED';
export const SARGAL_UNSUBSCRIPTION_ONGOING = 'UNSUBSCRIPTION_ONGOING';

export const dashboardOpened = new Subject<string>();

export interface UserConsommation {
  id: string;
  code: number;
  compteur: string;
  montant: number;
  msisdn: string;
  categorie: any;
  dateEffet: string;
  dateExpiration: string;
  unite: string;
  montantFormat: string;
  ordre: number;
}

export interface SargalSubscriptionModel {
  status: string;
  totalPoints: number;
  lastUpdate: string;
  lastUpdateFormatted: string;
  msisdn?: string;
}

export const getConsoByCategory /* : { [k: string]: Array<UserConsommation> }  */ = (
  userConsos: Array<{
    categorie: string;
    consommations: Array<UserConsommation>;
  }>
) => {
  const consoByCategory = {};
  userConsos.forEach(x => {
    consoByCategory[x.categorie] = x.consommations;
  });
  return consoByCategory;
};

export interface ItemUserConso {
  categorie: string;
  consommations: UserConsommation[];
}

export type UserConsommations = Array<{
  categorie: string;
  consommations: Array<UserConsommation>;
}>;

export function formatCurrency(num) {
  if (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  }
  return '0';
}

export interface BillModel {
  annee: number;
  compteClient: string;
  dateEcheance: string;
  dateFacture: string;
  mois: number;
  montantFacture: number;
  montantTVA: number;
  numeroClient: string;
  numeroFacture: string;
  numeroTelephone: string;
  statutFacture: string;
  downloading?: boolean;
  ncli?: string;
  groupage?: string;
  moisfact?: string;
  annefact?: string;
  total?: string;
  dateEchenace?: string;
  referencefacture?: string;
  nfact?: string;
  dateEmissionfacture: string;
  groupeFact: string;
}

export interface SubscriptionModel {
  nomOffre: string;
  profil: string;
  code: string;
}

export interface PromoBoosterActive {
  isPromoPassActive: boolean;
  isPromoRechargeActive: boolean;
}

export function isFixPostpaid(codeFormule: string) {
  return REGEX_POSTPAID_FIXE.test(codeFormule);
}

export function isFixPrepaid(codeFormule: string) {
  return REGEX_PREPAID_FIXE.test(codeFormule);
}
