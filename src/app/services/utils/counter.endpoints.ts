import { environment } from "src/environments/environment";

const { OM_SERVICE, SERVER_API_URL } = environment;
export const WOYOFAL_PATH = `${SERVER_API_URL}/${OM_SERVICE}/api/woyofal`;
export const RAPIDO_PATH = `${SERVER_API_URL}/${OM_SERVICE}/api/rapido`;
export const WOYOFAL_RECENTS_COUNTER_ENDPOINT = `${WOYOFAL_PATH}/recents`;
export const FEES_ENDPOINT = `${WOYOFAL_PATH}/fees`;
export const WOYOFAL_PAYMENT_ENDPOINT = `${WOYOFAL_PATH}/payment`; 
export const RAPIDO_PAYMENT_ENDPOINT = `${RAPIDO_PATH}/charge-rapido`; 
