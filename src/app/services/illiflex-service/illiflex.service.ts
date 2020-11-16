import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PalierModel } from 'src/app/models/palier.model';
import { environment } from 'src/environments/environment';
import {
  getMaxDataVolumeOrVoiceOfPaliers,
  getMinDataVolumeOrVoiceOfPaliers,
} from 'src/shared';
const { CONSO_SERVICE, SERVER_API_URL } = environment;
const paliersEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/pricings`;

@Injectable({
  providedIn: 'root',
})
export class IlliflexService {
  constructor(private http: HttpClient) {}

  getIlliflexPaliers() {
    return this.http.get(`${paliersEndpoint}`).pipe(
      map((res: PalierModel[]) => {
        res.map((palier) => {
          palier.maxDataVolume = getMaxDataVolumeOrVoiceOfPaliers(
            [palier],
            'data'
          );
          palier.minDataVolume = getMinDataVolumeOrVoiceOfPaliers(
            [palier],
            'data'
          );
          palier.maxVoice = getMaxDataVolumeOrVoiceOfPaliers([palier], 'voice');
          palier.minVoice = getMinDataVolumeOrVoiceOfPaliers([palier], 'voice');
          return palier;
        });
        res = res.sort(
          (palier1, palier2) => palier1.maxPalier - palier2.maxPalier
        );
        return res;
      })
    );
  }
}
