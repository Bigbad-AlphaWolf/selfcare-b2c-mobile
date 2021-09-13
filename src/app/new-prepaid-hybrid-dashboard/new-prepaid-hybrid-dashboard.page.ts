import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-prepaid-hybrid-dashboard',
  templateUrl: './new-prepaid-hybrid-dashboard.page.html',
  styleUrls: ['./new-prepaid-hybrid-dashboard.page.scss'],
})
export class NewPrepaidHybridDashboardPage implements OnInit {
  tabs = [
    {
      defaultIcon: 'home-outline',
      activeIcon: 'home',
      label: 'Accueil',
      route: 'dashboard-home',
    },
    {
      defaultIcon: 'pie-chart-outline',
      activeIcon: 'pie-chart',
      label: 'Conso',
      route: 'suivi-conso',
    },
    {
      defaultIcon: 'bag-outline',
      activeIcon: 'bag',
      label: 'Services',
      route: 'my-services',
    },
    {
      defaultIcon: 'help-buoy-outline',
      activeIcon: 'help-buoy',
      label: 'Assistance',
      route: 'assistance',
    },
  ];
  activeRoute = this.tabs[0].route;

  constructor() {}

  ngOnInit() {}

  onTabChanged(tab) {
    this.activeRoute = tab.route;
  }
}
