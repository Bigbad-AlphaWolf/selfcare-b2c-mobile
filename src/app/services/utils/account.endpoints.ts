import { environment } from 'src/environments/environment';

const { ACCOUNT_MNGT_SERVICE, SERVER_API_URL } = environment;
export const ACCOUNT_PATH = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api`;
export const ACCOUNT_REQUESTS_ENDPOINT = `${ACCOUNT_PATH}/abonne/requests`;
export const ACCOUNT_REQUESTS_STATUS_ENDPOINT = `${ACCOUNT_PATH}/abonne/request`;
