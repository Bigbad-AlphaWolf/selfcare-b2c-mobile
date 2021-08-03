import { OPERATION_TRANSFER_OM, OPERATION_TRANSFER_OM_WITH_CODE, OPERATION_TYPE_MERCHANT_PAYMENT } from 'src/shared';
import { BillCompany } from '../models/bill-company.model';
import { OffreService } from '../models/offre-service.model';
import { IMAGES_DIR_PATH } from './constants';
import { OPERATION_RAPIDO, OPERATION_WOYOFAL } from './operations.constants';

export const WOYOFAL = 'WOYOFAL';
export const RAPIDO = 'RAPIDO';
export const SONATEL = 'SONATEL';
export const ORANGE = 'ORANGE';
export const SENELEC = 'SENELEC';
export const SEN_EAU = 'SEN_EAU';

export const BILLS_COMPANIES_DATA: BillCompany[] = [
  {
    name: 'Woyofal',
    code: WOYOFAL,
    logo: `${IMAGES_DIR_PATH}/woyofal@3x.png`,
    idCode: 1121
  },
  {
    name: 'Rapido',
    code: RAPIDO,
    logo: `${IMAGES_DIR_PATH}/rapido@3x.png`,
    idCode: 1122
  },
  {
    name: 'Sonatel',
    code: SONATEL,
    logo: `${IMAGES_DIR_PATH}/sonatel.svg`,
    idCode: 1123
  },
  {
    name: 'Orange',
    code: ORANGE,
    logo: `${IMAGES_DIR_PATH}/orange@3x.png`,
    idCode: 1124
  },
  {
    name: 'Senelec',
    code: SENELEC,
    logo: `${IMAGES_DIR_PATH}/senelec@3x.png`,
    idCode: 1125
  },
  {
    name: "SEN'EAU",
    code: SEN_EAU,
    logo: `${IMAGES_DIR_PATH}/sen-eau@3x.png`,
    idCode: 11256
  }
];

export const WOYOFAL_DEFAULT_FEES: any = [
  {
    montant_min: 1000.0,
    montant_max: 2000.0,
    tarif: 100.0
  },
  {
    montant_min: 2001.0,
    montant_max: 5000.0,
    tarif: 250.0
  },
  {
    montant_min: 5001.0,
    montant_max: 10000.0,
    tarif: 400.0
  },
  {
    montant_min: 10001.0,
    montant_max: 20000.0,
    tarif: 500.0
  },
  {
    montant_min: 20001.0,
    montant_max: 60000.0,
    tarif: 800.0
  },
  {
    montant_min: 60001.0,
    montant_max: 175000.0,
    tarif: 1900.0
  },
  {
    montant_min: 175001.0,
    montant_max: 400000.0,
    tarif: 3900.0
  },
  {
    montant_min: 400001.0,
    montant_max: 2000000.0,
    tarif: 10900.0
  },
  {
    montant_min: 2000001.0,
    montant_max: 999999999999999999999999999999.0,
    tarif: 10900.0
  }
];

export const WOYOFAL_DEFAULT_FEES_INCLUDES: any = [
  {
    montant_min: 1100.0,
    montant_max: 2100.0,
    tarif: 100.0
  },
  {
    montant_min: 2101.0,
    montant_max: 5250.0,
    tarif: 250.0
  },
  {
    montant_min: 5251.0,
    montant_max: 10400.0,
    tarif: 400.0
  },
  {
    montant_min: 10401.0,
    montant_max: 20500.0,
    tarif: 500.0
  },
  {
    montant_min: 20501.0,
    montant_max: 60800.0,
    tarif: 800.0
  },
  {
    montant_min: 60801.0,
    montant_max: 176900.0,
    tarif: 1900.0
  },
  {
    montant_min: 176901.0,
    montant_max: 403900.0,
    tarif: 3900.0
  },
  {
    montant_min: 403901.0,
    montant_max: 20010900.0,
    tarif: 10900.0
  }
];
export const RAPIDO_DEFAULT_FEES: any = [
  {
    montant_min: 1.0,
    montant_max: 2000.0,
    tarif: 100.0
  },
  {
    montant_min: 2001.0,
    montant_max: 5000.0,
    tarif: 250.0
  },
  {
    montant_min: 5001.0,
    montant_max: 10000.0,
    tarif: 400.0
  },
  {
    montant_min: 10001.0,
    montant_max: 20000.0,
    tarif: 500.0
  },
  {
    montant_min: 20001.0,
    montant_max: 60000.0,
    tarif: 800.0
  },
  {
    montant_min: 60001.0,
    montant_max: 175000.0,
    tarif: 1900.0
  },
  {
    montant_min: 175001.0,
    montant_max: 400000.0,
    tarif: 3900.0
  },
  {
    montant_min: 400001.0,
    montant_max: 2000000.0,
    tarif: 10900.0
  },
  {
    montant_min: 2000001.0,
    montant_max: 999999999999999999999999999999.0,
    tarif: 10900.0
  }
];

export const RAPIDO_DEFAULT_FEES_INCLUDES: any = [
  {
    montant_min: 101.0,
    montant_max: 2100.0,
    tarif: 100.0
  },
  {
    montant_min: 2101.0,
    montant_max: 5250.0,
    tarif: 250.0
  },
  {
    montant_min: 5251.0,
    montant_max: 10400.0,
    tarif: 400.0
  },
  {
    montant_min: 10401.0,
    montant_max: 20500.0,
    tarif: 500.0
  },
  {
    montant_min: 20501.0,
    montant_max: 60800.0,
    tarif: 800.0
  },
  {
    montant_min: 60801.0,
    montant_max: 176900.0,
    tarif: 1900.0
  },
  {
    montant_min: 176901.0,
    montant_max: 403900.0,
    tarif: 3900.0
  },
  {
    montant_min: 403901.0,
    montant_max: 20010900.0,
    tarif: 10900.0
  }
];

export const FEES = {
  wofofal: WOYOFAL_DEFAULT_FEES,
  rapido: RAPIDO_DEFAULT_FEES
};
export const FEES_INCLUDES = {
  wofofal: WOYOFAL_DEFAULT_FEES_INCLUDES,
  rapido: RAPIDO_DEFAULT_FEES_INCLUDES
};

export const OM_LABEL_SERVICES = {
  RAPIDO: 'rapido',
  ISM: 'ism',
  SENELEC: 'senelec',
  MALI: 'mali',
  EDUCATION: 'education',
  BISSAU: 'bissau',
  SONATEL_FIXE: 'sonatel_fixe',
  NIGER: 'NIGER',
  PAIEMENT_MARCHAND: 'paiement_marchand',
  OOLU_SOLAR: 'oolu_solar',
  TRANSFERT_SANS_CODE: 'retrait',
  WOYOFAL: 'woyofal',
  OFFRE_TERANGA: 'offre_teranga',
  BURKINA: 'burkina',
  SDE: 'sde',
  BAOBAB: 'baobab',
  TRANSFERT_AVEC_CODE: 'tac',
  OFFRE_ENERGIE: 'offre_energie',
  COTE_D_IVOIRE: 'cod',
  CANAL: 'canal',
  TAF: 'taf'
};

export function mapOffreServiceWithCodeOM(offre: OffreService) {
  if (!offre.codeOM) {
    switch (offre.code) {
      case OPERATION_RAPIDO:
        offre.codeOM = OM_LABEL_SERVICES.RAPIDO;
        return offre;
      case OPERATION_WOYOFAL:
        offre.codeOM = OM_LABEL_SERVICES.WOYOFAL;
        return offre;
      case OPERATION_TRANSFER_OM:
        offre.codeOM = OM_LABEL_SERVICES.TRANSFERT_SANS_CODE;
        return offre;
      case OPERATION_TRANSFER_OM_WITH_CODE:
        offre.codeOM = OM_LABEL_SERVICES.TRANSFERT_AVEC_CODE;
        return offre;
      case OPERATION_TYPE_MERCHANT_PAYMENT:
        offre.codeOM = OM_LABEL_SERVICES.PAIEMENT_MARCHAND;
        return offre;
      default:
        return offre;
    }
  } else {
    return offre;
  }
}
