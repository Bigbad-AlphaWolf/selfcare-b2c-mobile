import {
  OPERATION_TYPE_SEDDO_CREDIT,
  OPERATION_TYPE_SEDDO_BONUS,
  OPERATION_TYPE_MERCHANT_PAYMENT,
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TRANSFER_OM,
  OPERATION_TRANSFER_OM_WITH_CODE,
  BONS_PLANS,
  OPERATION_SEE_SOLDE_RAPIDO,
} from 'src/shared';
import { PageHeader } from '../models/page-header.model';
import { OPERATION_RAPIDO, OPERATION_WOYOFAL } from './operations.constants';
import { IMAGES_DIR_PATH } from './constants';

export const titles: PageHeader[] = [
  {
    typeOperation: OPERATION_TYPE_PASS_INTERNET,
    title: 'Achat Pass Internet',
    banniere: `${IMAGES_DIR_PATH}/pass-internet-banniere.png`,
  },
  {
    typeOperation: OPERATION_TYPE_PASS_ILLIMIX,
    title: 'Achat Pass Illimix',
    banniere: `${IMAGES_DIR_PATH}/pass-internet-banniere.png`,
  },
  {
    typeOperation: OPERATION_TYPE_SEDDO_CREDIT,
    title: 'Transfert de Crédit',
  },
  {
    typeOperation: OPERATION_TYPE_SEDDO_BONUS,
    title: 'Transfert de Bonus',
  },
  {
    typeOperation: OPERATION_TYPE_MERCHANT_PAYMENT,
    title: 'Paiement marchand',
    banniere: `${IMAGES_DIR_PATH}/banniere-payment.png`,
  },
  {
    typeOperation: OPERATION_TRANSFER_OM,
    title: 'Transfert d\'argent',
    banniere: `${IMAGES_DIR_PATH}/achat-de-credit.png`,
  },
  {
    typeOperation: OPERATION_TYPE_RECHARGE_CREDIT,
    title: 'Achat de crédit',
    subTtile: 'Montant à recharger',
  },
  {
    typeOperation: OPERATION_TRANSFER_OM_WITH_CODE,
    title: "Transfert d'argent",
  },
  {
    typeOperation: BONS_PLANS,
    title: 'Bons plans - Samay Sargal',
  },

  {
    typeOperation: OPERATION_WOYOFAL,
    title: 'Rechargement Woyofal',
  },
  {
    typeOperation: OPERATION_RAPIDO,
    title: 'Rechargement Rapido',
  },
  {
    typeOperation: BONS_PLANS,
    title: "Bons plans - Samay Sargal",
  },
  {
    typeOperation: OPERATION_SEE_SOLDE_RAPIDO,
    title: "Solde de la carte Rapido",
  },
];

export function getPageHeader(typeOp: string) {
  return titles.find((pt) => pt.typeOperation === typeOp);
}
