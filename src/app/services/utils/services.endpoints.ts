import { environment } from 'src/environments/environment';
const { SERVER_API_URL, CONSO_SERVICE, OM_SERVICE } = environment;
export const OM_PATH = `${SERVER_API_URL}/${OM_SERVICE}/api`;
export const CONSO_PATH = `${SERVER_API_URL}/${CONSO_SERVICE}/api`;
