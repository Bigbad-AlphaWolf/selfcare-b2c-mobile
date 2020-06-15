import {
  OPERATION_TYPE_SEDDO_CREDIT,
  OPERATION_TYPE_SEDDO_BONUS,
  OPERATION_TYPE_MERCHANT_PAYMENT,
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TRANSFER_OM,
  OPERATION_TRANSFER_OM_WITH_CODE,
  BONS_PLANS,
} from "src/shared";
import { PageTitle } from "../models/page-title.model";
import { OPERATION_WOYOFAL } from './constants';

export const titles: PageTitle[] = [
  {
    typeOperation: OPERATION_TYPE_SEDDO_CREDIT,
    title: "Transfert de Crédit",
  },
  {
    typeOperation: OPERATION_TYPE_SEDDO_BONUS,
    title: "Transfert de Bonus",
  },
  {
    typeOperation: OPERATION_TYPE_MERCHANT_PAYMENT,
    title: "Paiement marchand",
  },
  {
    typeOperation: OPERATION_TYPE_RECHARGE_CREDIT,
    title: "Achat de crédit",
    subTtile: "Montant à recharger",
  },
  {
    typeOperation: OPERATION_TRANSFER_OM_WITH_CODE,
    title: "Transfert d'argent",
  },

  {
    typeOperation: OPERATION_WOYOFAL,
    title: 'Rechargement Woyofal',
  },
  {
    typeOperation: BONS_PLANS,
    title: "Bons plans - Samay Sargal",
  },
];

export function getPageTitle(typeOp: string) {
  return titles.find((pt) => pt.typeOperation === typeOp);
}
