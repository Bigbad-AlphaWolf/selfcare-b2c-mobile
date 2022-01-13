import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CustomerOperationStatus } from 'src/app/models/enums/om-customer-status.enum';
import { OffreService } from 'src/app/models/offre-service.model';
import { OMCustomerStatusModel } from 'src/app/models/om-customer-status.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { OperationService } from 'src/app/services/oem-operation/operation.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { REGEX_FIX_NUMBER } from '..';

@Component({
  selector: 'app-services-search-bar',
  templateUrl: './services-search-bar.component.html',
  styleUrls: ['./services-search-bar.component.scss'],
})
export class ServicesSearchBarComponent implements OnInit {
  listBesoinAides: OffreService[] = [];
  currentMsisdn = this.dashbServ.getCurrentPhoneNumber();
  userOMStatus: any;
  @Input() source: 'DASHBOARD' | null = 'DASHBOARD';
  constructor(
    private navController: NavController,
    private followAnalyticsService: FollowAnalyticsService,
    private operationService: OperationService,
    private dashbServ: DashboardService,
    private orangeMoneyService: OrangeMoneyService,
    private oemLoggingService: OemLoggingService
  ) {}

  ngOnInit() {}

  //ionViewWillEnter() {
  //  console.log('search ionViewWillEnter');
  //  this.fetchAllHelpItems();
  //}

  onInputFocus() {
    this.navController.navigateForward(['/assistance-hub/search'], {
      state: { listBesoinAides: this.listBesoinAides, source: this.source },
    });
    const eventName =
      this.source === 'DASHBOARD'
        ? 'dashboard_search_focus_click'
        : this.source === 'SERVICES'
        ? ''
        : '';
    this.oemLoggingService.registerEvent(eventName, [
      { dataName: 'msisdn', dataValue: this.currentMsisdn },
    ]);
  }

  async checkStatus() {
    return await this.orangeMoneyService
      .getUserStatus(this.currentMsisdn)
      .pipe(
        catchError((err: any) => {
          return of(null);
        })
      )
      .toPromise();
  }

  fetchAllHelpItems() {
    this.operationService
      .getServicesByFormule(null, true)
      .pipe(
        switchMap(async (res: OffreService[]) => {
          const offres: OffreService[] = await this.operationService
            .getServicesByFormule()
            .toPromise();
          return [...offres, ...res];
        })
      )
      .subscribe(
        async (res) => {
          let userOMStatus;
          if (!REGEX_FIX_NUMBER.test(this.currentMsisdn))
            userOMStatus = await this.checkStatus();
          this.listBesoinAides = res;
          this.listBesoinAides = this.filterOMActesFollowingOMStatus(
            userOMStatus,
            this.listBesoinAides
          );
          this.followAnalyticsService.registerEventFollow(
            'Assistance_hub_affichage_success',
            'event'
          );
        },
        (err) => {
          this.followAnalyticsService.registerEventFollow(
            'Assistance_hub_affichage_error',
            'error',
            {
              msisdn: this.currentMsisdn,
              error: err.status,
            }
          );
        }
      );
  }

  filterOMActesFollowingOMStatus(
    user: OMCustomerStatusModel,
    actes: OffreService[]
  ) {
    let response = actes;
    if (user.operation === 'DEPLAFONNEMENT' || user.operation === 'FULL') {
      response = actes.filter((item: OffreService) => {
        return (
          item.code !== 'OUVERTURE_OM_ACCOUNT' &&
          item.code !== 'OUVERTURE_OM_ACCOUNT_NEW'
        );
      });
    } else if (
      user.operation === 'OUVERTURE_COMPTE' &&
      user.operationStatus === CustomerOperationStatus.password_creation
    ) {
      response = actes;
    } else {
      response = actes.filter((item: OffreService) => {
        return (
          item.code !== 'DEPLAFONNEMENT' && item.code !== 'DEPLAFONNEMENT_NEW'
        );
      });
    }
    return response;
  }
}
