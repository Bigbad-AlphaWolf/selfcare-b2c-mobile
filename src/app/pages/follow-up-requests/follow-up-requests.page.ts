import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { tap, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RequestOem } from 'src/app/models/request-oem.model';
import { RequestOemService } from 'src/app/services/request-oem/request-oem.service';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-follow-up-requests',
  templateUrl: './follow-up-requests.page.html',
  styleUrls: ['./follow-up-requests.page.scss'],
})
export class FollowUpRequestsPage extends BaseComponent implements OnInit {
  phoneFix : string ;
  requests$ : Observable<RequestOem[]>;
  constructor(private dashboardService : DashboardService, private requestSrvice : RequestOemService) { 
    super();
  }

  ngOnInit() {
    this.initRequests();
  }

  initRequests(){
    this.dashboardService.fetchFixedNumbers().pipe(
      tap((numbers)=>{
        if(numbers.length){
          this.phoneFix = numbers[0];
          this.requests$ = this.requestSrvice.fetchRequests(this.phoneFix);
        } 
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

  onConfirmer(){

  }

}
