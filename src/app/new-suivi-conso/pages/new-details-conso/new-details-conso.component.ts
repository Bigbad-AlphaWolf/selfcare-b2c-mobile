import { Component, OnInit } from '@angular/core';
import { of, throwError, timer } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CustomContact } from 'src/app/models/customized-contact.model';
import { ContactsService } from 'src/app/services/contacts-service/contacts.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { LocalStorageService } from 'src/app/services/localStorage-service/local-storage.service';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { SargalService } from 'src/app/services/sargal-service/sargal.service';
import {
  NewUserConsoModel,
  ProcessedConsoModel,
} from 'src/app/services/user-cunsommation-service/user-conso-service.index';
import { UserConsoService, USER_CONSO_REQUEST_TIMEOUT, USER_CONSO_STORAGE_KEY } from 'src/app/services/user-cunsommation-service/user-conso.service';
import { COUNTER_TYPE_FELLOW } from 'src/shared';
@Component({
  selector: 'app-new-details-conso',
  templateUrl: './new-details-conso.component.html',
  styleUrls: ['./new-details-conso.component.scss'],
})
export class NewDetailsConsoComponent implements OnInit {
  loadingConso: boolean;
  userConso;
  COUNTER_TYPE_FELLOW = COUNTER_TYPE_FELLOW;
  lastUpdateDate;
  msisdn = this.dashboardService.getCurrentPhoneNumber();

  constructor(
    private consoService: UserConsoService,
    private sargalService: SargalService,
    private contactService: ContactsService,
    private recentsService: RecentsService,
    private dashboardService: DashboardService,
    private storageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.getUserConsoInfos();
  }

  getUserConsoInfos(event?) {
    this.loadingConso = true;
    this.consoService
      .getUserCunsomation()
      .pipe(
        takeUntil(timer(USER_CONSO_REQUEST_TIMEOUT).pipe(tap(_ => {
          this.loadingConso = false;
          const key = `${USER_CONSO_STORAGE_KEY}_${this.msisdn}`;
          const storedData: NewUserConsoModel[] = this.storageService.getFromLocalStorage(key);
          storedData.length && this.processDetailsConso(storedData);
          this.consoService.getUserCunsomation(this.msisdn).subscribe({
            next: (response) => {
              response.length ? this.processDetailsConso(response) : null;
            }
          });
        }))),
        switchMap(resp => {
          return this.sargalService.getFellowsMsisdn().pipe(
            switchMap((fellowsMsisdn: any[]) => {
              const mappedFellowArray = [];
              for (let fellow of fellowsMsisdn) {
                const fell = {};
                fell['destinataire'] = fellow?.msisdn;
                fell['counterName'] = fellow?.name;
                mappedFellowArray.push(fell)
              }
              return this.contactService.getAllContacts().pipe(
                map((contacts: CustomContact[]) => {
                  const fellowMsisdnWithContacts = this.recentsService.mapRecentsToContacts(mappedFellowArray, contacts);
                  for (let castedFellow of fellowMsisdnWithContacts) {
                    const mappedFellow: NewUserConsoModel = {
                      montantRestant: castedFellow?.destinataire,
                      dateExpiration: castedFellow?.name,
                      name: castedFellow['counterName'],
                      typeCompteur: COUNTER_TYPE_FELLOW,
                    };
                    resp.push(mappedFellow);
                  }
                  return resp;
                }),
                catchError(err => {
                  return of(resp);
                })
              );
            }),
            catchError(err => {
              return of(resp);
            })
          );
        }),
        tap(res => {
          this.userConso = this.processDetailsConso(res);
          this.loadingConso = false;
          event ? event.target.complete() : '';
        }),
        catchError(err => {
          this.loadingConso = false;
          event ? event.target.complete() : '';
          return throwError(err);
        })
      )
      .subscribe();
  }

  toCamelCase(categoryName: string) {
    let first = categoryName.substr(0, 1).toUpperCase();
    return first + categoryName.substr(1).toLowerCase();
  }

  processDetailsConso(conso: NewUserConsoModel[]) {
    const updateDateKey = `${USER_CONSO_STORAGE_KEY}_${this.msisdn}_last_update`;
    this.lastUpdateDate = this.storageService.getFromLocalStorage(updateDateKey);
    const categoriesWithDuplicates = conso.map(
      (consoItem) => consoItem.typeCompteur
    );
    const categories = categoriesWithDuplicates.filter(
      (value, index) => categoriesWithDuplicates.indexOf(value) === index
    );
    let processedConso: ProcessedConsoModel[] = [];
    for (let category of categories) {
      const consumations = conso.filter(
        (consoItem) => consoItem.typeCompteur === category
      );
      processedConso.push({ category, consumations });
    }
    return processedConso;
  }
}
