import { environment } from 'src/environments/environment';

const { OM_SERVICE, SERVER_API_URL } = environment;
export const OM_PATH = `${SERVER_API_URL}/${OM_SERVICE}/api`;
export const OM_BANLANCE_ENDPOINT = `${OM_PATH}/purchases/balance`;
export const OM_FAVORITES_ENDPOINT = `${OM_PATH}/payment/favoris`;
export const OM_RECENTS_ENDPOINT = `${OM_PATH}/payment/recents`;
