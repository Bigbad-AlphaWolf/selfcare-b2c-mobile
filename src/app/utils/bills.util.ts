import { BillCompany } from '../models/bill-company.model';
import { IMAGES_DIR_PATH } from './constants';

export const WOYOFAL = 'WOYOFAL';
export const RAPIDO = 'RAPIDO';
export const SONATEL = 'SONATEL';
export const ORANGE = 'ORANGE';
export const SENELEC = 'SENELEC';
export const SEN_EAU = 'SEN_EAU';

export const BILLS_COMPANIES_DATA : BillCompany[] = [
    {name:'Woyofal', code:WOYOFAL,logo: `${IMAGES_DIR_PATH}/woyofal.png`},
    {name:'Rapido', code:RAPIDO,logo: `${IMAGES_DIR_PATH}/rapido.png`},
    {name:'Sonatel', code:SONATEL,logo: `${IMAGES_DIR_PATH}/sonatel.svg`},
    {name:'Orange', code:ORANGE,logo: `${IMAGES_DIR_PATH}/orange.png`},
    {name:'Senelec', code:SENELEC,logo: `${IMAGES_DIR_PATH}/senelec.png`},
    {name:'SEN\'EAU', code:SEN_EAU,logo: `${IMAGES_DIR_PATH}/sen-eau.png`},
]