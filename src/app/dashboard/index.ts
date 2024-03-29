import { Subject } from 'rxjs';
import {
  REGEX_POSTPAID_FIXE,
  REGEX_PREPAID_FIXE,
  UserConsommation,
  CODE_KIRENE_Formule,
} from 'src/shared';
import { BoosterModel } from '../models/booster.model';

// differents profiles
export const PROFILE_TYPE_PREPAID = 'PREPAID';
export const PROFILE_TYPE_HYBRID = 'HYBRID';
export const PROFILE_TYPE_POSTPAID = 'POSTPAID';
export const PROFILE_TYPE_HYBRID_1 = 'ND';
export const PROFILE_TYPE_HYBRID_2 = 'HYBRIDE';
export const HOME_PREPAID_FORMULE = 'BOX BI';
export const FIX_PREPAID_FORMULE = 'KEURGUI_KH';
export const CODE_FORMULE_KILIMANJARO = '9120';
export const KILIMANJARO_FORMULE = 'OCS_FORFAIT_MOBILE';
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
export const POSTPAID_TERANGA_OFFERS_ID = [
  '9128',
  '9210',
  'OCS_TERANGA_MAX',
  '8100',
  '9126',
  'OCS_TERANGA_LIBERTY',
  'OCS_RPE_TERANGA_PREMIUM',
];
export const dashboardOpened = new Subject<string>();
export const dashboardFixePrepaidOpened = new Subject<string>();
export const dashboardFixePostpaidOpened = new Subject<string>();
export const dashboardMobilePrepaidOpened = new Subject<string>();
export const dashboardMobilePrepaidKireneOpened = new Subject<string>();
export const dashboardMobilePostpaidOpened = new Subject<string>();
export const billsMobilePostpaidOpened = new Subject<string>();
export const billsFixePostpaidOpened = new Subject<string>();
export const billsDetailFixePostpaidOpened = new Subject<string>();

export interface SargalSubscriptionModel {
  status: string;
  totalPoints: number;
  lastUpdate: string;
  lastUpdateFormatted: string;
  msisdn?: string;
}

export const getConsoByCategory /* : { [k: string]: Array<UserConsommation> }  */ =
  (
    userConsos: Array<{
      categorie: string;
      consommations: Array<UserConsommation>;
    }>
  ) => {
    const consoByCategory = {};
    userConsos.forEach((x) => {
      consoByCategory[x.categorie] = x.consommations;
    });
    return consoByCategory;
  };

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
  clientCode?: string;
}

export interface PromoBoosterActive {
  promoPass?: BoosterModel;
  promoRecharge?: BoosterModel;
  promoPassIllimix?: BoosterModel;
  boosterInscription?: BoosterModel;
}

export function isFixPostpaid(nomFormule: string) {
  return REGEX_POSTPAID_FIXE.test(nomFormule);
}

export function isFixPrepaid(codeFormule: string) {
  return REGEX_PREPAID_FIXE.test(codeFormule);
}

export const CODE_FORMULE_FIX_PREPAID = '9419';

export interface ModelOfSouscription {
  profil?: string;
  formule?: string;
  codeFormule?: string;
}

export function isPrepaidOrHybrid(souscription: SubscriptionModel): boolean {
  return (
    (souscription.profil === PROFILE_TYPE_PREPAID ||
      souscription.profil === PROFILE_TYPE_HYBRID ||
      souscription.profil === PROFILE_TYPE_HYBRID_1 ||
      souscription.profil === PROFILE_TYPE_HYBRID_2) &&
    souscription.code !== CODE_KIRENE_Formule &&
    souscription.nomOffre !== HOME_PREPAID_FORMULE
  );
}
export function isPostpaidMobile(souscription: SubscriptionModel): boolean {
  return (
    souscription.profil === PROFILE_TYPE_POSTPAID &&
    !REGEX_POSTPAID_FIXE.test(souscription.nomOffre) &&
    !REGEX_PREPAID_FIXE.test(souscription.nomOffre)
  );
}

export function isKirene(souscription: SubscriptionModel): boolean {
  return (
    souscription.profil === PROFILE_TYPE_PREPAID &&
    souscription.code === CODE_KIRENE_Formule
  );
}

export function isPostpaidFix(souscription: SubscriptionModel): boolean {
  return (
    souscription.profil === PROFILE_TYPE_POSTPAID &&
    REGEX_POSTPAID_FIXE.test(souscription.nomOffre)
  );
}

export function isPrepaidFix(souscription: SubscriptionModel): boolean {
  return (
    souscription.profil === PROFILE_TYPE_PREPAID &&
    (REGEX_PREPAID_FIXE.test(souscription.nomOffre) ||
      souscription.code === CODE_FORMULE_FIX_PREPAID)
  );
}

// tslint:disable-next-line: only-arrow-functions
export const hash53 = function (str, seed = 0) {
  // tslint:disable-next-line: no-bitwise
  let h1 = 0xdeadbeef ^ seed,
    // tslint:disable-next-line: no-bitwise
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    // tslint:disable-next-line: no-bitwise
    h1 = Math.imul(h1 ^ ch, 2654435761);
    // tslint:disable-next-line: no-bitwise
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  // tslint:disable-next-line: no-bitwise
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    // tslint:disable-next-line: no-bitwise
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  // tslint:disable-next-line: no-bitwise
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    // tslint:disable-next-line: no-bitwise
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  // tslint:disable-next-line: no-bitwise
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const SARGAL_NOT_SUBSCRIBED_STATUS = [
  SARGAL_NOT_SUBSCRIBED,
  SARGAL_UNSUBSCRIPTION_ONGOING,
];
