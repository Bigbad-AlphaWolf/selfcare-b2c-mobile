import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BuyIlliflexModel } from 'src/app/models/buy-illiflex.model';
import { IlliflexModel } from 'src/app/models/illiflex-pass.model';
import { PalierModel } from 'src/app/models/palier.model';
import { environment } from 'src/environments/environment';
import {
  getMaxDataVolumeOrVoiceOfPaliers,
  getMinDataVolumeOrVoiceOfPaliers,
} from 'src/shared';
const { CONSO_SERVICE, SERVER_API_URL } = environment;
const paliersEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/pricings`;
const buyIlliflexEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/buy-pass-illiflex`;

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

  buyIlliflex(passIlliflex: IlliflexModel) {
    const validity = this.getValidityName(passIlliflex.validity);
    const buyIlliflexPayload = {
      sender: {
        msisdn: passIlliflex.recipient,
      },
      receiver: {
        msisdn: passIlliflex.recipient,
      },
      bucket: {
        budget: {
          unit: 'XOF',
          value: passIlliflex.amount,
        },
        dataBucket: {
          balance: {
            amount: passIlliflex.data,
            unit: 'MO',
          },
          validity,
          code: 193,
        },
        voiceBucket: {
          balance: {
            amount: passIlliflex.voice,
            unit: 'MN',
          },
          validity,
          code: 192,
        },
      },
    };
    return this.http.post(buyIlliflexEndpoint, buyIlliflexPayload);
  }

  getValidityName(validity) {
    switch (validity) {
      case 'Jour':
        return 'DAY';
      case 'Semaine':
        return 'WEEK';
      case 'Mois':
        return 'MONTH';
      default:
        return;
    }
  }
}
