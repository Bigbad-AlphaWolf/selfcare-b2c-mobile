import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { tap, takeUntil, delay, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { RequestOem } from 'src/app/models/request-oem.model';
import { RequestOemService } from 'src/app/services/request-oem/request-oem.service';
import { BaseComponent } from 'src/app/base.component';
import { NavController, ModalController } from '@ionic/angular';
import { RequestStatusPage } from '../request-status/request-status.page';
import { ReclamationType } from 'src/app/models/enums/reclamation.enum';
import { LinesComponent } from 'src/app/components/lines/lines.component';
import { OPERATION_SEE_FOLLOW_UP_REQUESTS } from 'src/shared';
import { getPageHeader } from 'src/app/utils/title.util';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';

@Component({
  selector: 'app-follow-up-requests',
  templateUrl: './follow-up-requests.page.html',
  styleUrls: ['./follow-up-requests.page.scss'],
})
export class FollowUpRequestsPage extends BaseComponent implements OnInit {
  phoneFix: string;
  requests$: Observable<RequestOem[]>;
  isInitRequests: boolean;
  header = getPageHeader(OPERATION_SEE_FOLLOW_UP_REQUESTS) ;
  @ViewChild('numberInput', { static: true }) numberInput: ElementRef;
  isConfirm: boolean;
  noRequest: boolean;
  isNotValid: boolean;
  listRequestWithStatus: { "current" : RequestOem, "previous" : RequestOem[], "next": RequestOem[] } = { "current": null, "previous": [], "next": []} ;
  login = this.dashboardService.getMainPhoneNumber();
  constructor(
    private dashboardService: DashboardService,
    private requestSrvice: RequestOemService,
    private navCtrl: NavController,
    private modalController: ModalController,
    private followServ: FollowAnalyticsService
  ) {
    super();
  }

  ngOnInit() {
    this.initRequests();
  }

  ionViewWillEnter() {
    this.noRequest = false;
    this.isNotValid = false;
  }

  initRequests() {
    this.isInitRequests = true;
    this.dashboardService
      .fetchFixedNumbers()
      .pipe(
        tap((numbers) => {
          // numbers = ['338239614'];
          if (!numbers.length) {
            this.isInitRequests = false;
            return;
          }
          this.phoneFix = numbers[0];
          this.requests$ = this.fetchNumberlistRequest(this.phoneFix);
        }),
        catchError((err: any) => {
          this.isInitRequests = false;
          return err;
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  fetchNumberlistRequest(fixnumber: string) {
    return this.requestSrvice.fetchRequests(fixnumber).pipe(
      delay(100),
      tap((res: RequestOem[]) => {
        this.isInitRequests = false;
        this.listRequestWithStatus.current = res.find((el: RequestOem) => {
          return el.currentState
        });

        this.listRequestWithStatus.previous = res.filter((elt: RequestOem) => {
          return elt.order < this.listRequestWithStatus.current.order;
        });

        this.listRequestWithStatus.next = res.filter((elt: RequestOem) => {
          return elt.order > this.listRequestWithStatus.current.order;
        });

        const eventName = `success_recup_suivi_demande_fixe_par_numero`;
        const infosFollow = { login: this.login, numeroFixe: fixnumber }
        this.followServ.registerEventFollow(
          eventName,
          'event',
          infosFollow
        );

      }),catchError((err: any) => {
        this.isInitRequests = false;
        const eventName = `failed_recup_suivi_demande_fixe_par_numero`;
        const infosFollow = { login: this.login, numeroFixe: fixnumber, error: err.error.status };
        this.followServ.registerEventFollow(
          eventName,
          'error',
          infosFollow
        );
        return of(err);
      })
    )
  }

  onRequestChoosen(req: RequestOem) {
    this.isInitRequests = true;
    this.requestSrvice
      .requestStatus(req.requestId)
      .pipe(takeUntil(this.ngUnsubscribe),
      catchError((err: any) => {
        const eventName = `failed_recup_suivi_demande_fixe_par_numero_suivi`;
        const infosFollow = { login: this.login, numeroSuivi: req.requestId, error: err.error.status };
        this.followServ.registerEventFollow(
          eventName,
          'error',
          infosFollow
        );

        return of(err)
      }))
      .subscribe((r) => {
        this.isInitRequests = false;
        const eventName = `success_recup_suivi_demande_fixe_par_numero_suivi`;
        const infosFollow = { login: this.login, numeroSuivi: req.requestId };
        this.followServ.registerEventFollow(
          eventName,
          'event',
          infosFollow
        );
        this.requestSrvice.currentRequestStatusId = req.requestId;
        if (r.length)
          this.navCtrl.navigateForward([RequestStatusPage.PATH_ROUTE]);
      });
  }

  onConfirmer() {
    this.isConfirm = true;
    this.noRequest = false;
    this.isNotValid = false;
    let numberSuivi = this.numberInput.nativeElement.value;
    if (!this.numberSuiviIsValid(numberSuivi)) {
      this.isConfirm = false;
      this.isNotValid = true;
      return;
    }
    this.requestSrvice
      .requestStatus(numberSuivi)
      .pipe(
        catchError((err) => {
          this.isConfirm = false;
          const eventName = `failed_recup_suivi_demande_fixe_par_numero_suivi`;
          const infosFollow = { login: this.login, numeroSuivi: numberSuivi, error: err.error.status };
          this.followServ.registerEventFollow(
            eventName,
            'error',
            infosFollow
          );
          throw err;
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((r) => {

        const eventName = `success_recup_suivi_demande_fixe_par_numero_suivi`;
        const infosFollow = { login: this.login, numeroSuivi: numberSuivi };
        this.followServ.registerEventFollow(
          eventName,
          'event',
          infosFollow
        );

        this.isConfirm = false;
        if (!r.length) this.noRequest = true;
        else {

          // this.followServ.registerEventFollow()
          this.requestSrvice.currentRequestStatusId = numberSuivi;
          this.noRequest = false;
          this.navCtrl.navigateForward([RequestStatusPage.PATH_ROUTE]);
        }
      });
  }
  async openLinesModal() {
    const modal = await this.modalController.create({
      component: LinesComponent,
      componentProps: {
        phone: this.phoneFix,
        phoneType: 'FIXE'
      },
      cssClass: 'select-recipient-modal',
    });
    modal.onDidDismiss().then((response) => {
      if (response && response.data) {
        this.phoneFix = response.data.phone;
        this.requests$ = this.fetchNumberlistRequest(this.phoneFix)
      }
    });
    return await modal.present();
  }

  numberSuiviIsValid(n: string) {
    return n.length >= 1;
  }
}
