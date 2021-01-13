import { GiftType } from './enums/gift-type.enum';

export interface BoosterModel {
  id?: number;
  pricePlanIndexes?: string[];
  formules?: any[];
  gift?: Gift;
  boosterMsisdns?: { msisdn: string }[];
  boosterTrigger: BoosterTrigger;
}

export interface Gift {
  name?: string;
  description?: string;
  value?: number;
  compteur?: number;
  valueType?: ValueType;
  type?: GiftType;
  partner?: { name?: string; code?: string; icone?: string };
}

export enum ValueType {
  PERCENTAGE = 'PERCENTAGE',
  AMONT = 'AMONT',
}

export enum BoosterTrigger {
  PASS_INTERNET = 'PASS_INTERNET',
  PASS_ILLIMIX = 'PASS_ILLIMIX',
  RECHARGE = 'RECHARGE',
  TOUS = 'TOUS',
  FORM_INSCRIPTION = 'FORM_INSCRIPTION',
  FORM_SATISFACTION = 'FORM_SATISFACTION',
}
