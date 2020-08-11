import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { tap, takeUntil, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RequestOem } from 'src/app/models/request-oem.model';
import { RequestOemService } from 'src/app/services/request-oem/request-oem.service';
import { BaseComponent } from 'src/app/base.component';
import { NavController } from '@ionic/angular';
import { RequestStatusPage } from '../request-status/request-status.page';

@Component({
  selector: 'app-follow-up-requests',
  templateUrl: './follow-up-requests.page.html',
  styleUrls: ['./follow-up-requests.page.scss'],
})
export class FollowUpRequestsPage extends BaseComponent implements OnInit {
  phoneFix: string;
  requests$: Observable<RequestOem[]>;
  isInitRequests: boolean;
  @ViewChild('numberInput') numberInput: ElementRef;
  isConfirm: boolean;
  noRequest: boolean;
  constructor(
    private dashboardService: DashboardService, 
    private requestSrvice: RequestOemService,
    private navCtrl : NavController) {
    super();
  }

  ngOnInit() {
    this.initRequests();
  }

  initRequests() {
    this.isInitRequests = true;
    this.dashboardService.fetchFixedNumbers().pipe(
      tap((numbers) => {
        if (numbers.length) {
          this.phoneFix = numbers[0];
          this.requests$ = this.requestSrvice.fetchRequests(this.phoneFix).pipe(
            delay(1000),
            tap((_) => {
              this.isInitRequests = false;
            })
          );
        }
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

  onConfirmer() {
    this.isConfirm = true;
    let numberSuivi = this.numberInput.nativeElement.value;
    if(!this.numberSuiviIsValid(numberSuivi)){
      this.isConfirm = false;
      return;
    }
    this.requestSrvice.requestStatus(numberSuivi).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((r) => {
      this.isConfirm = false;
      if (!r.length) this.noRequest = true;
      else{
        this.requestSrvice.currentRequestStatusId = numberSuivi;
        this.noRequest = false;
        this.navCtrl.navigateForward([RequestStatusPage.PATH_ROUTE]);
      }
    });
  }

  numberSuiviIsValid(n:string){
    return n.length >6;
  }

}
