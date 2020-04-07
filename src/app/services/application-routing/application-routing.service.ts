import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApplicationRoutingService {

  constructor(private route: Router) { }

  goToDashboard(){
    this.route.navigate(['/dashboard'])
  }

  goToSelectRecepientPassInternet(){
    this.route.navigate(['/select-pass-recipient'], {queryParams : { action: 'internet'}})
  }

  goToSelectRecepientPassIllimix(){
    this.route.navigate(['/select-pass-recipient'], {queryParams : { action: 'illimix'}})
  }
}
