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
  OPERATION_SEE_FOLLOW_UP_REQUESTS,
  OPERATION_SEE_RATTACHED_NUMBERS,
  OPERATION_RECLAMATION_ERREUR_TRANSACTION_OM,
  OPERATION_CHANGE_PIN_OM,
  OPERATION_CREATE_PIN_OM,
  OPERATION_UNBLOCK_OM_ACCOUNT,
  OPERATION_RESET_PIN_OM, OPERATION_SEE_SOLDE_XEWEUL, OPERATION_ABONNEMENT_WIDO
} from 'src/shared';
import {PageHeader} from '../models/page-header.model';
import {OPERATION_RAPIDO, OPERATION_WOYOFAL, OPERATION_XEWEUL} from './operations.constants';
import {IMAGES_DIR_PATH} from './constants';
import { OffreService } from '../models/offre-service.model';

export const titles: PageHeader[] = [
  {
    typeOperation: OPERATION_TYPE_PASS_INTERNET,
    title: 'Achat Pass Internet',
    banniere: `${IMAGES_DIR_PATH}/pass-internet-banniere.png`
  },
  {
    typeOperation: OPERATION_TYPE_PASS_ILLIMIX,
    title: 'Achat Pass Illimix',
    banniere: `${IMAGES_DIR_PATH}/pass-internet-banniere.png`
  },
  {
    typeOperation: OPERATION_TYPE_SEDDO_CREDIT,
    title: 'Transfert de Crédit'
  },
  {
    typeOperation: OPERATION_TYPE_SEDDO_BONUS,
    title: 'Transfert de Bonus'
  },
  {
    typeOperation: OPERATION_TYPE_MERCHANT_PAYMENT,
    title: 'Paiement marchand',
    banniere: `${IMAGES_DIR_PATH}/banniere-payment.png`
  },
  {
    typeOperation: OPERATION_TRANSFER_OM,
    title: "Transfert d'argent",
    banniere: `${IMAGES_DIR_PATH}/achat-de-credit.png`
  },
  {
    typeOperation: OPERATION_TYPE_RECHARGE_CREDIT,
    title: 'Achat de crédit',
    subTtile: 'Montant à recharger'
  },
  {
    typeOperation: OPERATION_TRANSFER_OM_WITH_CODE,
    title: "Transfert d'argent"
  },
  {
    typeOperation: BONS_PLANS,
    title: 'Bons plans - Samay Sargal'
  },

  {
    typeOperation: OPERATION_WOYOFAL,
    title: 'Rechargement Woyofal'
  },
  {
    typeOperation: OPERATION_RAPIDO,
    title: 'Rechargement Rapido'
  },
  {
    typeOperation: OPERATION_XEWEUL,
    title: 'Rechargement Xeweul'
  },
  {
    typeOperation: BONS_PLANS,
    title: 'Bons plans - Samay Sargal'
  },
  {
    typeOperation: OPERATION_SEE_SOLDE_RAPIDO,
    title: 'Solde de la carte Rapido'
  },
  {
    typeOperation: OPERATION_SEE_SOLDE_XEWEUL,
    title: 'Solde de la carte Xeweul'
  },
  {
    typeOperation: OPERATION_SEE_FOLLOW_UP_REQUESTS,
    title: 'Suivi Demande ou Réclamation'
  },
  {
    typeOperation: OPERATION_SEE_RATTACHED_NUMBERS,
    title: 'Mes lignes'
  },
  {
    typeOperation: OPERATION_RECLAMATION_ERREUR_TRANSACTION_OM,
    title: 'Déclarer une erreur de transaction'
  },
  {
    typeOperation: OPERATION_CHANGE_PIN_OM,
    title: 'Changer code secret Orange Money',
    subTtile: 'Le nouveau code secret doit être différent de votre date de naissance et les chiffres consécutifs ne sont pas autorisés'
  },
  {
    typeOperation: OPERATION_CREATE_PIN_OM,
    title: 'Crééer votre code secret Orange Money',
    subTtile: 'Le code secret doit être différent de votre date de naissance et les chiffres consécutifs ne sont pas autorisés'
  },
  {
    typeOperation: OPERATION_UNBLOCK_OM_ACCOUNT,
    title: 'Débloquer mon compte	OM',
    subTtile: 'Débloquer mon compte	Orange Money'
  },
  {
    typeOperation: OPERATION_RESET_PIN_OM,
    title: 'Réinitialiser mon code pin	OM',
    subTtile: 'Réinitialiser mon code pin	OM'
  },
  {
    typeOperation: OPERATION_ABONNEMENT_WIDO,
    title: 'Abonnement WIDO',
    subTtile: 'Souscription Abonnement WIDO'
  }
];

export function getPageHeader(typeOp: string, offService?: OffreService) {
	if(offService.passUsage && typeOp !== OPERATION_ABONNEMENT_WIDO) {
		return { typeOperation: offService.code, title: `Achat de Pass ${offService.fullDescription}` }
	}
  return titles.find(pt => pt.typeOperation === typeOp);
}
