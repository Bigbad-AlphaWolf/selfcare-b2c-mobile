export interface NewUserConsoModel {
  codeCompteur?: number | string;
  name?: string;
  montantRestant?: string;
  montantRestantBrut?: number;
  ordre?: number;
  dateEffet?: string;
  montantConsomme?: string;
  montantConsommeBrut?: number;
  unite?: string;
  dateExpiration?: string;
  inactif?: boolean;
  typeCompteur?: string;
  montantTotal?: string;
  montantTotalBrut?: number;
  hasGauge?: boolean;
  gaugeColor?: string;
}

export interface InternetConsoModel {
  charge1: string | number;
  chargeType: string;
  duration: string;
  durationInSeconds: number;
  endDate: string;
  internetHistoryDetail: { rawDataConsumed: number; dataConsumed: any };
  startDate: string;
  date: string;
  type: string;
}

export interface ProcessedConsoModel {
  category: string;
  consumations: NewUserConsoModel[];
}

// string util to tell if a counter is type conso acte or not (like 'conso acte voix', 'conso acte data')
export const CONSO_ACTE_REGEX = 'conso acte';
export const CONSO_ACTE_VOIX = 'conso acte voix';
export const CONSO_ACTE_INTERNET = 'conso acte data';
export const CONSO_ACTE_SMS = 'conso acte sms';
export const FORFAIT_INTERNET = 'forfait internet';
export const FORFAIT_MOBILE = 'forfait mobile';
export const BONUS_DATA = 'bonus data';
export const BONUS_SMS = 'bonus sms';
export const BONUS_VOIX = 'bonus voix';
export const FORFAIT_BONUS_VOIX = 'forfait bonus voix';
export const FORFAIT_BONUS_DATA = 'forfait bonus data';
export const FORFAIT_BONUS_SMS = 'forfait bonus sms';

export const SOLDE_RESTANT_INTERNET = 'Solde internet';
export const SOLDE_RESTANT_VOIX = 'Solde appel';
export const CONSO_APPEL = 'Conso Appel';
export const CONSO_INTERNET = 'Conso Internet';
export const CONSO_SMS = 'Conso Sms';
export const BONUS_APPEL = 'Bonus Appel';
export const BONUS_INTERNET = 'Bonus Internet';

export const CONSO_GAUGE_COLORS = ['#50be87', '#a885d8', '#a885d8'];
export const CONSO_POSTPAID_DASHBOARD_ITEMS_LIMIT = 3;

export function isCounterConsoActe(counter: NewUserConsoModel) {
  return !!counter.name.toLowerCase().match(CONSO_ACTE_REGEX);
}
