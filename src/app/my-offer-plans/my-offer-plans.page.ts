import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-offer-plans',
  templateUrl: './my-offer-plans.page.html',
  styleUrls: ['./my-offer-plans.page.scss'],
})
export class MyOfferPlansPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/dashboard'])
  }
}
