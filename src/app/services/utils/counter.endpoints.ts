import { environment } from "src/environments/environment";

const { OM_SERVICE, SERVER_API_URL } = environment;
export const COUNTER_PATH = `${SERVER_API_URL}/${OM_SERVICE}/api/woyofal`;
export const COUNTER_RECENTS_COUNTER_ENDPOINT = `${COUNTER_PATH}/recents`;
export const COUNTER_FEES_ENDPOINT = `${COUNTER_PATH}/fees`;
export const COUNTER_PAYMENT_ENDPOINT = `${COUNTER_PATH}/payment`; 
