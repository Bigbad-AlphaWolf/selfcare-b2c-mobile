import * as SecureLS from 'secure-ls';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

const ls = new SecureLS({ encodingType: 'aes' });
export const REGEX_NUMBER: RegExp = /^((\+221|00221|221) ?)?(7(0|6|7|8){1}) ?([0-9]{3}) ?([0-9]{2}) ?([0-9]{2})$/;
export const REGEX_NUMBER_OM: RegExp = /^((\+221|00221|221) ?)?(7(0|6|7|8){1}) ?([0-9]{3}) ?([0-9]{2}) ?([0-9]{2})$/;
export const REGEX_FIX_NUMBER: RegExp = /^((\+221|00221|221) ?)?(33) ?([0-9]{3}) ?([0-9]{2}) ?([0-9]{2})$/;
export const REGEX_PASSWORD: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/;
export const REGEX_PASSWORD2: RegExp = /^.{5,19}$/;
export const REGEX_NAME = /^([^0-9_!¡?÷?¿/+=,.@#$%ˆ&*(){}|~<>;:\]\[-]){1,}$/;
export const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const REGEX_DIGIT = /\d/;
export const REGEX_POSTPAID_FIXE = /(Keurgui).*|(Fibre).*|(LFB).*|(HOME).*/i;
export const REGEX_PREPAID_FIXE = /(BOX).*/i;

export const USER_CONS_CATEGORY_CALL = 'APPEL';
export const USER_CONS_CATEGORY_INTERNET = 'INTERNET';
export const USER_CONS_CATEGORY_SMS = 'SMS';
export const USER_CALL_SUMMARY_CONSO_CODES = [1, 6, 9];
export const OPERATION_TYPE_PASS_INTERNET = 'PASS_INTERNET';
export const OPERATION_TYPE_PASS_ILLIMIX = 'PASS_ILLIMIX';
export const OPERATION_TYPE_MERCHANT_PAYMENT = 'MERCHANT_PAYMENT';
export const OPERATION_TYPE_SOS = 'SOS';
export const OPERATION_TYPE_SOS_CREDIT = 'SOS CREDIT';
export const OPERATION_TYPE_SOS_PASS = 'SOS DATA';
export const OPERATION_TYPE_SOS_ILLIMIX = 'SOS Illimix';
export const OPERATION_TYPE_SEDDO_CREDIT = 'SEDDO CREDIT';
export const OPERATION_TYPE_SEDDO_PASS = 'SEDDO PASS';
export const OPERATION_TYPE_SEDDO_BONUS = 'SEDDO BONUS';
export const OPERATION_TYPE_TRANSFER_OM = 'orange-money';
export const OPERATION_TYPE_RECHARGE_CREDIT = 'RECHARGEMENT_CREDIT';
export const OPERATION_TYPE_SARGAL_CONVERSION = 'SARGAL_CONVERSION';
export const OPERATION_TRANSFER_OM = 'TRANSFER_MONEY';
export const OPERATION_TRANSFER_OM_WITH_CODE = 'TRANSFER_MONEY_WITH_CODE';
export const BONS_PLANS = 'BONS_PLANS';

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
export const CODE_COMPTEUR_CREDIT_MENSUEL_OFFERT = 8;
export const MAIL_URL = 'mailto:serviceclient@orange-sonatel.com';
export const NO_AVATAR_ICON_URL = '/assets/images/profil-mob.png';
export const ASSISTANCE_URL = 'https://assistance.orange.sn';
export const FACEBOOK_URL = 'https://m.me/165622776799685';
export const TWITTER_URL =
  'https://twitter.com/messages/compose?recipient_id=733327435299729408';

export const VALID_IMG_EXTENSIONS = ['jpg', 'jpeg', 'png'];

export const CREDIT = 'crédit';
export const BONUS = 'bonus';

// Maximum size of avatar image allowed in bytes : 3 Mo ou 1024Ko
export const MAX_USER_AVATAR_UPLOAD_SIZE = 3072;

// Maximum size of avatar image allowed in bytes : 5 Mo ou 5 * 1024Ko
export const MAX_USER_FILE_UPLOAD_SIZE = 5120;

export const CATEGORY_PURCHASE_HISTORY = [
  { nom: 'Tous', value: undefined },
  { nom: 'Rechargement', value: 'RECHARGEMENT' },
  { nom: 'Transfert Bonus', value: 'TRANSFERT_BONUS' },
  { nom: 'Pass Illimix', value: 'ILLIMIX' },
  { nom: 'Pass Internet', value: 'INTERNET' },
  { nom: 'Dalal Tones', value: 'DALALTONE' },
  { nom: 'Achat pour tiers', value: 'PASSFOROTHER' },
  { nom: 'Transfert Credit', value: 'SEDDO' },
  { nom: 'SOS', value: 'SOS' },
];

export const listRegisterSargalBonPlanText = [ 'inscription', 'inscris'];

export function getNOAvatartUrlImage() {
  return NO_AVATAR_ICON_URL;
}

export function isExtensionImageValid(fileType: string) {
  const result = VALID_IMG_EXTENSIONS.filter((x) => {
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

export function getOrderedListCategory(
  unorderedList: CategoryPassInternet[]
): CategoryPassInternet[] {
  let listCategoryFiltered = [];
  unorderedList.sort(
    (elt1: CategoryPassInternet, elt2: CategoryPassInternet) =>
      elt1.ordre - elt2.ordre
  );
  listCategoryFiltered = [...new Set(unorderedList.map((x) => x.libelle))];
  return listCategoryFiltered;
}

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
    detailConso.consommations.sort(
      (conso1: UserConsommation, conso2: UserConsommation) => {
        if (conso1 && conso2 && conso1.ordre && conso2.ordre) {
          return conso1.ordre - conso2.ordre;
        } else if (conso1 && conso2 && conso1.ordre === null && conso2.ordre) {
          return +conso2.ordre;
        } else if (conso1 && conso2 && conso2.ordre === null && conso1.ordre) {
          return -conso1.ordre;
        }
      }
    );
  });
  return listConso;
}
export function getListPassFilteredByLabelAndPaymentMod(
  selectedLabel: string,
  listPass: (
    | (PassInfoModel | PromoPassModel)
    | (PassIllimModel | PromoPassIllimModel)
  )[]
) {
  let listPassFiltered = [];
  listPassFiltered = listPass.filter((pass: any) => {
    if (!pass.passPromo) {
      return pass.categoriePass.libelle === selectedLabel;
    } else {
      return pass.passPromo.categoriePass.libelle === selectedLabel;
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
          return item.label === pass.categoriePass.libelle;
        })
        .pass.push(pass);
    } else {
      result
        .find((item: { label: string; pass: any[] }) => {
          return item.label === pass.passPromo.categoriePass.libelle;
        })
        .pass.push(pass);
    }
  });

  //order pass by tarif
  result.forEach(
    (itemPassCategory: { label: string; pass: any[] }, index: number) => {
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
    }
  );
  return result;
}

export function computeConsoHistory(consos) {
  const result = [];

  consos.forEach((x) => {
    const {
      date,
      categorie,
      calledNumber,
      duration,
      charge1,
      charge2,
      chargeType1,
      chargeType2,
    } = x;
    let conso1, conso2;

    if (charge1) {
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
    if (charge2) {
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
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now(); // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
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
  const itemFound = listLibelleCodeOperationOM.find(
    (item: { operationCode: string; operationLibelle: string }) => {
      return item.operationLibelle === libelle;
    }
  );

  return itemFound ? itemFound.operationCode : null;
}

export const FILENAME_OPEN_OM_ACCOUNT =
  'formulaire_inscription_om_original.pdf';
export const FILENAME_DEPLAFONNEMENT_OM_ACCOUNT =
  'formulaire_deplafonnement_original.pdf';
export const FILENAME_ERROR_TRANSACTION_OM =
  'formulaire_erreur_transaction_original.pdf';

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
  prix: string;
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
  const lastDate = `${('0' + date.getDate()).slice(-2)}/${(
    '0' +
    (date.getMonth() + 1)
  ).slice(-2)}/${date.getFullYear()}`;
  const lastDateTime =
    `${date.getHours()}h` +
    (date.getMinutes() < 10 ? '0' : '') +
    date.getMinutes();
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

export interface ItemBesoinAide {
  id: number;
  code: string;
  question: string;
  reponse: string;
  actif: boolean;
  priorite: number;
  categorieAide: any;
  profils: any[];
  formules: any[];
}

// this method removes prefix 221 +221 00221
export function formatPhoneNumber(phoneNumber: string) {
  const phoneNumberWithoutSpaces = phoneNumber.replace(/\s/g, '');
  const res = phoneNumberWithoutSpaces.slice(
    phoneNumberWithoutSpaces.length - 9,
    phoneNumberWithoutSpaces.length
  );
  return res;
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

export interface PurchaseModel {
  typeAchat: string;
  amount: number;
  name: string;
  channel: string;
  operationDate: string;
  operationType: 'DEBIT' | 'CREDIT';
  details: any[];
}

/**
 * Compare two semver versions. Returns true if version A is greater than
 * version B.
 * Version A is the version from the server.
 * Version B is the installed version.
 */
export function isNewVersion(versionA, versionB) {
  if(versionA && versionB){
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
    return new Promise((resolve) => {
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

  public registerListener(
    ele: any,
    eventName: string,
    callback: any
  ): Function {
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
  return banniereDescription.substring(0, banniereDescription.indexOf(';'));
}

export function getBanniereDescription(banniereDescription: string) {
  return banniereDescription.substring(banniereDescription.indexOf(';') + 1);
}

export const HelpModalDefaultContent = {
  popupTitle: 'Quel soucis rencontrez-vous ?',
  popupSubtitle: '',
  options: [
    {
      title: 'Mon numéro ne s’affiche pas',
      subtitle: 'Regarder le tutoriel',
      type: 'ERROR_AUTH_IMP',
      url: '',
      action: 'POPUP',
    },
    {
      title: 'C’est ma première connexion',
      subtitle: 'Je veux créer un compte',
      type: 'REGISTER',
      url: '',
      action: 'REDIRECT',
    },
    {
      title: 'J’ai déjà un compte',
      subtitle: 'Je veux me connecter',
      type: 'LOGIN',
      url: '',
      action: 'REDIRECT',
    },
    {
      title: 'J’ai oublié mon mot de passe',
      subtitle: 'Je veux le récupérer',
      type: 'FORGOT_PWD',
      url: '',
      action: 'REDIRECT',
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
      subtitle:
        'Rendez-vous dans « Paramètres ou Réglages » via le Menu ou votre écran d’accueil',
      type: '',
      url: '',
      action: 'POPUP',
    },
    {
      title: '2) Sélectionner la partie Sans fil et réseau',
      subtitle:
        'Rendez-vous dans « Paramètres ou Réglages » via le Menu ou votre écran d’accueil',
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
      title:
        '5) Il n’y a plus qu’à renseigner les informations de l’APN d’Orange',
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
