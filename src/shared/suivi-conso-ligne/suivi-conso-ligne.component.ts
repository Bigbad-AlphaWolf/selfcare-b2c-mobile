import { Component, Input, OnInit } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CustomContact } from 'src/app/models/customized-contact.model';
import { ContactsService } from 'src/app/services/contacts-service/contacts.service';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { SargalService } from 'src/app/services/sargal-service/sargal.service';
import { NewUserConsoModel, ProcessedConsoModel } from 'src/app/services/user-cunsommation-service/user-conso-service.index';
import { UserConsoService } from 'src/app/services/user-cunsommation-service/user-conso.service';
import { COUNTER_TYPE_FELLOW } from '..';

@Component({
  selector: 'app-suivi-conso-ligne',
  templateUrl: './suivi-conso-ligne.component.html',
  styleUrls: ['./suivi-conso-ligne.component.scss'],
})
export class SuiviConsoLigneComponent implements OnInit {
	@Input() ligneNumber: string;
	@Input() hideCategoryTitle: boolean
	loadingConso: boolean;
	userConso: any;

  constructor(private consoService: UserConsoService, private sargalService: SargalService, private recentsService : RecentsService,
		private contactService: ContactsService) { }

  ngOnInit() {
		this.getUserConsoInfos();
	}

	getUserConsoInfos(msisdn = this.ligneNumber) {
    this.loadingConso = true;
    this.consoService
      .getUserCunsomation(msisdn)
      .pipe(
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
            })
          );
        }),
        tap(res => {
          this.userConso = this.processDetailsConso(res);
          this.loadingConso = false;
        }),
        catchError(err => {
          this.loadingConso = false;
          return throwError(err);
        })
      )
      .subscribe();
  }

	processDetailsConso(conso: NewUserConsoModel[]) {
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
