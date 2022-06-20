import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FIXES_SERVICES_PAGE, HUB_ACTIONS, MSISDN_TYPE, SubscriptionModel } from 'src/shared';
import { LinesComponent } from '../components/lines/lines.component';
import { OffreService } from '../models/offre-service.model';
import { PageHeader } from '../models/page-header.model';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { OperationService } from '../services/oem-operation/operation.service';
import { getPageHeader } from '../utils/title.util';

@Component({
  selector: 'app-fixes-services',
  templateUrl: './fixes-services.page.html',
  styleUrls: ['./fixes-services.page.scss'],
})
export class FixesServicesPage implements OnInit {
	pageInfos: PageHeader;
	loadingServices: boolean;
	servicesHasError: boolean;
	listOffres: OffreService[] = [];
	phone: string;
	currentPhoneOffer: SubscriptionModel;
	isInitRequests: boolean;
	errorMsg: string;
  constructor(private operationService: OperationService, private modalController: ModalController, private dashboardService: DashboardService,
		private authServ: AuthenticationService) { }

  ngOnInit() {
		this.pageInfos = getPageHeader(FIXES_SERVICES_PAGE);
		//this.getServices();
		this.fetchFixNumbers();
  }

	getServices() {
		this.loadingServices = true;
		this.errorMsg = null;
    this.operationService.getServicesByFormule(HUB_ACTIONS.FIXES).pipe(
			tap(res => {
				console.log('res', res);
				this.loadingServices = false;
				this.listOffres = res;
        //this.followAnalyticsService.registerEventFollow(followEvent, 'event', this.currentPhone);
      }),
			catchError( err => {
				this.loadingServices = false;
				this.errorMsg = 'Veuillez réessayer dans quelques minutes. Nous avons des soucis à récuperer les infos'
        //this.followAnalyticsService.registerEventFollow(followError, 'error', {
        //  msisdn: this.currentPhone,
        //  error: err.status,
        //});
				return throwError(err);
      })

    ).subscribe();
  }

	async openLinesModal() {
    const modal = await this.modalController.create({
      component: LinesComponent,
      cssClass: "select-recipient-modal",
      componentProps: {
        phone: this.phone,
				phoneType: MSISDN_TYPE.FIXE
      },
    });
    modal.onDidDismiss().then((response) => {
      if (response?.data) {
				console.log('response', response);

        this.phone = response.data.phone;
				this.currentPhoneOffer = response.data?.souscription;

      }
    });
    return await modal.present();
  }


	async fetchFixNumbers() {
    this.loadingServices = true;
		console.log('called');

    const listFixeLinked = await this.dashboardService
      .fetchFixedNumbers()
      .pipe(
        tap((numbers) => {
          // numbers = ['338239614'];
					console.log('number', numbers);
					this.loadingServices = false;
        }),
        catchError(() => {
          this.loadingServices = false;
          return of([]);
        }))
      .toPromise();
		if(listFixeLinked.length) {
			this.getServices();
			this.phone = listFixeLinked[0];
			this.getSubscription(this.phone);
		} else {
			this.errorMsg = 'Aucune Ligne Fixe présente'
		}
  }

	async getSubscription(number: string){
		this.currentPhoneOffer = await this.authServ.getSubscription(number).toPromise();
	}

}
