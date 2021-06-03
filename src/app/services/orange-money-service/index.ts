export interface OmUserInfo {
  solde: number;
  msisdn: string;
  registerToken: string;
  registerRefreshToken: string;
  loginToken: string;
  loginRefreshToken: string;
  apiKey: string;
  history: any[];
  active: boolean;
  pinFailed: number;
  sequence: string;
  em: string;
  lastUpdate: string;
  lastUpdateTime: string;
  showSolde: boolean;
}
export interface OmRegisterClientModel {
  msisdn: string;
  code_otp: string;
  uuid: string; // user unique id in selfcare b2c backend
  os: string;
  firebase_id: string;
  app_version: string;
  conf_version: string;
  service_version: string;
}

export interface OmLoginClientModel {
  msisdn: string;
  pin: string;
  em: string;
  app_version: string;
  app_conf_version: string;
  user_type: string;
  service_version: string;
  uuid: string;
}
export interface OmPinPadModel {
  msisdn: string;
  os: string;
  app_version: string;
  app_conf_version: string;
  service_version: string;
  uuid: string;
}

export const OM_SERVICE_VERSION = '1.1';

export interface OmBalanceModel {
  msisdn: string;
  pin: string;
  em: string;
  app_version: string;
  app_conf_version: string;
  user_type: string;
  service_version: string;
  uuid: string;
}

export interface OmBuyPassModel {
  msisdn: string;
  msisdn2: string;
  pin: string;
  em: string;
  price_plan_index: string;
  app_version: string;
  app_conf_version: string;
  user_type: string;
  service_version: string;
  canal?: string;
  amount: number;
  uuid: string;
}

export interface OmBuyCreditModel {
  msisdn: string;
  msisdn2: string;
  pin: string;
  em: string;
  amount: number;
  app_version: string;
  app_conf_version: string;
  user_type: string;
  service_version: string;
  uuid: string;
}

export interface OmBuyIllimixModel {
  msisdn: string;
  msisdn2: string;
  pin: string;
  em: string;
  price_plan_index: string;
  app_version: string;
  app_conf_version: string;
  user_type: string;
  service_version: string;
  canal?: string;
  amount: number;
  uuid: string;
}

export interface TransferOrangeMoneyModel {
  msisdn_sender: string;
  msisdn_receiver: string;
  amount: number;
  send_fees: number;
  cashout_fees: number;
  fees: number;
  a_ma_charge: boolean;
  uuid: string;
  os: string;
  pin: string;
  em: string;
  app_version: string;
  app_conf_version: string;
  user_type: string;
  service_version: string;
}

export interface TransferOMWithCodeModel {
  msisdn: string;
  msisdn2: string;
  amount: number;
  uuid: string;
  os: string;
  pin: string;
  em: string;
  app_version: string;
  app_conf_version: string;
  user_type: string;
  service_version: string;
  nom_receiver: string;
  prenom_receiver: string;
  send_fees?: number;
  cashout_fees?: number;
  fees?: number;
  a_ma_charge?: boolean;
}
export interface BuyPassPayload {
  msisdn2: string;
  pin: any;
  price_plan_index: string;
  canalPromotion?: string;
  amount: number;
}

export interface MerchantPaymentModel {
  amount: number;
  code_marchand: string;
  em: string;
  msisdn: string;
  nom_marchand: string;
  pin: string;
  uuid: string;
}

export interface LogModel {
  userId: string;
  contexte: string;
  message: string;
  dateLog: string;
  type: string;
  params: string;
}

export interface FeeModel {
  service_code: string;
  min: number;
  max: number;
  has_promo: boolean;
  effective_fees: number;
  mode_calcul: 'pourcent' | 'fixe';
  old_fees: number;
}

export const ORANGE_MONEY_TRANSFER_FEES = [
  {
    id: 1,
    level: 1,
    minimum: 1,
    maximum: 495,
    withoutCode: 25,
    withCode: 25,
  },
  {
    id: 2,
    level: 2,
    minimum: 496,
    maximum: 1100,
    withoutCode: 90,
    withCode: 95,
  },
  {
    id: 3,
    level: 3,
    minimum: 1101,
    maximum: 3000,
    withoutCode: 180,
    withCode: 190,
  },
  {
    id: 4,
    level: 4,
    minimum: 3001,
    maximum: 5000,
    withoutCode: 350,
    withCode: 375,
  },
  {
    id: 5,
    level: 5,
    minimum: 5001,
    maximum: 10000,
    withoutCode: 500,
    withCode: 600,
  },
  {
    id: 6,
    level: 6,
    minimum: 10001,
    maximum: 15000,
    withoutCode: 700,
    withCode: 900,
  },
  {
    id: 7,
    level: 7,
    minimum: 15001,
    maximum: 20000,
    withoutCode: 900,
    withCode: 1000,
  },
  {
    id: 8,
    level: 8,
    minimum: 20001,
    maximum: 35000,
    withoutCode: 1400,
    withCode: 1500,
  },
  {
    id: 9,
    level: 9,
    minimum: 35001,
    maximum: 60000,
    withoutCode: 1700,
    withCode: 2000,
  },
  {
    id: 10,
    level: 10,
    minimum: 60001,
    maximum: 100000,
    withoutCode: 2600,
    withCode: 3000,
  },
  {
    id: 11,
    level: 11,
    minimum: 100001,
    maximum: 175000,
    withoutCode: 3500,
    withCode: 3750,
  },
  {
    id: 12,
    level: 12,
    minimum: 175001,
    maximum: 200000,
    withoutCode: 4500,
    withCode: 4600,
  },
];

export const RECLAMATION_TRANSACTIONS_CONDITIONS =
  'Je demande la correction de cette erreur de saisie par une récupération du montant ci-dessus. Je reconnais que OFMS n’a aucune obligation de résultat pour la récupération du montant de la transaction envoyé par erreur notamment si tout ou partie dudit montant n’est plus disponible. Je certifie que mes déclarations ci-dessus sont complètes, authentiques et faites de bonne foi. Je certifie être pleinement conscient que toute déclaration mensongère ou fausse est susceptible de déclencher une mise en œuvre de ma responsabilité civile et pénale devant les juridictions compétentes. Je reste entièrement responsable de tout préjudice direct ou indirect occasionné par mes déclarations effectuées dans le présent formulaire';
export const DEFAULT_ERROR_MSG_CHANGE_PIN_WITH_BIRTH_DATE_VALIDATION =
  'Le code ne doit pas être votre date de naissance.';
export const DEFAULT_ERROR_MSG_CHANGE_PIN_VALIDATION =
  'Le code ne doit pas comporter des chiffres consécutifs. Ex. (1111, 1234, …)';
export const SUCCESS_CHANGE_PIN_MSG =
  'Vous venez de changer votre code secret Orange Money. Ne le communiquez à personne, ce code reste confidentiel.';
export const LIST_DENIED_PIN_OM: string[] = [
  '1111',
  '2222',
  '3333',
  '4444',
  '5555',
  '6666',
  '7777',
  '8888',
  '9999',
  '0000',
  '0123',
  '1234',
  '2345',
  '3456',
  '4567',
  '5678',
  '6789',
  '7890',
];
export const SUCCESS_MSG_OM_ACCOUNT_CREATION =
  `Votre demande d’ouverture de compte
  Orange Money a été enregistré avec succés.
  Vous recevrez une confirmation d’ouverture.`;
