import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonInput, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { CustomerOperationStatus } from 'src/app/models/enums/om-customer-status.enum';
import { OffreService } from 'src/app/models/offre-service.model';
import { OMCustomerStatusModel } from 'src/app/models/om-customer-status.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { OperationService } from 'src/app/services/oem-operation/operation.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';
import { REGEX_FIX_NUMBER } from 'src/shared';

@Component({
  selector: 'app-assistance-search',
  templateUrl: './assistance-search.component.html',
  styleUrls: ['./assistance-search.component.scss'],
})
export class AssistanceSearchComponent implements OnInit {
  displaySearchIcon: boolean = true;
  @ViewChild('searchInput', { static: true })
  searchRef: IonInput;
  terms = '';
  listBesoinAides: OffreService[];
  listBesoinAidesAltered: OffreService[];
  isLoading: boolean;
  currentPhoneNumber = this.dashbServ.getCurrentPhoneNumber();
  constructor(
    private navController: NavController,
    private operationService: OperationService,
    private dashbServ: DashboardService,
    private orangeMoneyService: OrangeMoneyService,
    private oemLoggingService: OemLoggingService
  ) {}

  ngOnInit() {
    //this.listBesoinAidesAltered = this.listBesoinAides =
    //  history.state && history.state.listBesoinAides ? history.state.listBesoinAides : [];
    this.initSearchRef();
    this.oemLoggingService.registerEvent('Assistance_search_page_affichage_success');
  }

  ionViewWillEnter() {
    const source = history.state && history.state.source ? history.state.source : null;
    if (source) {
      this.fetchAllHelpItems();
    } else {
      this.listBesoinAides = history.state && history.state.listBesoinAides ? history.state.listBesoinAides : [];
      this.initSearchRef();
    }
  }

  initSearchRef() {
    const search = history.state && history.state.search ? history.state.search : null;
    this.searchRef.value = search;
    this.displaySearchIcon = false;
    this.terms = search;
    setTimeout(() => {
      this.searchRef.setFocus();
    }, 400);
  }

  onInputChange($event) {
    const inputvalue = $event.detail.value;
    this.displaySearchIcon = true;
    if (inputvalue) {
      this.displaySearchIcon = false;
    }
    this.terms = inputvalue;
  }

  onClear(searchInput) {
    const inputValue: string = searchInput.value;
    searchInput.value = inputValue.slice(0, inputValue.length - 1);
  }

  goBack() {
    this.navController.pop();
  }

  fetchAllHelpItems() {
    this.isLoading = true;
    this.operationService
      .getServicesByFormule(null, true, true)
      .pipe(
        switchMap(async (res: OffreService[]) => {
          const offres: OffreService[] = await this.operationService.getServicesByFormule(null, null, true).toPromise();
          return [...offres, ...res];
        })
      )
      .subscribe(
        async res => {
          this.isLoading = false;
          let userOMStatus;
          if (!REGEX_FIX_NUMBER.test(this.currentPhoneNumber)) userOMStatus = await this.checkStatus();
          this.listBesoinAides = res;
          this.listBesoinAides = this.filterOMActesFollowingOMStatus(userOMStatus, this.listBesoinAides);
          this.initSearchRef();
          this.oemLoggingService.registerEvent('Assistance_hub_affichage_success');
        },
        err => {
          this.isLoading = false;
          this.oemLoggingService.registerEvent(
            'Assistance_hub_affichage_error',
            convertObjectToLoggingPayload({
              msisdn: this.currentPhoneNumber,
              error: err.status,
            })
          );
        }
      );
  }

  filterOMActesFollowingOMStatus(user: OMCustomerStatusModel, actes: OffreService[]) {
    let response = actes;
    if (user.operation === 'DEPLAFONNEMENT' || user.operation === 'FULL') {
      response = actes.filter((item: OffreService) => {
        return item.code !== 'OUVERTURE_OM_ACCOUNT' && item.code !== 'OUVERTURE_OM_ACCOUNT_NEW';
      });
    } else if (user.operation === 'OUVERTURE_COMPTE' && user.operationStatus === CustomerOperationStatus.password_creation) {
      response = actes;
    } else {
      response = actes.filter((item: OffreService) => {
        return item.code !== 'DEPLAFONNEMENT' && item.code !== 'DEPLAFONNEMENT_NEW';
      });
    }
    return response;
  }

  async checkStatus() {
    this.isLoading = true;
    return await this.orangeMoneyService
      .getUserStatus(this.currentPhoneNumber)
      .pipe(
        tap(_ => {
          this.isLoading = false;
        }),
        catchError((err: any) => {
          this.isLoading = false;
          return of(null);
        })
      )
      .toPromise();
  }

  logAct(act) {
    this.oemLoggingService.registerEvent('dashboard_search_result_clic', [
      { dataName: 'act', dataValue: act },
      { dataName: 'msisdn', dataValue: this.currentPhoneNumber },
    ]);
  }
}
