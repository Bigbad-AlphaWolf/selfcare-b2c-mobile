import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ChangePinModel } from 'src/shared';
const {
  SERVER_API_URL,
  PURCHASES_SERVICE,
  FILE_SERVICE,
  SERVICES_SERVICE,
  ACCOUNT_MNGT_SERVICE,
} = environment;
const codePukEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/puk`;
const codeCarteEndPoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/infos-carte`;
const changeSeddoCodeEndpoint = `${SERVER_API_URL}/${PURCHASES_SERVICE}/api/seddo/change-pin`;
const uploadEndpoint = `${SERVER_API_URL}/${FILE_SERVICE}/api/upload`;
const sendMailEndpoint = `${SERVER_API_URL}/${ACCOUNT_MNGT_SERVICE}/api/v1/mail/ouverture-compte`;

@Injectable({
  providedIn: 'root',
})
export class EmergencyService {
  constructor(private http: HttpClient) {}

  getCodePuk(msisdn: string) {
    const payload = { msisdn };
    return this.http.post(`${codePukEndpoint}`, payload);
  }

  getCodeCarteRecharge(carteInfos: any) {
    return this.http.post(`${codeCarteEndPoint}`, carteInfos, {
      responseType: 'text',
    });
  }

  sendMailCustomerService(infos: FormData) {
    // const HttpUploadOptions = {
    //     headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data; boundary=32A' })
    // };
    return this.http.post(`${sendMailEndpoint}`, infos);
  }

  changePinSeddo(changePinPayload: ChangePinModel) {
    return this.http.post(`${changeSeddoCodeEndpoint}`, changePinPayload);
  }

  uploadFile(formData: any) {
    return this.http.post(`${uploadEndpoint}`, formData, {
      responseType: 'text',
    });
  }
}
