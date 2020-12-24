import { environment } from 'src/environments/environment';
const { SERVER_API_URL, CONSO_SERVICE, OM_SERVICE , FILE_SERVICE, SERVICES_SERVICE, COMMUNITY_MANAGEMENT_SERVICE} = environment;
export const OM_PATH = `${SERVER_API_URL}/${OM_SERVICE}/api`;
export const CONSO_PATH = `${SERVER_API_URL}/${CONSO_SERVICE}/api`;
export const FILE_PATH = `${SERVER_API_URL}/${FILE_SERVICE}`;
export const SERVICES_PATH = `${SERVER_API_URL}/${SERVICES_SERVICE}/api`;
export const COMMUNITY_MANAGEMENT_PATH = `${SERVER_API_URL}/${COMMUNITY_MANAGEMENT_SERVICE}/api`;