import { environment } from "src/environments/environment";

const { OM_SERVICE, SERVER_API_URL } = environment;

export const OM_BANLANCE_ENDPOINT = `${SERVER_API_URL}/${OM_SERVICE}/api/purchases/balance`;
export const OM_RECENTS_COUNTER_ENDPOINT = `${SERVER_API_URL}/${OM_SERVICE}/api/recents`;
