import * as SecureLS from 'secure-ls';
import { HTTP } from '@ionic-native/http/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PalierModel } from 'src/app/models/palier.model';
import { BoosterModel } from 'src/app/models/booster.model';
import { isPostpaidFix, PROFILE_TYPE_HYBRID, PROFILE_TYPE_HYBRID_1, PROFILE_TYPE_HYBRID_2 } from 'src/app/dashboard';
import { InvoiceOrange } from 'src/app/models/invoice-orange.model';

const ls = new SecureLS({ encodingType: 'aes' });
export const REGEX_NUMBER: RegExp = /^((\+221|00221|221) ?)?(7(0|6|7|8){1}) ?([0-9]{3}) ?([0-9]{2}) ?([0-9]{2})$/;
export const REGEX_NUMBER_OM: RegExp = /^((\+221|00221|221) ?)?(7(0|6|7|8){1}) ?([0-9]{3}) ?([0-9]{2}) ?([0-9]{2})$/;
export const REGEX_FIX_NUMBER: RegExp = /^((\+221|00221|221) ?)?(33) ?([0-9]{3}) ?([0-9]{2}) ?([0-9]{2})$/;
export const REGEX_PASSWORD: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/;
export const REGEX_PASSWORD2: RegExp = /^.{5,19}$/;
export const REGEX_NAME = /^([^0-9_!¡?÷?¿/+=,.@#$%ˆ&*(){}|~<>;:\]\[-]){1,}$/;
export const REGEX_EMAIL =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const REGEX_DIGIT = /\d/;
export const REGEX_POSTPAID_FIXE = /(Keurgui).*|(Fibre).*|(LFB).*|(HOME).*/i;
export const REGEX_PREPAID_FIXE = /(BOX).*/i;
export const REGEX_IS_DIGIT: RegExp = /^[0-9]*$/;
export const REGEX_IOS_SYSTEM = /iPhone|iPad|iPod|crios|CriOS/i;

export const USER_CONS_CATEGORY_CALL = 'APPEL';
export const USER_CONS_CATEGORY_INTERNET = 'INTERNET';
export const USER_CONS_CATEGORY_SMS = 'SMS';
export const USER_CALL_SUMMARY_CONSO_CODES = [1, 6, 9];
export const OPERATION_TYPE_PASS_INTERNET = 'PASS_INTERNET';
export const OPERATION_TYPE_PASS_ILLIMIX = 'PASS_ILLIMIX';
export const OPERATION_TYPE_PASS_ALLO = 'PASS_ALLO';
export const OPERATION_TYPE_PASS_VOYAGE = 'OPERATION_TYPE_PASS_VOYAGE';
export const OPERATION_TYPE_PASS_INTERNATIONAL = 'PASS_INTERNATIONAL';
export const OPERATION_TYPE_PASS_LAMBJ = 'LAMB_J';
export const OPERATION_TYPE_PASS_ILLIFLEX = 'PASS_ILLIFLEX';
export const OPERATION_TYPE_MERCHANT_PAYMENT = 'MERCHANT_PAYMENT';
export const OPERATION_TYPE_SOS = 'SOS';
export const OPERATION_TYPE_SOS_CREDIT = 'SOS CREDIT';
export const OPERATION_TYPE_SOS_PASS = 'SOS Pass Internet';
export const OPERATION_TYPE_SOS_ILLIMIX = 'SOS Illimix';
export const OPERATION_TYPE_SEDDO_CREDIT = 'SEDDO_CREDIT';
export const OPERATION_TYPE_SEDDO_PASS = 'SEDDO PASS';
export const OPERATION_TYPE_SEDDO_BONUS = 'SEDDO_BONUS';
export const OPERATION_TYPE_TRANSFER_OM = 'orange-money';
export const OPERATION_TYPE_RECHARGE_CREDIT = 'RECHARGEMENT_CREDIT';
export const OPERATION_TYPE_SARGAL_CONVERSION = 'SARGAL_CONVERSION';
export const OPERATION_TRANSFER_OM = 'TRANSFER_MONEY';
export const OPERATION_TRANSFER_OM_WITH_CODE = 'TRANSFER_MONEY_WITH_CODE';
export const OPERATION_BLOCK_TRANSFER = 'BLOCK_TRANSFER';
export const BONS_PLANS = 'BONS_PLANS';
export const OPERATION_TYPE_BONS_PLANS = 'BONS_PLANS';
export const OPERATION_ENABLE_DALAL = 'ACTIVATE_DALAL';
export const OPERATION_DISABLE_DALAL = 'DISABLE_DALAL';
export const OPERATION_SEE_SOLDE_RAPIDO = 'SOLDE_RAPIDO';
export const OPERATION_SEE_SOLDE_XEWEUL = 'SOLDE_XEWEUL';
export const OPERATION_SEE_FOLLOW_UP_REQUESTS = 'FOLLOW_UP_REQUESTS';
export const OPERATION_SEE_RATTACHED_NUMBERS = 'RATTACHED_NUMBERS';
export const OPERATION_RATTACH_NUMBER = 'RATTACHE_NUMBER';
export const OPERATION_CONFIRM_DELETE_RATTACH_NUMBER = 'CONFIRM_DELETE_RATTACHE_NUMBER';
export const OPERATION_SUGGEST_RATTACH_NUMBER = 'SUGGEST_RATTACH_NUMBER';
export const OPERATION_RECLAMATION_ERREUR_TRANSACTION_OM = 'ERREUR_TRANSACTION_OM';
export const OPERATION_INIT_CHANGE_PIN_OM = 'INIT_CHANGE_PIN_OM';
export const OPERATION_CHANGE_PIN_OM = 'CHANGE_PIN_OM';
export const OPERATION_CREATE_PIN_OM = 'CREATE_PIN_OM';
export const OPERATION_OPEN_OM_ACCOUNT = 'OPEN_OM_ACCOUNT';
export const OPERATION_CANCEL_TRANSFERT_OM = 'CANCEL_TRANSFERT_OM';
export const OPERATION_DEPLAFONNEMENT_OM_ACCOUNT = 'DEPLAFONNEMENT_OM_ACCOUNT';
export const OPERATION_CHECK_OM_ACCOUNT_STATUS = 'OM_PLAFOND_INFOS';
export const OPERATION_SHARE_THE_APP = 'SHARE_THE_APP';
export const OPERATION_PAY_ORANGE_BILLS = 'PAY_ORANGE_BILLS';
export const OPERATION_UNBLOCK_OM_ACCOUNT = 'UNBLOCK_OM_ACCOUNT';
export const OPERATION_RESET_PIN_OM = 'RESET_OM_ACCOUNT';
export const OPERATION_ABONNEMENT_WIDO = 'ABONNEMENT_WIDO';

export const PAYMENT_MOD_CREDIT = 'CREDIT';
export const PAYMENT_MOD_OM = 'ORANGE_MONEY';
export const PAYMENT_MOD_BONUS = 'BONUS';
export const PAYMENT_MOD_NEXT_RECHARGE = 'NEXT_RECHARGE';
export const PAYMENT_MOD_SARGAL = 'SARGAL';
export const CREDIT_APPEL_CATEGORY = 'Crédit Appel';
export const INTERNET_LABEL_CATEGORY = 'Internet';
export const SMS_LABEL_CATEGORY = 'Sms';
export const PAY_WITH_CREDIT = 'Crédit Recharge';
export const PAY_WITH_OM = 'Orange Money';
export const PAY_WITH_BONUS = 'Bonus vers Orange';
export const PAY_ON_NEXT_RECHARGE = 'Prochaine recharge';
export const PAY_WITH_SARGAL = 'Points Sargal';

export const KIRENE_Formule = 'New Kirene Avec Orange';
export const CODE_KIRENE_Formule = '9134';
export const JAMONO_NEW_SCOOL_CODE_FORMULE = '9131';
export const JAMONO_ALLO_CODE_FORMULE = '9132';
export const JAMONO_MAX_CODE_FORMULE = '9133';
export const JAMONO_PRO_CODE_FORMULE = '9136';
export const CODE_PARTENAIRE_COUPON_TRACE_TV = 'TRACE_TV';
export const PRO_MOBILE_ERROR_CODE = 'userProMobile';
export const CODE_COMPTEUR_CREDIT_MENSUEL_OFFERT = 8;
export const MAIL_URL = 'mailto:serviceclient@orange-sonatel.com';
export const NO_AVATAR_ICON_URL = '/assets/images/profil-mob.png';
export const ASSISTANCE_URL = 'https://assistance.orange.sn';
export const FACEBOOK_URL = 'https://m.me/165622776799685';
export const TWITTER_URL = 'https://twitter.com/messages/compose?recipient_id=733327435299729408';
export const INSTAGRAM_URL = 'https://instagram.com/orange_senegal?igshid=7xv78qwpivfm';

export const FIND_AGENCE_EXTERNAL_URL = 'https://agence.orange.sn/';
export const CHECK_ELIGIBILITY_EXTERNAL_URL = 'https://www.orange.sn/test-fibre';
export const VALID_IMG_EXTENSIONS = ['jpg', 'jpeg', 'png'];

export const CREDIT = 'crédit';
export const BONUS = 'bonus';

// Maximum size of avatar image allowed in bytes : 3 Mo ou 1024Ko
export const MAX_USER_AVATAR_UPLOAD_SIZE = 3072;

// Maximum size of avatar image allowed in bytes : 5 Mo ou 5 * 1024Ko
export const MAX_USER_FILE_UPLOAD_SIZE = 5120;

// Code d'erreur for Achat Pass bloqué pour destinataires clients non Orange et Moi
export const BLOCKED_PASS = 'BLOCKEDPASS';

export const DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY = {
  label: 'Tous',
  typeAchat: undefined,
};

// 72 hours duration in milliseconds (72h = 72 * 3600 s = 72 * 3600 * 1000 ms = 259.200.000)
export const THREE_DAYS_DURATION_IN_MILLISECONDS = 259200000;

export const listRegisterSargalBonPlanText = ['inscription', 'inscris'];
export const LIST_CATEGORY_BONS_PLANS = {
  internet: 'INTERNET',
  illimix: 'ILLIMIX',
  sargal: 'SARGAL',
  recharge: 'RECHARGE',
  autres: 'AUTRES',
};

export const IMAGES_DIRECTORY = '/assets/images/';

export const LIST_ICON_PURCHASE_HISTORIK_ITEMS = {
  PASS_INTERNET: `${IMAGES_DIRECTORY}ic-internet-usage.png`,
  PASS_ILLIFLEX: `${IMAGES_DIRECTORY}ic-africa.svg`,
  PASS_ILLIMIX: `${IMAGES_DIRECTORY}ic-unlimited-calls.png`,
  CREDIT: `${IMAGES_DIRECTORY}ic-orange-phone.svg`,
  TRANSFERT_BONUS: `${IMAGES_DIRECTORY}transfert-icon.png`,
  SEDDO: `${IMAGES_DIRECTORY}transfert-icon.png`,
  PASSFOROTHER: `${IMAGES_DIRECTORY}ic-internet-usage.png`,
  DALALTONE: `${IMAGES_DIRECTORY}ic-device-ringtone.png`,
  SOS: `${IMAGES_DIRECTORY}ic-emergency-sos.png`,
  DEPOT: `${IMAGES_DIRECTORY}ic-orange-money-transactions.png`,
  TRANSFER: `${IMAGES_DIRECTORY}ic-orange-money-transactions.png`,
  TRANSFERT_ARGENT: `${IMAGES_DIRECTORY}ic-orange-money-transactions.png`,
  TRANSFERT_ARGENT_CODE: `${IMAGES_DIRECTORY}ic-orange-money-transactions.png`,
  PAIEMENT_FACTURE_SONATEL_FIXE: `${IMAGES_DIRECTORY}ic-orange-money-transactions.png`,
  PAIEMENT_FACTURE_SDE: `${IMAGES_DIRECTORY}ic-orange-money-transactions.png`,
  PAIEMENT_SENELEC: `${IMAGES_DIRECTORY}ic-orange-money-transactions.png`,
  PAIEMENT_FACTURE: `${IMAGES_DIRECTORY}ic-orange-money-transactions.png`,
  WOYOFAL_PAYMENT: `${IMAGES_DIRECTORY}ic-files.png`,
  PAIEMENT_MARCHAND: `${IMAGES_DIRECTORY}ic-orange-money-qr.png`,
  MERCHANT_PAYMENT: `${IMAGES_DIRECTORY}ic-orange-money-qr.png`,
  RAPIDO: `${IMAGES_DIRECTORY}ic-orange-money-qr.png`,
  SARGAL: `${IMAGES_DIRECTORY}transfert-icon.png`,
  PASS_WIDO: `${IMAGES_DIRECTORY}icone_wido.png`,
  PASS_PLAYVOD: `${IMAGES_DIRECTORY}icone_playvod.png`,
  PASS_YOUSCRIBE: `${IMAGES_DIRECTORY}icone_youScribe.png`,
};

export const TYPE_QUESTION_SATISFACTION_FORM = {
  BASIC: 'NONE',
  NOTE: 'RATING',
  RECOMMENDATION: 'RECOMMENDATION',
  YES_NO: 'YES_NO',
  SELECT_ANSWER: 'SELECT_ANSWER_QUESTION',
};

export const STORIES_OEM_CONFIG = {
  MAX_DURATION_BY_ELEMENT: 20000, // en millisecondes
  DEFAULT_DURATION_BY_ELEMENT: 5000,
};

export function getNOAvatartUrlImage() {
  return NO_AVATAR_ICON_URL;
}

export function isExtensionImageValid(fileType: string) {
  const result = VALID_IMG_EXTENSIONS.filter(x => {
    return x === fileType;
  });

  if (result.length) {
    return true;
  }
  return false;
}

export function isSizeAvatarValid(fileSizeInKo: number) {
  if (fileSizeInKo < MAX_USER_AVATAR_UPLOAD_SIZE) {
    return true;
  }
  return false;
}

export function formatDataVolume(volumeInKiloOctet) {
  const mega = 1024;
  const giga = mega * 1024;

  let rest = volumeInKiloOctet;
  let valueInGiga;
  let valueInMega;

  if (rest >= giga) {
    valueInGiga = Math.floor(rest / giga);
    rest = rest % giga;
  }
  if (rest >= mega) {
    valueInMega = Math.floor(rest / mega);
    rest = rest % mega;
  }
  const result = [];
  if (valueInGiga) {
    result.push(`${valueInGiga} Go`);
  }
  if (valueInMega) {
    result.push(`${valueInMega} Mo`);
  }
  if (!result.length) {
    result.push(`${rest} Ko`);
  } else {
    if (rest) {
      result.push(`${rest} Ko`);
    }
  }
  return result.join(' ');
}
export function formatDate(dateString: string, seperator = '/') {
  const [year, month, day] = dateString.split('-');
  return `${day}${seperator}${month}${seperator}${year}`;
}

export function userFriendlyTime(seconds: number): string {
  let hh: number;
  let mn: number;
  let ss: number;
  let time = '';
  hh = Math.floor(seconds / 3600);
  seconds = seconds % 3600;
  if (hh !== 0) {
    time = time + '' + hh + ' heures ';
  }

  mn = Math.floor(seconds / 60);
  seconds = seconds % 60;
  if (mn !== 0) {
    time = time + '' + mn + ' minutes ';
  }

  if (seconds < 60 && seconds !== 0) {
    if (!mn && hh > 0) {
      time = time + '' + 0 + ' minutes ';
    }
    ss = seconds;
    time = time + '' + ss + ' secondes';
  }
  return time;
}

export const months = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

export interface PassInfoModel {
  id: number;
  type: string;
  nom: string;
  volumeInternet: string;
  tarif: string;
  bonus: string;
  description: string;
  actif: boolean;
  categoriePass: any;
  formuleMobiles: any;
  promos: any;
  dureeInternet: string;
  bonusNuit: string;
  validitePass?: string;
  compteurCredite?: string;
  typePassInternet: any;
  price_plan_index: number;
  price_plan_index_om: number;
}

export interface PromoPassModel {
  id: number;
  dateDebut: any;
  dateFin: any;
  description: string;
  passParent: PassInfoModel;
  passPromo: PassInfoModel;
}

export interface PassInternetModel {
  pass: PassInfoModel;
  promoPass: PromoPassModel;
}

export interface PassIllimModel {
  id: number;
  type: string;
  nom: string;
  volumeInternet: string;
  tarif: string;
  bonus: string;
  description: string;
  actif: boolean;
  validitePass: string;
  categoriePass: any;
  formuleMobiles: any;
  profils: any;
  promos: any;
  duree: string;
  bonusNuit: string;
  compteurCredite: string;
  typePassInternet: any;
  price_plan_index: number;
  price_plan_index_om: number;
  dureeAppel: string;
  nombreSms: string;
}

export interface PromoPassIllimModel {
  id: number;
  dateDebut: any;
  dateFin: any;
  description: string;
  passPromo: PassIllimModel;
}

export interface PassIllimixModel {
  pass: PassIllimModel;
  promoPass: PromoPassIllimModel;
}

export interface CategoryPassInternet {
  id: number;
  libelle: string;
  ordre: number;
}

export interface ChangePinModel {
  msisdn: string;
  pin: string;
  newPin: string;
}

export interface SubscriptionUserModel {
  nomOffre: string;
  profil: string;
  code: string;
}

export function getOrderedListCategory(unorderedList: CategoryPassInternet[]): CategoryPassInternet[] {
  let listCategoryFiltered = [];
  unorderedList = unorderedList.filter((elt: any) => {
    return !!elt;
  });
  unorderedList.sort((elt1: CategoryPassInternet, elt2: CategoryPassInternet) => elt1.ordre - elt2.ordre);
  listCategoryFiltered = [...new Set(unorderedList.map(x => x.libelle))];

  return listCategoryFiltered;
}

export const ALLO_PASS_CATEGORY = 'ALLO';

export function getTrioConsoUser(consoSummary: UserConsommations) {
  const result = [];
  consoSummary.forEach((x: ItemUserConso) => {
    result.push(...x.consommations);
  });
  result.sort((item1: UserConsommation, item2: UserConsommation) => {
    if (item1 && item2 && item1.ordre && item2.ordre) {
      return item1.ordre - item2.ordre;
    }
  });
  return result.slice(0, 3);
}

export function arrangeCompteurByOrdre(listConso: UserConsommations) {
  listConso.forEach((detailConso: ItemUserConso) => {
    detailConso.consommations.sort((conso1: UserConsommation, conso2: UserConsommation) => {
      if (conso1 && conso2 && conso1.ordre && conso2.ordre) {
        return conso1.ordre - conso2.ordre;
      } else if (conso1 && conso2 && conso1.ordre === null && conso2.ordre) {
        return +conso2.ordre;
      } else if (conso1 && conso2 && conso2.ordre === null && conso1.ordre) {
        return -conso1.ordre;
      }
    });
  });
  return listConso;
}
export function getListPassFilteredByLabelAndPaymentMod(
  selectedLabel: string,
  listPass: ((PassInfoModel | PromoPassModel) | (PassIllimModel | PromoPassIllimModel))[]
) {
  let listPassFiltered = [];
  listPassFiltered = listPass.filter((pass: any) => {
    if (!pass.passPromo) {
      return pass.categoriePass?.libelle === selectedLabel;
    } else {
      return pass.passPromo?.categoriePass?.libelle === selectedLabel;
    }
  });

  return listPassFiltered;
}

export function arrangePassByCategory(listPass: any[], listCategory: string[]) {
  // arrange pass by category label

  const result: { label: string; pass: any[] }[] = [];
  listCategory.forEach((label: string) => {
    result.push({ label, pass: [] });
  });
  listPass.forEach((pass: any) => {
    if (!pass.passPromo) {
      result
        .find((item: { label: string; pass: any[] }) => {
          return item.label === pass?.categoriePass?.libelle;
        })
        ?.pass.push(pass);
    } else {
      result
        .find((item: { label: string; pass: any[] }) => {
          return item.label === pass.passPromo?.categoriePass?.libelle;
        })
        ?.pass.push(pass);
    }
  });

  //order pass by tarif
  result.forEach((itemPassCategory: { label: string; pass: any[] }, index: number) => {
    result[index].pass = result[index].pass.sort((pass1: any, pass2: any) => {
      if (!pass1.passPromo && !pass2.passPromo) {
        return +pass1.tarif - +pass2.tarif;
      } else if (!pass1.passPromo && pass2.passPromo) {
        return +pass1.tarif - +pass2.passPromo.tarif;
      } else if (pass1.passPromo && !pass2.passPromo) {
        return +pass1.passPromo.tarif - +pass2.tarif;
      } else {
        return +pass1.passPromo.tarif - +pass2.passPromo.tarif;
      }
    });
  });
  return result;
}

export function computeConsoHistory(consos) {
  const result = [];

  consos.forEach(x => {
    const { date, categorie, calledNumber, duration, charge1, charge2, chargeType1, chargeType2 } = x;
    let conso1, conso2;

    if (charge1 || chargeType1.length > 0) {
      conso1 = {
        date,
        categorie,
        calledNumber,
        duration,
        charge: formatCurrency(charge1),
        chargeType: chargeType1,
      };
      result.push(conso1);
    }
    if (charge2 || chargeType2.length > 0) {
      conso2 = {
        date,
        categorie,
        calledNumber,
        duration,
        charge: formatCurrency(charge2),
        chargeType: chargeType2,
      };
      result.push(conso2);
    }
  });

  return result;
}

export function generateUUID() {
  let d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // tslint:disable-next-line: no-bitwise
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    // tslint:disable-next-line: no-bitwise
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const listLibelleCodeOperationOM = [
  { operationCode: 'operation-100', operationLibelle: 'deplafonnement' },
  { operationCode: 'operation-200', operationLibelle: 'creation-compte' },
  { operationCode: 'operation-300', operationLibelle: 'reclamation' },
];

export function getOperationCodeActionOM(libelle: string) {
  const itemFound = listLibelleCodeOperationOM.find((item: { operationCode: string; operationLibelle: string }) => {
    return item.operationLibelle === libelle;
  });

  return itemFound ? itemFound.operationCode : null;
}

export const FILENAME_OPEN_OM_ACCOUNT = 'formulaire_inscription_om_original.pdf';
export const FILENAME_DEPLAFONNEMENT_OM_ACCOUNT = 'formulaire_deplafonnement_original.pdf';
export const FILENAME_ERROR_TRANSACTION_OM = 'formulaire_erreur_transaction_original.pdf';

export interface GiftSargalCategoryItem {
  id: number;
  nom: string;
  hashId: string;
}

export interface GiftSargalItem {
  categorieGift: GiftSargalCategoryItem;
  description: string;
  giftId: number;
  giftSargalFormules: any;
  id: number;
  nom: string;
  ppi: string;
  prix: any;
  validite: string;
  nombreNumeroIllimtes: number;
  fellowType: number;
  serviceId?;
}

export interface FormuleMobileModel {
  code: string;
  description: string;
  id: number;
  image: string;
  nomFormule: string;
  prixAppels: number;
  prixSMS: number;
  profil: ProfilModel;
  sos: any;
  tarifFormules: TarifFormuleModel[];
  type: 'MOBILE' | 'FIXE';
}

export interface TarifFormuleModel {
  categorie: 'APPEL' | 'SMS';
  code: number;
  description: string;
  id: number;
  tarif: any;
}

export interface ProfilModel {
  code: number;
  id: number;
  nomProfil: string;
  typeProfil: any;
}

export function getLastUpdatedDateTimeText() {
  const date = new Date();
  const lastDate = `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(
    -2
  )}/${date.getFullYear()}`;
  const lastDateTime = `${date.getHours()}h` + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  return `${lastDate} à ${lastDateTime}`;
}

export interface OmAuthInfo {
  hasApiKey: boolean;
  accessToken: string;
  apiKey: string;
  loginExpired: boolean;
}

export function getHeaders(nHttp: HTTP) {
  const headers: any = {};
  nHttp.setDataSerializer('json');
  headers['Content-Type'] = 'application/json';
  const token = ls.get('token');
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }
  return headers;
}

export function getResponse(res: any) {
  if (res.data) {
    return JSON.parse(res.data);
  }
  return null;
}

export interface SubscriptionModel {
  nomOffre: string;
  profil: string;
  code: string;
  clientCode?: string;
}

export function isFixeNumber(phone: string, souscription: SubscriptionModel) {
  return REGEX_FIX_NUMBER.test(phone) && isPostpaidFix(souscription);
}

export interface ItemBesoinAide {
  id: number;
  code: string;
  question: string;
  reponse: string;
  icone?: string;
  type?: string;
  descCourte?: string;
  descLong?: string;
  actif: boolean;
  priorite: number;
  categorieOffreService?: any;
  profils: any[];
  formules: any[];
  countTermMached?: number;
  countFiedMached?: number;
}

// this method removes prefix 221 +221 00221
export function formatPhoneNumber(phoneNumber: string) {
  const phoneNumberWithoutSpaces = phoneNumber.replace(/\s/g, '');
  // const res = phoneNumberWithoutSpaces.slice(phoneNumberWithoutSpaces.length - 9, phoneNumberWithoutSpaces.length);
  return phoneNumberWithoutSpaces;
}

export function parseIntoNationalNumberFormat(phoneNumber: string) {
  return phoneNumber.slice(phoneNumber.length - 9, phoneNumber.length);
}

export interface SponseeModel {
  id: number;
  msisdn: string;
  firstName: string;
  lastName: string;
  effective: boolean;
  createdDate: string;
  enabled: boolean;
}

export interface WelcomeStatusModel {
  status: string;
  type: string; // 'RECHARGE' or 'PASS'
  value: {
    amount: number;
    unit: string;
  };
}

export interface SargalStatusModel {
  valid: boolean;
  profilClient: string;
}

export function getCurrentDate() {
  const date = new Date();
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();
  const year = '' + date.getFullYear();
  const hour = '' + date.getHours();
  const minutes = '' + date.getMinutes();
  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }
  const result = [day, month, year].join('-') + ' ' + [hour, minutes].join(':');
  return result;
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

export interface ItemUserConso {
  categorie: string;
  consommations: UserConsommation[];
}

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

export const CGU_FILE_NAME = 'cgu_orangeetmoi.pdf';

/**
 * Compare two semver versions. Returns true if version A is greater than
 * version B.
 * Version A is the version from the server.
 * Version B is the installed version.
 */
export function isNewVersion(versionA: string, versionB: string) {
  if (versionA && versionB) {
    const versionsA = versionA.split(/\./g),
      versionsB = versionB.split(/\./g);
    while (versionsA.length || versionsB.length) {
      const a = Number(versionsA.shift()),
        b = Number(versionsB.shift());
      if (a === b) {
        continue;
      }
      return a > b || isNaN(b);
    }
  }
  return false;
}
export interface TarifZoningByCountryModel {
  name?: string;
  indicatif?: string;
  zone?: { name: string; tarifFormule: { tarifAppel: any; tarifSms: any } };
}

export interface NotificationInfoModel {
  codeFormule: string;
  firebaseId: string;
  msisdn: string;
}

export class PlatformMock {
  public ready(): Promise<string> {
    return new Promise(resolve => {
      resolve('READY');
    });
  }

  public getQueryParam() {
    return true;
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return () => true;
  }

  public hasFocus(ele: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public is(): boolean {
    return true;
  }

  public getElementComputedStyle(container: any): any {
    return {
      paddingLeft: '10',
      paddingTop: '10',
      paddingRight: '10',
      paddingBottom: '10',
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(ele: any, eventName: string, callback: any): Function {
    return () => true;
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
  }

  public cancelTimeout(id: any) {
    // do nothing
  }

  public getActiveElement(): any {
    return document['activeElement'];
  }
}

export class StatusBarMock extends StatusBar {
  styleDefault() {
    return;
  }
}

export class SplashScreenMock extends SplashScreen {
  hide() {
    return;
  }
}

export function getBanniereTitle(banniereDescription: string) {
  if (!banniereDescription) return;
  const semiColonIndex = banniereDescription.indexOf(';');
  if (semiColonIndex < 1) return banniereDescription;
  return banniereDescription ? banniereDescription.substring(0, banniereDescription.indexOf(';')) : '';
}

export function getBanniereDescription(banniereDescription: string) {
  return banniereDescription ? banniereDescription.substring(banniereDescription.indexOf(';') + 1) : '';
}

export const HelpModalDefaultContent: {
  popupTitle: string;
  popupSubtitle: string;
  options: {
    title: string;
    subtitle: string;
    type: string;
    url: string;
    action: string;
    subOptions?: { title: string; subtitle: string; icon?: string }[];
  }[];
  showChecks?: boolean;
} = {
  popupTitle: 'Quel souci rencontrez-vous ?',
  popupSubtitle: '',
  options: [
    {
      title: 'Mon numéro ne s’affiche pas',
      subtitle: 'Suivez les instructions du tutoriel',
      type: 'ERROR_AUTH_IMP',
      url: '',
      action: 'POPUP',
      subOptions: [
        {
          title: 'Activez vos données mobiles &nbsp<img class="item-icon" src="/assets/images/donnes-mobiles.png" />',
          subtitle: 'Accéder au menu « Réseaux » depuis vos « Paramètres »',
        },
        {
          title: 'Désactivez le Wifi &nbsp<img class="item-icon" src="/assets/images/wifi.png" /></span>',
          subtitle: 'Accéder au menu « Wifi » depuis vos « Paramètres » et décochez la case « Wifi »',
        },
        {
          title: 'Assurez vous d’être sur le bon APN (Point d’Accès Internet)',
          subtitle:
            'Accéder au menu « Réseaux mobiles » ( parfois caché dans le menu « Plus » ) afin d’accéder aux « Noms des points d’accès »',
        },
      ],
    },
    {
      title: 'J’ai oublié mon mot de passe ou mon compte est bloqué.',
      subtitle: 'Je réinitialise mon mot de passe',
      type: 'FORGOT_PWD',
      url: '',
      action: 'REDIRECT',
      subOptions: [
        {
          title: 'Activez vos données mobiles &nbsp<img class="item-icon" src="/assets/images/donnes-mobiles.png" />',
          subtitle: 'Accéder au menu « Réseaux » depuis vos « Paramètres »',
        },
        {
          title: 'Désactivez le Wifi &nbsp<img class="item-icon" src="/assets/images/wifi.png" /></span>',
          subtitle: 'Accéder au menu « Wifi » depuis vos « Paramètres » et décochez la case « Wifi »',
        },
        {
          title: 'Une fois identifié, je clique sur suivant',
          subtitle: 'Si votre numéro s’affiche, cliquez sur le bouton « Suivant »',
        },
        {
          title: 'Saisissez votre nouveau mot de passe',
          subtitle: 'Je saisis mon nouveau mot de passe et le confirme',
        },
      ],
    },
    {
      title: 'Mon numéro est rattaché à un compte',
      subtitle: 'Je veux le supprimer ?',
      type: 'ERROR_ATTACHED_NUMBER',
      url: '',
      action: 'POPUP',
      subOptions: [
        {
          title: 'Rendez-vous sur la page d’accueil en mode connecté',
          subtitle:
            'Accédez à la page de connexion puis connectez-vous avec le compte ayant rattaché votre numéro en question',
        },
        {
          title: 'Accédez au menu « Mon compte »',
          subtitle: 'Depuis l’accueil, cliquez sur le menu de gauche puis sur « Mon compte »',
        },
        {
          title: 'Supprimez le numéro rattaché',
          subtitle: 'Cliquez sur « Supprimer une ligne », choisissez la ligne à supprimer puis confirmer',
        },
      ],
    },
    {
      title: 'Je ne sais plus si j’ai un compte',
      subtitle: 'Suivez les instructions du tutoriel',
      type: 'ERROR_AUTH_IMP',
      url: '',
      action: '',
      subOptions: [
        {
          title: 'Rendez vous sur la page de création de compte',
          subtitle: 'A l’ouverture de l’application, cliquez sur la première rubrique « C’est ma première visite »',
        },
        {
          title: 'Une fois identifié, cliquez sur "Suivant"',
          subtitle: 'Si votre numéro s’affiche, cliquez sur le bouton « Suivant »',
        },
        {
          title: 'Vous serez redirigé vers la page adéquate',
          subtitle:
            'Vous serez redirigé vers la page de création de mot de passe si vous n’avez pas de compte dans le cas contraire vers la page de connexion',
        },
      ],
    },
    {
      title: 'Je n’arrive pas à me connecter',
      subtitle: 'Suivez les instructions du tutoriel',
      type: 'LOGIN',
      url: '',
      action: '',
      subOptions: [
        {
          title:
            'L’accés à Orange et moi est gratuit en étant sur le réseau Orange, assurez vous d’avoir activé les données mobiles sur la sim Orange',
          subtitle: 'Accéder au menu « Réseaux » depuis vos « Paramètres »',
        },
        {
          title: 'Si vous êtes sur le Wifi, assurez vous d’avoir une connexion internet',
          subtitle: 'Accéder au menu « Wifi » depuis vos « Paramètres » pour vous connecter à un réseau Wifi',
        },
      ],
    },
    {
      title: 'Comment configurer le bon APN (Point d’Accès Internet)',
      subtitle: 'Suivez les instructions du tutoriel',
      type: 'APN',
      url: '',
      action: '',
      subOptions: [
        {
          title:
            '<span>Accéder aux Paramètres &nbsp <img class="item-icon" src="/assets/images/parameters.png" /></span>',
          subtitle: 'Rendez-vous dans « Paramètres ou Réglages » via le Menu ou votre écran d’accueil',
          icon: 'settings',
        },
        {
          title:
            '<span>Sélectionner la partie Sans fil et réseau &nbsp<img class="item-icon" src="/assets/images/wifi.png" /></span>',
          subtitle: 'Rendez-vous dans « Paramètres ou Réglages » via le Menu ou votre écran d’accueil ',
          icon: 'wifi',
        },
        {
          title:
            '<span>Choisissez ensuite Réseau mobile ou Réseau de données mobiles &nbsp<img class="item-icon" src="/assets/images/donnes-mobiles.png" /></span>',
          subtitle:
            'Accéder au menu « Réseaux mobiles » ( parfois caché dans le menu « Plus » ) afin d’accéder aux « Noms des points d’accès »',
        },
        {
          title: 'Allez sur Noms des points d’accès (APN)',
          subtitle: 'Je saisis mon nouveau mot de passe et le confirme',
        },
        {
          title: 'Il n’y a plus qu’à renseigner les informations de l’APN d’Orange',
          subtitle:
            'Les paramètres internet Orange sont: \nNom : Orange Internet \nAPN : internet \nLaisser tous les autres options en l’état puis sauvegarder',
        },
      ],
    },
    {
      title: 'Je suis client fixe, comment accéder à mon espace ?',
      subtitle: 'Suivez les instructions du tutoriel',
      type: '',
      url: '',
      action: '',
      subOptions: [
        {
          title: 'Vous devez accéder à Orange et moi, avec un numéro mobile',
          subtitle: 'Activez vos données mobile sur la Sim Orange',
        },
        {
          title:
            'Une fois connecté, cliquez sur le menu de gauche(trois traits), puis cliquez sur l’entrée "Mon compte"',
          subtitle: 'Cliquez sur le menu en haut à gauche de l’écran puis sur "Mon compte"',
        },
        {
          title:
            'Une fois sur "Mon compte", cliquez sur "Rattachez une ligne" et saisissez votre numéro de téléphone fixe',
          subtitle:
            'Saisissez votre numéro de téléphone fixe pour pouvoir le lier à votre compte et suivre sa consommation',
        },
        {
          title: 'Et enfin suivez les instructions',
          subtitle:
            'Une fois fait, retournez cliquer sur le menu de gauche puis cliquez sur "Changer de ligne" et choisissez votre numéro fixe',
        },
      ],
    },
    {
      title: 'J’ai besoin d’assistance',
      subtitle: 'Suivez les instructions du tutoriel',
      type: '',
      url: '',
      action: '',
      subOptions: [
        {
          title:
            'Une fois connecté, cliquez sur le bouton Ibou puis cliquez sur "Besoin d’aide" puis "Contacter l’assistance"',
          subtitle: 'Suivre ces instructions',
        },
        {
          title: 'Choisissez le canal de communication souhaité',
          subtitle: 'Cliquez sur le canal de communication qui vous convient',
        },
        {
          title: 'Décrire brièvement le souci rencontré, si possible y joindre une capture ou le message d’erreur',
          subtitle: 'Bien expliquer son souci pour un meilleur traitement de celui-ci',
        },
      ],
    },
  ],
  showChecks: false,
};

export const HelpModalRegisterOMContent: {
  popupTitle: string;
  popupSubtitle: string;
  options: {
    title: string;
    subtitle: string;
    type: string;
    url: string;
    action: string;
    subOptions?: { title: string; subtitle: string; icon?: string }[];
  }[];
  showChecks?: boolean;
} = {
  popupTitle: 'On a besoin de récupérer votre numéro à partir du réseau',
  popupSubtitle: 'On a besoin de récupérer votre numéro à partir du réseau',
  options: [
    {
      title: 'Mon numéro ne s’affiche pas',
      subtitle: 'Suivez les instructions du tutoriel',
      type: 'ERROR_AUTH_IMP',
      url: '',
      action: 'POPUP',
      subOptions: [
        {
          title: 'Activez vos données mobiles &nbsp<img class="item-icon" src="/assets/images/donnes-mobiles.png" />',
          subtitle: 'Accéder au menu « Réseaux » depuis vos « Paramètres »',
        },
        {
          title: 'Désactivez le Wifi &nbsp<img class="item-icon" src="/assets/images/wifi.png" /></span>',
          subtitle: 'Accéder au menu « Wifi » depuis vos « Paramètres » et décochez la case « Wifi »',
        },
        {
          title: 'Assurez vous d’être sur le bon APN (Point d’Accès Internet)',
          subtitle:
            'Accéder au menu « Réseaux mobiles » ( parfois caché dans le menu « Plus » ) afin d’accéder aux « Noms des points d’accès »',
        },
      ],
    },
    {
      title: 'Comment configurer le bon APN (Point d’Accès Internet)',
      subtitle: 'Suivez les instructions du tutoriel',
      type: 'APN',
      url: '',
      action: '',
      subOptions: [
        {
          title:
            '<span>Accéder aux Paramètres &nbsp <img class="item-icon" src="/assets/images/parameters.png" /></span>',
          subtitle: 'Rendez-vous dans « Paramètres ou Réglages » via le Menu ou votre écran d’accueil',
          icon: 'settings',
        },
        {
          title:
            '<span>Sélectionner la partie Sans fil et réseau &nbsp<img class="item-icon" src="/assets/images/wifi.png" /></span>',
          subtitle: 'Rendez-vous dans « Paramètres ou Réglages » via le Menu ou votre écran d’accueil ',
          icon: 'wifi',
        },
        {
          title:
            '<span>Choisissez ensuite Réseau mobile ou Réseau de données mobiles &nbsp<img class="item-icon" src="/assets/images/donnes-mobiles.png" /></span>',
          subtitle:
            'Accéder au menu « Réseaux mobiles » ( parfois caché dans le menu « Plus » ) afin d’accéder aux « Noms des points d’accès »',
        },
        {
          title: 'Allez sur Noms des points d’accès (APN)',
          subtitle: 'Je saisis mon nouveau mot de passe et le confirme',
        },
        {
          title: 'Il n’y a plus qu’à renseigner les informations de l’APN d’Orange',
          subtitle:
            'Les paramètres internet Orange sont: \nNom : Orange Internet \nAPN : internet \nLaisser tous les autres options en l’état puis sauvegarder',
        },
      ],
    },
  ],
  showChecks: false,
};

export const HelpModalAuthErrorContent = {
  popupTitle: 'Assurez-vous :',
  popupSubtitle: '',
  options: [
    {
      title: 'De désactiver le WIFI',
      subtitle: 'Voir le tutoriel',
      type: 'WIFI_AUTH_IMP',
      url: '',
      action: 'POPUP',
    },
    {
      title: "D'être sur le bon APN",
      subtitle: '(orange, internet)',
      type: 'APN_AUTH_IMP',
      url: '',
      action: 'POPUP',
    },
    {
      title: "D'activer les données mobiles",
      subtitle: 'Voir le tutoriel',
      type: 'DATA_AUTH_IMP',
      url: '',
      action: 'POPUP',
    },
  ],
  showChecks: true,
};

export const HelpModalMsisdnNotDisplayed = {};

export const HelpModalAPNContent = {
  popupTitle: 'Êtes-vous sur le  bon APN ?',
  popupSubtitle:
    ' APN, pour Access Point Name, correspond aux paramètres réseau de votre opérateur.' +
    'Grâce à ces informations, vous allez pouvoir accéder au réseau de votre fournisseur, ' +
    'et ainsi pouvoir envoyer des MMS ou surfer sur internet.',
  options: [
    {
      title: "Comment configurer l'APN ?",
      subtitle: 'Voir le tutoriel',
      type: 'CONFIG_APN_AUTH_IMP',
      url: '',
      action: 'POPUP',
    },
  ],
  showChecks: false,
};

export const HelpModalConfigApnContent = {
  popupTitle: 'Comment configurer  mon APN',
  popupSubtitle: '',
  options: [
    {
      title: '1) Accéder aux Paramètres',
      subtitle: 'Rendez-vous dans « Paramètres ou Réglages » via le Menu ou votre écran d’accueil',
      type: '',
      url: '',
      action: 'POPUP',
    },
    {
      title: '2) Sélectionner la partie Sans fil et réseau',
      subtitle: 'Rendez-vous dans « Paramètres ou Réglages » via le Menu ou votre écran d’accueil',
      type: '',
      url: '',
      action: 'POPUP',
    },
    {
      title: '3) Choisissez ensuite Réseau mobile ou Réseau de données mobiles',
      subtitle:
        'Accéder au menu « Réseaux mobiles » ( parfois caché dans le menu « Plus » ) afin d’accéder aux « Noms des points d’accès »',
      type: '',
      url: '',
      action: 'POPUP',
    },
    {
      title: '4) Allez sur Noms des points d’accès (APN)',
      subtitle:
        'Accéder au menu « Réseaux mobiles »' +
        '( parfois caché dans le menu « Plus » ) afin d’accéder aux « Noms des points d’accès »',
      type: '',
      url: '',
      action: 'POPUP',
    },
    {
      title: '5) Il n’y a plus qu’à renseigner les informations de l’APN d’Orange',
      subtitle:
        'Les paramètres internet Orange sont: \n' +
        'Nom : Orange Internet\n' +
        ' APN : internet\n' +
        'Laisser tous les autres options en l’état puis sauvegarder',
      type: '',
      url: '',
      action: 'POPUP',
    },
  ],
  showChecks: false,
};

export const TRANSFER_BONUS_CREDIT_FEE = 20;
export const ERROR_MSG_PASS = {
  LIST_EMPTY: "Aucun pass n'a été trouvé pour ce profil",
  LIST_EMPTY_FOR_KIRENE:
    'Diegalou, Mixel et Wotel sont temporairement indisponibles sur Orange et Moi. Tu peux continuer à souscrire au #220# ou au #144#. Bul xaar, souscris vite. Nio far !',
};

export function concatArtistsNames(artistsArray: { nom?: string }[]) {
  if (!artistsArray || !artistsArray.length) {
    return '';
  }
  return artistsArray.map(artist => artist.nom).join(', ');
}
export const MONTHLY_DALAL_TARIF = '350 FCFA /mois';
export const DAILY_DALAL_TARIF = '12 FCFA /jour';
export const LOCAL_ZONE = 'Zone Locale';
export const LIGHT_DASHBOARD_EVENT = 'GO_DASHBOARD_LIGHT';
export const REGISTRATION_PASSWORD_STEP = 'PASSWORD';
export const USER_ERROR_MSG_BLOCKED =
  'Votre Compte Orange et Moi a été bloqué. Cliquez sur mot de passe oublié et suivez les instructions.';

export enum IlliflexOption {
  BUDGET = 'BUDGET',
  USAGE = 'USAGE',
}

export function getMaxDataVolumeOrVoiceOfPaliers(paliers: PalierModel[], dataOrVoice: 'data' | 'voice') {
  const maxAmount = Math.max(...paliers.map(palier => palier.maxPalier));
  const palier = paliers.find(palier => palier.maxPalier === maxAmount);
  const unitPrice = dataOrVoice === 'data' ? palier.dataPrice : palier.voicePrice;
  const maxPercentage = 0.8;
  return (maxPercentage * maxAmount) / (unitPrice * 1.239);
}

export function getMinDataVolumeOrVoiceOfPaliers(paliers: PalierModel[], dataOrVoice: 'data' | 'voice') {
  const minAmount = Math.min(...paliers.map(palier => palier.minPalier));
  const palier = paliers.find(palier => palier.minPalier === minAmount);
  const unitPrice = dataOrVoice === 'data' ? palier.dataPrice : palier.voicePrice;
  const minPercentage = 0.2;
  return (minPercentage * minAmount) / (unitPrice * 1.239);
}

// method to get boosters array for a specific pass
export function getActiveBoostersForSpecificPass(pass, boosters: BoosterModel[]) {
  const passPPI = pass.passPromo ? pass.passPromo?.price_plan_index : pass?.price_plan_index;
  const boostersArray = boosters.filter(booster => booster.pricePlanIndexes.includes(passPPI?.toString()));
  return boostersArray;
}

export enum HUB_ACTIONS {
  ACHAT = 'HUB_ACHAT',
  TRANSFERT = 'HUB_TRANSFER',
  FACTURES = 'HUB_BILLS',
}

export enum TYPE_ACTION_ON_BANNER {
  DEEPLINK = 'DEEPLINK',
  REDIRECTION = 'REDIRECTION',
  MODAL = 'MODAL',
}

export const ANNULATION_TRANSFER_DEADLINE = '5 jours';
export const ILLIFLEX_BY_OM_UNKOWN_ERROR_CODE = '24';
export const ILLIFLEX_BY_OM_IDENTICAL_ERROR_CODE = '2040';
export const OM_IDENTIC_TRANSACTION_CODE = 'Erreur-045';
export const OM_UNKOWN_ERROR_CODE = 'Erreur-019';
export const OM_CAPPING_ERROR = 'Capping-social-error';
export const TRANSFER_BALANCE_INSUFFICIENT_ERROR = 'Le montant que vous voulez transférer est supérieur à votre solde.';
export const BALANCE_INSUFFICIENT_ERROR = 'Le montant de votre solde est insuffisant pour effectuer cette opération.';
export const TRANSFER_OM_BALANCE_NOT_ALLOWED = "Le montant que vous avez saisi n'est pas dans la plage autorisée";
export const FEES_ERROR = 'Erreur lors de la récupération des frais. Réactualisez';

export const NO_RECENTS_MSG = 'Pas de bénéficiaire récent pour cette opération';

export const isProfileHybrid = (profile: string) => {
  return profile === PROFILE_TYPE_HYBRID || profile === PROFILE_TYPE_HYBRID_1 || profile === PROFILE_TYPE_HYBRID_2;
};

export const CONSO = 'SUIVI_CONSO';
export const ASSISTANCE = 'ASSISTANCE';
export const SERVICES = 'SERVICES';

export enum GET_MSISDN_ENUM {
  DISABLE_WIFI = 'disableWifi',
  ENABLE_4G = 'enable4G',
}
export const FORGOT_PWD_PAGE_URL = 'forgot-pwd';

export enum OM_STATUS_TEXTS {
  DECAP_ACCOUNT = `Déplafonner mon compte`,
  OPEN_ACCOUNT = `Ouvrir compte OM`,
  CREATE_PIN = `Créer mon pin OM`,
  CREATE_PIN_TEXT = `Votre compte a été créé avec succès. Veuillez créer votre code PIN OM`,
  DECAPPED_ACCOUNT = `Votre compte a été déplafonné. Vous pouvez effectuer des opérations jusqu'a 2.000.000 FCFA`,
  OPENED_ACCOUNT = `Votre ouverture de compte est effectué avec succès`,
  OPENING_ACCOUNT = `Votre demande de d'ouverture de compte est en cours`,
  ERROR_OPENING_ACCOUNT = `Une erreur est survenue lors du traitement de votre demande d'ouverture de compte`,
  NO_ACCOUNT = `Votre numéro n'a pas de compte OM`,
  DECAPPING_ACCOUNT = `Votre demande de déplafonnement est en cours`,
  CAPPED_ACCOUNT = `Votre compte est plafonné à un cumul de transactions à 200.000F`,
  ERROR_DECAPPING_ACCOUNT = `Une erreur est survenue lors du traitement de votre demande de déplafonnement`,
}

export const ERROR_MSG_DEPLAFONNEMENT_ON_INIT_UNBLOCK_OM =
  "Déplafonnez votre compte via l'appli Orange & Moi ou dans notre réseau d’agence Orange et Kiosque avant de pouvoir utiliser ce service.";

export const OTHER_CATEGORIES = 'OTHER_CATEGORIES';

export enum CountriesIndicatif {
  WORLD = 'WORLD',
  AFRICA = 'AFRICA',
}

export const INTERNATIONAL_PASSES_INDICATIF_ARRAY: string[] = [CountriesIndicatif.WORLD, CountriesIndicatif.AFRICA];

export const UNKNOWN_ECHEANCE = 'non renseignée';

// return true if bill is unpaid && due date otherwise return false
export function isDelayedBill(bill: InvoiceOrange) {
  if (bill.dateEcheance === UNKNOWN_ECHEANCE) {
    return false;
  }
  const today = new Date();
  const billDate = new Date(bill.dateEcheance);
  return billDate.getTime() < today.getTime() && bill.statutFacture === 'unpaid';
}

export const IRT_TRANSFER_REASONS = [
  { value: 'Achat de bien et service', id: 1 },
  { value: 'Assistance familiale', id: 2 },
  { value: 'Epargne', id: 3 },
  { value: 'Frais médicaux', id: 4 },
  { value: 'Frais scolaires', id: 5 },
  { value: 'Investissement', id: 6 },
  { value: 'Oeuvres et dons', id: 7 },
];

export function formatCountryCallId(callId: string) {
  if (callId.startsWith('+')) {
    return callId.substring(1);
  } else if (callId.startsWith('00')) {
    return callId.substring(2);
  }
  return callId;
}

// mobile or fixe
export enum MSISDN_TYPE {
  MOBILE = 'MOBILE',
  FIXE = 'FIXE',
}

export const MAXIMUM_PAYABLE_BILL_AMOUNT = 150000;
// Dalal Tones Requirements
export const MINIMUM_REQUIRED_RECHARGEMENT_SOLDE_TO_ACTIVATE_DALAL = 12;
