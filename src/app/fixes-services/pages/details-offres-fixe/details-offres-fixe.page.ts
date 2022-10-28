import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OffreService } from 'src/app/models/offre-service.model';
import { PageHeader } from 'src/app/models/page-header.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { OperationService } from 'src/app/services/oem-operation/operation.service';
import { getPageHeader } from 'src/app/utils/title.util';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';
import { HUB_ACTIONS, OFFRES_FIXES_SERVICES_PAGE } from 'src/shared';

@Component({
  selector: 'app-details-offres-fixe',
  templateUrl: './details-offres-fixe.page.html',
  styleUrls: ['./details-offres-fixe.page.scss'],
})
export class DetailsOffresFixePage implements OnInit {
  pageInfos: PageHeader;
  loadingServices: boolean;
  errorMsg: string;
  listOffres: OffreService[] = [];
  constructor(private operationService: OperationService, private oemLoggingService: OemLoggingService, private dahbService: DashboardService) {}

  ngOnInit() {
    this.pageInfos = getPageHeader(OFFRES_FIXES_SERVICES_PAGE);
    this.getServices();
  }

  getServices() {
    this.loadingServices = true;
    this.errorMsg = null;
    this.operationService
      .getServicesByFormule(HUB_ACTIONS.OFFRES_FIXES)
      .pipe(
        tap(res => {
          console.log('res', res);
          this.loadingServices = false;
          this.listOffres = res;
          const followEvent = 'Get_hub_details_offres_fixe_services_success';
          this.oemLoggingService.registerEvent(followEvent, convertObjectToLoggingPayload({ msisdn: this.dahbService.getCurrentPhoneNumber() }));
        }),
        catchError(err => {
          this.loadingServices = false;
          this.errorMsg = 'Veuillez réessayer dans quelques minutes. Nous avons des soucis à récuperer les infos';
          const followError = 'Get_hub_details_offres_fixes_services_failed';
          this.oemLoggingService.registerEvent(
            followError,
            convertObjectToLoggingPayload({
              msisdn: this.dahbService.getCurrentPhoneNumber(),
              error: err.status,
            })
          );
          return throwError(err);
        })
      )
      .subscribe();
  }
}
