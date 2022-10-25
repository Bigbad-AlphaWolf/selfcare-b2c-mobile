import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, mergeMap, retryWhen, switchMap, tap } from 'rxjs/operators';
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
const { CONSO_SERVICE, SERVER_API_URL, PURCHASES_SERVICE } = environment;
import { DashboardService } from '../dashboard-service/dashboard.service';
import { FollowAnalyticsService } from '../follow-analytics/follow-analytics.service';
import * as SecureLS from 'secure-ls';
const paliersEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/pricings`;
const buyIlliflexEndpoint = `${SERVER_API_URL}/${PURCHASES_SERVICE}/api/buy-pass-illiflex`;
const bestOfferEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/prepay-balance/best-offer`;
const ls = new SecureLS({ encodingType: 'aes' });
export const ILLIFLEX_SEGMENTS_LS_KEY = 'illiflex_segments';
const ILLIFLEX_CACHE_DURATION_LS_KEY = 'illiflex_cache_date';

@Injectable({
  providedIn: 'root',
})
export class IlliflexService {
  currentMsisdn: string;
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private followAnalyticsService: FollowAnalyticsService,
    private dashboardService: DashboardService
  ) {
    this.currentMsisdn = this.dashboardService.getCurrentPhoneNumber();
  }

  getIlliflexPaliers(): Observable<PalierModel[]> {
    let retries = 3;
    const elapsedTime = Date.now() - ls.get(ILLIFLEX_CACHE_DURATION_LS_KEY);
    // 86.400.000 ms = 86.400 s = 24 * 3600 s = 24 * 60 min = 1 jour // illiflex cache duration
    if (elapsedTime < 86400000 && ls.get(ILLIFLEX_SEGMENTS_LS_KEY)) {
      return of(ls.get(ILLIFLEX_SEGMENTS_LS_KEY));
    }
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
        this.followAnalyticsService.registerEventFollow(
          'illiflex_pricings_success',
          'event',
          { msisdn: this.currentMsisdn }
        );
        ls.set(ILLIFLEX_SEGMENTS_LS_KEY, res)
        ls.set(ILLIFLEX_CACHE_DURATION_LS_KEY, Date.now());
        return res;
      }),
      retryWhen((errors) => {
        return errors.pipe(
          delay(1000),
          mergeMap((error) => {
            if (retries > 0) {
              retries--;
              return of(error);
            }
            if (ls.get(ILLIFLEX_SEGMENTS_LS_KEY)) {
              return of(ls.get(ILLIFLEX_SEGMENTS_LS_KEY));
            }
            return throwError(error);
          })
        );
      }),
      catchError((err) => {
        this.followAnalyticsService.registerEventFollow(
          'illiflex_pricings_failed',
          'error',
          { msisdn: this.currentMsisdn, error: err }
        );
        return throwError(err);
      })
    );
  }

  buyIlliflex(passIlliflex: IlliflexModel) {
    const validity = this.getValidityName(passIlliflex.validity);
    const buyIlliflexPayload = {
      sender: {
        msisdn: passIlliflex.sender,
      },
      receiver: {
        msisdn: passIlliflex.recipient,
        profile: passIlliflex.recipientOfferCode,
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
          usageType: 'DATA',
        },
        voiceBucket: {
          balance: {
            amount: passIlliflex.voice * 60,
            unit: 'SECOND',
          },
          validity,
          usageType: 'VOICE',
        },
        smsBucket: {
          balance: {
            amount: passIlliflex.bonusSms,
            unit: 'SMS',
          },
          validity,
          usageType: 'SMS',
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
        return this.http
          .get(
            `${bestOfferEndpoint}/${param.recipientMsisdn}?codeFormule=${sub.code}&montant=${param.amount}&validity=${validity}&unit=XOF`
          )
          .pipe(
            map((bestOffer: BestOfferIlliflexModel) => {
              // process data volume in Mo as it is received in Ko
              bestOffer.dataBucket.balance.amount =
                bestOffer.dataBucket.balance.amount / 1024;
              // process voice in Min as it is received in second
              bestOffer.voiceBucket.balance.amount =
                bestOffer.voiceBucket.balance.amount / 60;
              this.followAnalyticsService.registerEventFollow(
                'best_offer_success',
                'event',
                { offer: bestOffer, msisdn: param.recipientMsisdn }
              );
              return bestOffer;
            }),
            catchError((err) => {
              this.followAnalyticsService.registerEventFollow(
                'best_offer_failed',
                'error',
                { msisdn: param.recipientMsisdn, error: err.status }
              );
              return throwError(err);
            })
          );
      })
    );
  }
}
