import { environment } from 'src/environments/environment';

const { OM_SERVICE, SERVER_API_URL } = environment;
export const OM_PATH = `${SERVER_API_URL}/${OM_SERVICE}/api`;
export const OM_BANLANCE_ENDPOINT = `${OM_PATH}/purchases/balance`;
export const OM_FAVORITES_ENDPOINT = `${OM_PATH}/favorites`;
export const COUNTER_RECENT_MERCHANTS_ENDPOINT = `${OM_PATH}/merchant/recents`;
