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
    // const navigationExtras: NavigationExtras = {
    //   state: {
    //     user: {test: 'data'}
    //   }
    // };
    // this.route.navigate(['/select-pass-recipient'], navigationExtras)
    this.route.navigate(['/buy-pass-internet']);

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
