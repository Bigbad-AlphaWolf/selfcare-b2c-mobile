import { environment } from "src/environments/environment";
import { OM_PATH } from "./services.paths";

const { OM_SERVICE, SERVER_API_URL , LOCAL_OM} = environment;
export const WOYOFAL_PATH = `${SERVER_API_URL}/${OM_SERVICE}/api/woyofal`;
export const RAPIDO_PATH = `${SERVER_API_URL}/${OM_SERVICE}/api/rapido`;
export const WOYOFAL_RECENTS_COUNTER_ENDPOINT = `${WOYOFAL_PATH}/recents`;
export const FEES_ENDPOINT = `${OM_PATH}/v1/fees`;
export const WOYOFAL_PAYMENT_ENDPOINT = `${WOYOFAL_PATH}/payment`;
export const RAPIDO_PAYMENT_ENDPOINT = `${RAPIDO_PATH}/charge-rapido`;
export const RAPIDO_SOLDE_ENDPOINT = `${RAPIDO_PATH}/balance-rapido`;
export const XEWEUL_PATH = `${SERVER_API_URL}/${OM_SERVICE}/api/xeweul`;
export const XEWEUL_PATH_LOCAL = `${LOCAL_OM}/api/xeweul`;
export const XEWEUL_SOLDE_ENDPOINT = `${XEWEUL_PATH_LOCAL}/cards/${'msisdn'}/balance`;
export const XEWEUL_SAVE_CARD_ENDPOINT = `${XEWEUL_PATH_LOCAL}/cards`;
export const XEWEUL_PAYMENT_ENDPOINT = `${XEWEUL_PATH_LOCAL}/cards`;
