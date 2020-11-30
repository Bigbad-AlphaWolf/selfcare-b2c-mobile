import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SubscriptionModel } from 'src/app/dashboard';
import { BestOfferIlliflexModel } from 'src/app/models/best-offer-illiflex.model';
import { IlliflexModel } from 'src/app/models/illiflex-pass.model';
import { PalierModel } from 'src/app/models/palier.model';
import { environment } from 'src/environments/environment';
import {
  getMaxDataVolumeOrVoiceOfPaliers,
  getMinDataVolumeOrVoiceOfPaliers,
} from 'src/shared';
import { AuthenticationService } from '../authentication-service/authentication.service';
const { CONSO_SERVICE, SERVER_API_URL } = environment;
const paliersEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/pricings`;
const buyIlliflexEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/buy-pass-illiflex`;
const bestOfferEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/prepay-balance/best-offer`;

@Injectable({
  providedIn: 'root',
})
export class IlliflexService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  getIlliflexPaliers(): Observable<PalierModel[]> {
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
            amount: passIlliflex.data * 1024,
            unit: 'KO',
          },
          validity,
          code: 193,
        },
        voiceBucket: {
          balance: {
            amount: passIlliflex.voice * 60,
            unit: 'SECOND',
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

  getBestOffer(param: {
    recipientMsisdn: string;
    amount: number;
    validity: string;
  }): Observable<BestOfferIlliflexModel> {
    return this.authService.getSubscriptionForTiers(param.recipientMsisdn).pipe(
      switchMap((sub: SubscriptionModel) => {
        const validity = this.getValidityName(param.validity);
        return this.http.get(
          `${bestOfferEndpoint}/${param.recipientMsisdn}?codeFormule=${sub.code}&montant=${param.amount}&validity=${validity}&unit=XOF`
        );
      })
    );
  }
}
