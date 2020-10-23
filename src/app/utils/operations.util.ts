import { OperationOem } from '../models/operation.model';
import { IMAGES_DIR_PATH } from './constants';
import {
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_MERCHANT_PAYMENT,
  OPERATION_TYPE_PASS_ALLO,
} from 'src/shared';
import { OPERATION_RAPIDO, OPERATION_RECHARGE_CREDIT, OPERATION_TRANSFERT_ARGENT, OPERATION_WOYOFAL } from './operations.constants';

export const ACTIONS_RAPIDES_OPERATIONS_DASHBOARD: OperationOem[] = [
  {
    title: 'Transférer',
    subtitle: "de l'argent",
    icon: `${IMAGES_DIR_PATH}/icOrangeMoney.png`,
    action: 'showBeneficiaryModal',
    params: [],
    type: OPERATION_TRANSFERT_ARGENT,
    url: '',
  },

  {
    title: 'Acheter',
    subtitle: 'du crédit',
    icon: `${IMAGES_DIR_PATH}/ic-top-up-mobile@2x.png`,
    action: 'openNumberSelectionBottomSheet',
    params: ['NONE', OPERATION_TYPE_RECHARGE_CREDIT, '/credit-pass-amount'],
    type: OPERATION_RECHARGE_CREDIT,
    url: '',
  },
  {
    title: 'Acheter',
    subtitle: 'pass internet',
    icon: `${IMAGES_DIR_PATH}/ic-internet-browser@2x.png`,
    action: 'openNumberSelectionBottomSheet',
    params: ['NONE', OPERATION_TYPE_PASS_INTERNET, '/list-pass'],
    type: OPERATION_TYPE_PASS_INTERNET,
    url: '',
  },
  {
    title: 'Acheter',
    subtitle: 'pass illimix',
    icon: `${IMAGES_DIR_PATH}/ic-package-services@2x.png`,
    action: 'openNumberSelectionBottomSheet',
    params: ['NONE', OPERATION_TYPE_PASS_ILLIMIX, '/list-pass'],
    type: OPERATION_TYPE_PASS_ILLIMIX,
    url: '',
  },
  {
    title: 'Acheter',
    subtitle: 'pass allo',
    icon: `${IMAGES_DIR_PATH}/ic-call-forward@2x.png`,
    action: 'openNumberSelectionBottomSheet',
    params: ['NONE', OPERATION_TYPE_PASS_ALLO, '/list-pass'],
    type: OPERATION_TYPE_PASS_ALLO,
    url: '',
  },
  {
    title: 'Recharger',
    subtitle: 'Woyofal',
    icon: `${IMAGES_DIR_PATH}/woyofal@3x.png`,
    action: 'openModal',
    type: OPERATION_WOYOFAL,
    url: '',
  },
  {
    title: 'Recharger',
    subtitle: 'Rapido',
    icon: `${IMAGES_DIR_PATH}/rapido@3x.png`,
    action: '/rapido-operation',
    type: 'NAVIGATE',
    url: '',
  },

  {
    title: 'Autres',
    subtitle: 'Services',
    icon: `${IMAGES_DIR_PATH}/ic-more-dots@2x.png`,
    action: 'oem-services',
    type: 'NAVIGATE',
    url: '',
  },
];

export const ACTIONS_RAPIDES_OPERATIONS_POSTPAID: OperationOem[] = [
  ...ACTIONS_RAPIDES_OPERATIONS_DASHBOARD.slice(0, ACTIONS_RAPIDES_OPERATIONS_DASHBOARD.length - 1),
  {
    title: 'Payer',
    subtitle: 'un marchand',
    icon: `${IMAGES_DIR_PATH}/ic-scan-ticket.svg`,
    action: 'openModal',
    type: OPERATION_TYPE_MERCHANT_PAYMENT,
    url: '',
  },

  {
    title: 'Convertir',
    subtitle: 'Points Sargal',
    icon: `${IMAGES_DIR_PATH}/ic-reward.svg`,
    action: '/sargal-dashboard',
    params: [],
    type: 'NAVIGATE',
    url: '',
  },
  {
    title: 'Factures',
    subtitle: 'Historique',
    icon: `${IMAGES_DIR_PATH}/group-39.svg`,
    action: '/bills',
    params: [],
    type: 'NAVIGATE',
    url: '',
  },
];
