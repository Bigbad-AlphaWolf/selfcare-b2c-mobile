import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { tap, takeUntil, delay, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { RequestOem } from 'src/app/models/request-oem.model';
import { RequestOemService } from 'src/app/services/request-oem/request-oem.service';
import { BaseComponent } from 'src/app/base.component';
import { NavController } from '@ionic/angular';
import { RequestStatusPage } from '../request-status/request-status.page';
import { ReclamationType } from 'src/app/models/enums/reclamation.enum';

@Component({
  selector: 'app-follow-up-requests',
  templateUrl: './follow-up-requests.page.html',
  styleUrls: ['./follow-up-requests.page.scss'],
})
export class FollowUpRequestsPage extends BaseComponent implements OnInit {
  phoneFix: string;
  requests$: Observable<RequestOem[]>;
  isInitRequests: boolean;
  title = "Suivi Demande ou Réclamation" ;
  @ViewChild('numberInput') numberInput: ElementRef;
  isConfirm: boolean;
  noRequest: boolean;
  isNotValid: boolean;
  listRequestWithStatus: { "current" : RequestOem, "previous" : RequestOem[], "next": RequestOem[] } = { "current": null, "previous": [], "next": []} ;
  constructor(
    private dashboardService: DashboardService,
    private requestSrvice: RequestOemService,
    private navCtrl: NavController
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

  initPageTitle(currentRequest: RequestOem) {
    this.title = currentRequest.type === ReclamationType.REQUEST ? 'Suivi Demande N°'+currentRequest.requestId : 'Suivi Dérangement N°'+currentRequest.requestId;
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
          this.requests$ = this.requestSrvice.fetchRequests(this.phoneFix).pipe(
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
              if(this.listRequestWithStatus.current) {
                this.initPageTitle(this.listRequestWithStatus.current);
              }
            },
            catchError((err: any) => {
              this.isInitRequests = false;
              return of(err)
            }))
          );
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  onRequestChoosen(req: RequestOem) {
    this.isInitRequests = true;
    this.requestSrvice
      .requestStatus(req.requestId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((r) => {
        this.isInitRequests = false;
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
          throw err;
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((r) => {
        this.isConfirm = false;
        if (!r.length) this.noRequest = true;
        else {
          this.requestSrvice.currentRequestStatusId = numberSuivi;
          this.noRequest = false;
          this.navCtrl.navigateForward([RequestStatusPage.PATH_ROUTE]);
        }
      });
  }

  numberSuiviIsValid(n: string) {
    return n.length >= 1;
  }
}
