import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-follow-up-requests',
  templateUrl: './follow-up-requests.page.html',
  styleUrls: ['./follow-up-requests.page.scss'],
})
export class FollowUpRequestsPage implements OnInit {
  phoneFix : string ;
  constructor(private dashboardService : DashboardService) { }

  ngOnInit() {

  }

  initRequests(){
    this.dashboardService.fetchFixedNumbers().pipe(
      tap((numbers)=>{
        if(numbers.length) this.phoneFix = numbers[0];
      })
    )
  }

  onConfirmer(){
    
  }

}
