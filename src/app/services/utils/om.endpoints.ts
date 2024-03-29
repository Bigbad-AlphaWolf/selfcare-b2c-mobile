import { OM_PATH, SERVICES_PATH } from './services.paths';
import { environment } from 'src/environments/environment';
const { SERVER_API_URL, PURCHASES_SERVICE } = environment;
export const OM_BANLANCE_ENDPOINT = `${OM_PATH}/purchases/balance`;
export const OM_FAVORITES_ENDPOINT = `${OM_PATH}/payment/favoris`;
export const OM_RECENTS_ENDPOINT = `${OM_PATH}/payment/recents`;
export const OM_SAVE_RAPIDO_FAVORITES_ENDPOINT = `${OM_PATH}/rapido/save-carte-rapido`;
// export const OM_SAVE_XEWEUL_FAVORITES_ENDPOINT = `${OM_PATH}/xeweul/cards/{msisdn}`;
export const SEND_REQUEST_ERREUR_TRANSACTION_OM_ENDPOINT = `${SERVICES_PATH}/urgence-depannage/v1/erreur-transaction`;
export const OM_CHANGE_PIN_ENDPOINT = `${OM_PATH}/authentication/change-pin-pad`;
export const OM_BUY_ILLIFLEX_ENDPOINT = `${SERVER_API_URL}/${PURCHASES_SERVICE}/api/illiflex-by-ewallet`;
