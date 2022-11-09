import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OffreService } from 'src/app/models/offre-service.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { OperationService } from 'src/app/services/oem-operation/operation.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';
import { HUB_ACTIONS, OTHER_CATEGORIES } from 'src/shared';

@Component({
  selector: 'app-oem-services',
  templateUrl: './oem-services.page.html',
  styleUrls: ['./oem-services.page.scss'],
})
export class OemServicesPage implements OnInit {
  operations: OffreService[];
  loadingServices: boolean;
  hasError: boolean;

  constructor(private navCtr: NavController, private operationService: OperationService, private oemLoggingService: OemLoggingService, private dashbServ: DashboardService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fetchAllPostpaidOffers();
  }

  fetchAllPostpaidOffers() {
    this.loadingServices = true;
    this.hasError = false;
    this.operationService.getServicesByFormule().subscribe(
      res => {
        this.operations = res.filter(service => {
          const categories = service.categorieOffreServices.map(cat => cat.code);
          return !categories.includes(OTHER_CATEGORIES) && !categories.includes(HUB_ACTIONS.OFFRES_FIXES) && !categories.includes(HUB_ACTIONS.FIXES);
        });

        this.loadingServices = false;
        this.oemLoggingService.registerEvent(
          'hub_all_services_get_services_success',
          convertObjectToLoggingPayload({
            msisdn: this.dashbServ.getCurrentPhoneNumber(),
          })
        );
      },
      err => {
        this.loadingServices = false;
        this.hasError = true;
        this.oemLoggingService.registerEvent(
          'hub_all_services_get_services_error',
          convertObjectToLoggingPayload({
            msisdn: this.dashbServ.getCurrentPhoneNumber(),
            error: err.status,
          })
        );
      }
    );
  }

  goBack() {
    this.navCtr.pop();
  }
}
