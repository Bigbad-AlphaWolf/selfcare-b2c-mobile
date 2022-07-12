import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OffreService } from 'src/app/models/offre-service.model';
import { PageHeader } from 'src/app/models/page-header.model';
import { OperationService } from 'src/app/services/oem-operation/operation.service';
import { getPageHeader } from 'src/app/utils/title.util';
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
	constructor(private operationService: OperationService) { }

  ngOnInit() {
		this.pageInfos = getPageHeader(OFFRES_FIXES_SERVICES_PAGE);
		this.getServices();
  }

	getServices() {
		this.loadingServices = true;
		this.errorMsg = null;
    this.operationService.getServicesByFormule(HUB_ACTIONS.OFFRES_FIXES).pipe(
			tap(res => {
				console.log('res', res);
				this.loadingServices = false;
				this.listOffres = res;
        const followEvent = 'Get_hub_details_offres_fixe_services_success';
        //this.followAnalyticsService.registerEventFollow(followEvent, 'event', this.currentPhone);
      }),
			catchError( err => {
				this.loadingServices = false;
				this.errorMsg = 'Veuillez réessayer dans quelques minutes. Nous avons des soucis à récuperer les infos'
        const followError =  'Get_hub_details_offres_fixes_services_failed';
        //this.followAnalyticsService.registerEventFollow(followError, 'error', {
        //  msisdn: this.currentPhone,
        //  error: err.status,
        //});
				return throwError(err);
      })

    ).subscribe();
  }

}
