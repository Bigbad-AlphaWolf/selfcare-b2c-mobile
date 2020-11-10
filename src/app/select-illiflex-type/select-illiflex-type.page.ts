import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IlliflexOption } from 'src/shared';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';

@Component({
  selector: 'app-select-illiflex-type',
  templateUrl: './select-illiflex-type.page.html',
  styleUrls: ['./select-illiflex-type.page.scss'],
})
export class SelectIlliflexTypePage implements OnInit {
  constructor(
    private navController: NavController,
    private applicationRoutingService: ApplicationRoutingService
  ) {}
  ngOnInit() {}

  goBack() {
    this.navController.pop();
  }

  goConfigIlliflexPage(type: IlliflexOption) {
    this.applicationRoutingService.goToSetIlliflexPage(type);
  }
}
