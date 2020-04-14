import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApplicationRoutingService {

  constructor(private route: Router) { }

  goToDashboard(){
    this.route.navigate(['/dashboard'])
  }

  goToSelectRecepientPassInternet(){
    this.route.navigate(['/select-beneficiary-v2'])
  }

  goToListPassInternet(data: any){
    let navigationExtras: NavigationExtras = {
      state: {
        payload: data
      }
    };
    this.route.navigate(['/list-pass-internet-v3'], navigationExtras)

  }

  goToSelectRecepientPassIllimix(){
    this.route.navigate(['/select-pass-recipient'], {queryParams : { action: 'illimix'}})
  }
}
