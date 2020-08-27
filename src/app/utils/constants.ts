import { RecentType } from '../models/enums/om-recent-type.enum';
import {
  OPERATION_TYPE_MERCHANT_PAYMENT,
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TRANSFER_OM,
  OPERATION_TYPE_PASS_ALLO,
} from 'src/shared';

export const IMAGES_DIR_PATH = '/assets/images';
export const MONTHS: string[] = [
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
export const CURENT_PHONE: string = 'CURENT_PHONE';
export const PROFIL: string = 'PROFIL';
export const FORMULE: string = 'FORMULE';
export const CODE_FORMULE: string = 'CODE_FORMULE';
export const CODE_CLIENT: string = 'CODE_CLIENT';
export abstract class Constants {
  public static readonly WITH_MY_PHONES: string = '';
}

export const OM_URLS = ['selfcare-b2c-om'];
export const OM_RECENT_TYPES = [
  {
    operationType: 'OPERATION_WOYOFAL',
    recentType: RecentType.paiement_woyofal,
  },
  {
    operationType: OPERATION_TYPE_MERCHANT_PAYMENT,
    recentType: RecentType.paiement_marchand,
  },
  {
    operationType: OPERATION_TYPE_RECHARGE_CREDIT,
    recentType: RecentType.achat_credit,
  },
  {
    operationType: OPERATION_TYPE_PASS_INTERNET,
    recentType: RecentType.achat_pass_data,
  },
  {
    operationType: OPERATION_TYPE_PASS_ILLIMIX,
    recentType: RecentType.achat_pass_illimix,
  },
  {
    operationType: OPERATION_TYPE_PASS_ALLO,
    recentType: RecentType.achat_pass_illimix,
  },
  {
    operationType: OPERATION_TRANSFER_OM,
    recentType: RecentType.transfert_avec_code,
  },
];
