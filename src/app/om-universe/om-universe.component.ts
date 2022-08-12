import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HUB_ACTIONS } from 'src/shared';
import { OffreService } from '../models/offre-service.model';
import { OperationService } from '../services/oem-operation/operation.service';
import { OMTransactionsResponseModel } from '../services/orange-money-service';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';

@Component({
  selector: 'app-om-universe',
  templateUrl: './om-universe.component.html',
  styleUrls: ['./om-universe.component.scss'],
})
export class OmUniverseComponent implements OnInit {
  isIos: boolean;
  loadingServices: boolean;
  loadingServicesHasError: boolean;
  omServices: OffreService[];

  loadingTransactions: boolean;
  loadingTransactionsHasError: boolean;
  omTransactions: OMTransactionsResponseModel[];

  constructor(
    private platform: Platform,
    private operationService: OperationService,
    private orangeMoneyService: OrangeMoneyService
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.isIos = this.platform.is('ios');
    });
  }

  fetchOMServices() {
    this.loadingServicesHasError = false;
    this.loadingServices = true;
    this.operationService
      .getServicesByFormule(HUB_ACTIONS.OM, null, true)
      .pipe(
        tap((services: OffreService[]) => {
          this.loadingServices = false;
          this.omServices = services;
        }),
        catchError((err) => {
          if (this.omServices?.length) {
            return throwError(err);
          }
          this.loadingServicesHasError = true;
          return throwError(err);
        })
      )
      .subscribe();
  }

  fetchOMTransactions() {
    this.loadingTransactionsHasError = false;
    this.loadingTransactions = true;
    this.orangeMoneyService
      .getOMLastTransactions({ page: 0, pageSize: 5 })
      .pipe(tap((res) => {
        this.omTransactions = res;
      }))
      .subscribe();
  }

  ionViewWillEnter() {
    this.fetchOMServices();
    this.fetchOMTransactions();
  }

  search() {}

  onInputFocus() {}
}
