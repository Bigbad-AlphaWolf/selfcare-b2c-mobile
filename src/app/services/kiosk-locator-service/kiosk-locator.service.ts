import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import { KioskOMModel } from "src/app/models/kiosk-om.model";
import { environment } from "src/environments/environment";
import { kioskMock } from "./kiosk.utils";
// const { SERVER_API_URL } = environment;
const SERVER_API_URL = "http://10.96.16.116:8718";
const kiosksEndpoint = `${SERVER_API_URL}/api/kiosque-coordonate`;
const kiosksKeyWorEndpoint = `${SERVER_API_URL}/api/kiosque-coordonate`;

@Injectable({
  providedIn: "root",
})
export class KioskLocatorService {
  constructor(private http: HttpClient) {}

  getKiosks(params: {
    size?: number;
    page?: number;
    keyword?: string;
    latitude: number;
    longitude: number;
  }) {
    const endpoint = params.keyword ? kiosksKeyWorEndpoint : kiosksEndpoint;
    let queryParams = "?";
    for (let param in params) {
      queryParams += `${param}=${params[param]}&`;
    }
    // return this.http.get<KioskOMModel[]>(`${endpoint}/${queryParams}`);
    return of(kioskMock).pipe(delay(2000));
  }

  // calculate in km the distance between two points (a vol d'oiseau)
  getDistanceBetweenPoints(start, end) {
    const earthRadius = 6371; // earth radius in km
    const lat1 = start.lat;
    const lon1 = start.lng;
    const lat2 = end.lat;
    const lon2 = end.lng;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = earthRadius * c;
    console.log(d);

    return d;
  }

  // convert angle from degre to radian
  toRad(x) {
    return (x * Math.PI) / 180;
  }
}
