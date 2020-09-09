import { environment } from 'src/environments/environment';
const { SERVER_API_URL, CONSO_SERVICE, OM_SERVICE , FILE_SERVICE} = environment;
export const OM_PATH = `${SERVER_API_URL}/${OM_SERVICE}/api`;
export const CONSO_PATH = `${SERVER_API_URL}/${CONSO_SERVICE}/api`;
export const FILE_PATH = `${SERVER_API_URL}/${FILE_SERVICE}`;