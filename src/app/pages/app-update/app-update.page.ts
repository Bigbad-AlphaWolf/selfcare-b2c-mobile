import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Market } from '@ionic-native/market/ngx';
import { NavController } from '@ionic/angular';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { SessionOem } from 'src/app/services/session-oem/session-oem.service';

@Component({
  selector: 'app-app-update',
  templateUrl: './app-update.page.html',
  styleUrls: ['./app-update.page.scss'],
})
export class AppUpdatePage implements OnInit {
  static ROUTE_PATH: string = '/app-update';
  updateMessage: string = `Votre application n'est pas à jour.
  Pour profiter des dernières fonctionnalités, Mettez la à jour.`;
  appId: string = '';
  constructor(
    private market: Market,
    private navCtl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    this.appId = history.state.appId;
  }

  close() {
    SessionOem.updateAbort = true;
    this.router.navigate([DashboardService.CURRENT_DASHBOARD]);
  }

  update() {
    if (this.appId) this.market.open(this.appId);
  }
}
