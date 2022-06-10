import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const { SERVER_API_URL, SERVICES_SERVICE } = environment;

const passAbonnementWidoEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/widotv/v1/list`;
const suscriptionWidoEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/widotv/v1/subscribe`;

@Injectable({
  providedIn: 'root',
})
export class PassAbonnnementWidoService {
  constructor(private http: HttpClient) {}

  getListPassAbonnementWido(recipientMsisdn: string) {
    return this.http.get(`${passAbonnementWidoEndpoint}/${recipientMsisdn}`);
  }

  suscribeToWido(data: { msisdn: string; packId: number }) {
    return this.http.post(
      `${suscriptionWidoEndpoint}/${data?.msisdn}?packId=${data.packId}`,
      null
    );
  }
}
