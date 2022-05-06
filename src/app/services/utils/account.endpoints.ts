import { environment } from 'src/environments/environment';

const { ACCOUNT_MNGT_SERVICE, SERVER_API_URL } = environment;
export const ACCOUNT_PATH = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api`;
export const ACCOUNT_REQUESTS_ENDPOINT = `${ACCOUNT_PATH}/abonne/requests`;
export const ACCOUNT_REQUESTS_STATUS_ENDPOINT = `${ACCOUNT_PATH}/abonne/request`;
export const ACCOUNT_RATTACH_NUMBER_BY_ID_CARD_STATUS_ENDPOINT = `${ACCOUNT_PATH}/v2/rattachement-lignes/register/by-cni`;
export const ACCOUNT_IDENTIFIED_NUMBERS_ENDPOINT = `${ACCOUNT_PATH}/abonne/v1/contact-numbers`;
export const ACCOUNT_FIX_POSTPAID_INFOS_ENDPOINT = `${ACCOUNT_PATH}/abonne/v1/number`;
export const CHECK_NUMBER_IS_CORPORATE_ENDPOINT = `${ACCOUNT_PATH}/abonne/v1/is-coorporate-number`;
