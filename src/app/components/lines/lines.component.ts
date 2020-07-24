import { Component, OnInit } from '@angular/core';
import { share, map, switchMap } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { ModalController } from '@ionic/angular';
import { SessionOem } from 'src/app/services/session-oem/session-oem.service';
import { REGEX_FIX_NUMBER, SubscriptionModel } from 'src/shared';
import {
  isPostpaidFix,
  isPostpaidMobile,
  ModelOfSouscription,
} from 'src/app/dashboard';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss'],
})
export class LinesComponent implements OnInit {
  phones$: Observable<any[]>;

  isProcessing: boolean;

  phone: string;
  codeClient: String;
  constructor(
    private modalController: ModalController,
    private dashbServ: DashboardService,
    private authServ: AuthenticationService
  ) {}

  ngOnInit() {
    this.isProcessing = true;
    this.phones$ = this.dashbServ.getAttachedNumbers().pipe(
      switchMap((elements: any) => {
        let numbers = [];
        let oemSouscriptions: Observable<any>[] = [];
        oemSouscriptions.push(
          this.authServ.getSubscription(SessionOem.MAIN_PHONE)
        );
        numbers.push(SessionOem.MAIN_PHONE);

        elements.forEach((element: any) => {
          const msisdn = '' + element.msisdn;
          oemSouscriptions.push(this.authServ.getSubscription(msisdn));
          numbers.push(msisdn);
        });
        return forkJoin(oemSouscriptions).pipe(
          map((results: SubscriptionModel[]) => {
            let fNumbers = [];
            results.forEach((sub: SubscriptionModel, i: number) => {
              const sousc: ModelOfSouscription = {
                profil: sub.profil,
                formule: sub.nomOffre,
                codeFormule: sub.code,
              };
              if (this.isLineNumber(numbers[i], sousc))
                fNumbers.push({
                  phone: numbers[i],
                  codeClient: sub.clientCode,
                });
            });
            if (fNumbers.length) this.phone = fNumbers[0];
            this.isProcessing = false;
            return fNumbers;
          })
        );
      }),
      share()
    );
  }

  isLineNumber(phone: string, souscription: ModelOfSouscription) {
    return (
      (REGEX_FIX_NUMBER.test(phone) && isPostpaidFix(souscription)) ||
      (!REGEX_FIX_NUMBER.test(phone) && isPostpaidMobile(souscription))
    );
  }

  async onConfirmer() {
    this.modalController.dismiss(this.phone);
  }

  onOptionChange(value: any) {
    this.phone = value;
  }
}