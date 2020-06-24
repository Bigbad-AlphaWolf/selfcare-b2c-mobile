import { OperationOem } from '../models/operation.model';
import { IMAGES_DIR_PATH } from './constants';
import { OPERATION_TYPE_RECHARGE_CREDIT, OPERATION_TYPE_PASS_INTERNET, OPERATION_TYPE_PASS_ILLIMIX } from 'src/shared';

export const OPERATION_WOYOFAL = 'OPERATION_WOYOFAL';
export const OPERATION_RECHARGE_CREDIT = 'OPERATION_RECHARGE_CREDIT';
export const OPERATION_ACHAT_PASS = 'OPERATION_WOYOFAL';
export const OPERATION_ACHAT_ILLIMIX = 'OPERATION_WOYOFAL';
export const OPERATION_TRANSFERT_ARGENT = 'OPERATION_WOYOFAL';


export const ACTIONS_RAPIDES_OPERATIONS : OperationOem[]=[
    {
        title: 'Transférer',
        subtitle: 'de l\'argent',
        icon: `${IMAGES_DIR_PATH}/icOrangeMoney.png`,
        action: 'showBeneficiaryModal',
        params:[],
        type: OPERATION_TRANSFERT_ARGENT,
        url: '',
      },

      {
        title: 'Acheter',
        subtitle: 'du crédit',
        icon: `${IMAGES_DIR_PATH}/ic-top-up-mobile@2x.png`,
        action: 'openNumberSelectionBottomSheet',
        params:['NONE', OPERATION_TYPE_RECHARGE_CREDIT, '/credit-pass-amount'],
        type: OPERATION_RECHARGE_CREDIT,
        url: '',
      },
      {
        title: 'Acheter',
        subtitle: 'pass internet',
        icon: `${IMAGES_DIR_PATH}/ic-internet-browser@2x.png`,
        action: 'openNumberSelectionBottomSheet',
        params:['NONE', OPERATION_TYPE_PASS_INTERNET],
        type: OPERATION_ACHAT_PASS,
        url: '',
      },
      {
        title: 'Acheter',
        subtitle: 'pass illimix',
        icon: `${IMAGES_DIR_PATH}/ic-package-services@2x.png`,
        action: 'openNumberSelectionBottomSheet',
        params:['NONE', OPERATION_TYPE_PASS_ILLIMIX],
        type: OPERATION_ACHAT_ILLIMIX,
        url: '',
      },
      {
        title: 'Recharger',
        subtitle: 'Woyofal',
        icon: `${IMAGES_DIR_PATH}/woyofal@3x.png`,
        action: 'openBSCounterSelection',
        type:OPERATION_WOYOFAL,
        url: '',
      },
]