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

export interface ProcessedConsoModel {
  category: string;
  consumations: NewUserConsoModel[];
}

// string util to tell if a counter is type conso acte or not (like 'conso acte voix', 'conso acte data')
export const CONSO_ACTE_REGEX = 'conso acte';
export const CONSO_ACTE_VOIX = 'conso acte voix';
export const CONSO_ACTE_INTERNET = 'conso acte data';
export const CONSO_ACTE_SMS = 'conso acte sms';
export const CONSO_GAUGE_COLORS = ['#50be87', '#a885d8', '#a885d8'];

export function isCounterConsoActe(counter: NewUserConsoModel) {
  return !!counter.name.toLowerCase().match(CONSO_ACTE_REGEX);
}
