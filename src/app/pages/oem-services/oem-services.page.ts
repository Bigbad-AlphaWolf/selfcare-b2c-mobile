import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OffreService } from 'src/app/models/offre-service.model';
import { OperationService } from 'src/app/services/oem-operation/operation.service';

@Component({
  selector: 'app-oem-services',
  templateUrl: './oem-services.page.html',
  styleUrls: ['./oem-services.page.scss'],
})
export class OemServicesPage implements OnInit {
  operations: OffreService[];
  loadingServices: boolean;
  hasError: boolean;

  constructor(
    private navCtr: NavController,
    private operationService: OperationService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fetchAllPostpaidOffers();
  }

  fetchAllPostpaidOffers() {
    this.loadingServices = true;
    this.hasError = false;
    this.operationService.getServicesByFormule().subscribe(
      (res) => {
        this.operations = res;
        this.loadingServices = false;
      },
      (err) => {
        this.loadingServices = false;
        this.hasError = true;
      }
    );
  }

  goBack() {
    this.navCtr.pop();
  }
}
