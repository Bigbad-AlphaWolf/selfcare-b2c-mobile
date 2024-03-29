import { Component, OnInit } from '@angular/core';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { ModalController } from '@ionic/angular';
import { of, Subscription, timer } from 'rxjs';
import { catchError, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MsisdnAssistanceModalComponent } from 'src/app/new-registration/components/msisdn-assistance-modal/msisdn-assistance-modal.component';
import { MSISDN_RECUPERATION_TIMEOUT } from 'src/app/register';
import { AuthenticationService, ConfirmMsisdnModel } from 'src/app/services/authentication-service/authentication.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';

@Component({
  selector: 'app-implicite-authentication-modal',
  templateUrl: './implicite-authentication-modal.component.html',
  styleUrls: ['./implicite-authentication-modal.component.scss'],
})
export class ImpliciteAuthenticationModalComponent implements OnInit {
  gettingNumber: boolean;
  phoneNumber: string;
  showErrMessage: boolean;
  errorGettingNumber: string;
  newtworkSubscription: Subscription;
  selectedNumber: string;
  userAuthImplicitInfos: ConfirmMsisdnModel;
  step: 'INFOS' | 'AUTH_IMPLICIT' = 'INFOS';
  constructor(
    private authServ: AuthenticationService,
    private oemLoggingService: OemLoggingService,
    private network: Network,
    private uid: Uid,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  next() {
    this.step = 'AUTH_IMPLICIT';
    this.getNumber();
  }

  displayMsisdnError() {
    this.gettingNumber = false;
    this.showErrMessage = true;
    this.errorGettingNumber = `La récupération du numéro ne s'est pas bien passée. Cliquez ici pour réessayer`;
    let connexion: string;
    this.newtworkSubscription = this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        connexion = this.network.type;
        this.oemLoggingService.registerEvent(
          'User_msisdn_recuperation_failed',
          convertObjectToLoggingPayload({
            imei: this.uid.IMEI,
            connexion,
          })
        );
      }, 3000);
    });
  }

  async handleGetMsisdnError() {
    const modal = await this.modalController.create({
      component: MsisdnAssistanceModalComponent,
      cssClass: 'select-recipient-modal',
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(response => {
      this.getNumber();
    });
    return await modal.present();
  }

  getNumber() {
    const startTime = Date.now();
    this.gettingNumber = true;
    this.showErrMessage = false;
    this.authServ
      .getMsisdnByNetwork()
      //if after msisdnTimeout milliseconds the call does not complete, stop it.
      .pipe(
        takeUntil(timer(MSISDN_RECUPERATION_TIMEOUT)),
        // finalize to detect whenever call is complete or terminated
        finalize(() => {
          if (!this.selectedNumber) {
            this.displayMsisdnError();
            this.handleGetMsisdnError();
            console.log('http call is not successful');
          }
        }),
        switchMap((res: { msisdn: string }) => {
          this.selectedNumber = res.msisdn;
          return this.authServ.confirmMsisdnByNetwork(res.msisdn).pipe(
            tap(
              (response: ConfirmMsisdnModel) => {
                this.gettingNumber = false;
                if (response && response.status) {
                  response.msisdn = response.msisdn.substring(response.msisdn.length - 9);
                  this.selectedNumber = response.msisdn;
                  const endTime = Date.now();
                  const elapsedSeconds = endTime - startTime;
                  const duration = `${elapsedSeconds} ms`;
                  this.userAuthImplicitInfos = response;
                  this.oemLoggingService.registerEvent(
                    'User_msisdn_recuperation_success',
                    convertObjectToLoggingPayload({
                      msisdn: this.selectedNumber,
                      duration,
                    })
                  );
                } else {
                  this.displayMsisdnError();
                }
              },
              () => {
                this.displayMsisdnError();
              }
            )
          );
        }),
        catchError(() => {
          this.displayMsisdnError();
          return of();
        })
      )
      .subscribe();
  }

  proceed(infosAuthImplicit: ConfirmMsisdnModel) {
    this.modalController.dismiss({
      infosAuthImplicit,
    });
  }
}
