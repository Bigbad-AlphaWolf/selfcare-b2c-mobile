import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { OffreService } from '../models/offre-service.model';

@Component({
  selector: 'app-list-pass-usage',
  templateUrl: './list-pass-usage.page.html',
  styleUrls: ['./list-pass-usage.page.scss'],
})
export class ListPassUsagePage implements OnInit {
  serviceUsage: OffreService;

  constructor(private router: Router, private navController: NavController) {}

  ngOnInit() {
    this.getPageParams();
  }

  getPageParams() {
    if (this.router) {
      let state = this.router.getCurrentNavigation().extras.state;
      state = state ? state : history.state;
      console.log(state);
      this.serviceUsage = state.serviceUsage;
    }
  }

  goBack() {
    this.navController.pop();
  }
}
