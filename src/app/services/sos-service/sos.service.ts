import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SosPayloadModel } from '.';
const { SERVICES_SERVICE, CONSO_SERVICE, SERVER_API_URL } = environment;
const SubscribeSOSEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/emergency-credit`;
const SosListEndPoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/sos-by-formule`;

@Injectable({
  providedIn: 'root'
})
export class SosService {
  constructor(private http: HttpClient) {}

  getListSosByFormule(codeFormule: string) {
    return this.http.get(`${SosListEndPoint}/${codeFormule}`);
  }

  subscribeToSos(sosPayload: SosPayloadModel) {
    return this.http.post(SubscribeSOSEndpoint, sosPayload);
  }
}
