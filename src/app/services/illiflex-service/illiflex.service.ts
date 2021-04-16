import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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
const paliersEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/pricings`;
const buyIlliflexEndpoint = `${SERVER_API_URL}/${PURCHASES_SERVICE}/api/buy-pass-illiflex`;
const bestOfferEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/prepay-balance/best-offer`;

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
        return res;
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
    return this.http.post(buyIlliflexEndpoint, buyIlliflexPayload).pipe(
      map((res) => {
        this.followAnalyticsService.registerEventFollow(
          'buy_pass_illiflex_by_credit_success',
          'event',
          buyIlliflexPayload
        );
      }),
      catchError((err) => {
        this.followAnalyticsService.registerEventFollow(
          'buy_pass_illiflex_by_credit_failed',
          'error',
          { payload: buyIlliflexPayload, error: err.status }
        );
        return throwError(err);
      })
    );
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
