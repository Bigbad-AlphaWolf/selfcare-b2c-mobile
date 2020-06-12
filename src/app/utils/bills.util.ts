import { BillCompany } from "../models/bill-company.model";
import { IMAGES_DIR_PATH } from "./constants";

export const WOYOFAL = "WOYOFAL";
export const RAPIDO = "RAPIDO";
export const SONATEL = "SONATEL";
export const ORANGE = "ORANGE";
export const SENELEC = "SENELEC";
export const SEN_EAU = "SEN_EAU";

export const BILLS_COMPANIES_DATA: BillCompany[] = [
  { name: "Woyofal", code: WOYOFAL, logo: `${IMAGES_DIR_PATH}/woyofal@3x.png` },
  { name: "Rapido", code: RAPIDO, logo: `${IMAGES_DIR_PATH}/rapido@3x.png` },
  { name: "Sonatel", code: SONATEL, logo: `${IMAGES_DIR_PATH}/sonatel.svg` },
  { name: "Orange", code: ORANGE, logo: `${IMAGES_DIR_PATH}/orange@3x.png` },
  { name: "Senelec", code: SENELEC, logo: `${IMAGES_DIR_PATH}/senelec@3x.png` },
  { name: "SEN'EAU", code: SEN_EAU, logo: `${IMAGES_DIR_PATH}/sen-eau@3x.png` },
];

export const WOYOFAL_DEFAULT_FEES: any = [
    {
        montant_min: 1.0,
        montant_max: 1000.0,
        tarif: 100.0,
      },
  {
    montant_min: 1000.0,
    montant_max: 2000.0,
    tarif: 100.0,
  },
  {
    montant_min: 2001.0,
    montant_max: 5000.0,
    tarif: 250.0,
  },
  {
    montant_min: 5001.0,
    montant_max: 10000.0,
    tarif: 400.0,
  },
  {
    montant_min: 10001.0,
    montant_max: 20000.0,
    tarif: 500.0,
  },
  {
    montant_min: 20001.0,
    montant_max: 60000.0,
    tarif: 800.0,
  },
  {
    montant_min: 60001.0,
    montant_max: 175000.0,
    tarif: 1900.0,
  },
  {
    montant_min: 175001.0,
    montant_max: 400000.0,
    tarif: 3900.0,
  },
  {
    montant_min: 400001.0,
    montant_max: 2000000.0,
    tarif: 10900.0,
  },
  {
    montant_min: 2000001.0,
    montant_max: 999999999999999999999999999999.0,
    tarif: 10900.0,
  },
];
