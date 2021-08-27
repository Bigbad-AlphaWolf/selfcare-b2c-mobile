import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  NewUserConsoModel,
  ProcessedConsoModel,
} from 'src/app/services/user-cunsommation-service/user-conso-service.index';
import { UserConsoService } from 'src/app/services/user-cunsommation-service/user-conso.service';

@Component({
  selector: 'app-new-details-conso',
  templateUrl: './new-details-conso.component.html',
  styleUrls: ['./new-details-conso.component.scss'],
})
export class NewDetailsConsoComponent implements OnInit {
  loadingConso: boolean;
  userConso;

  constructor(private consoService: UserConsoService) {}

  ngOnInit() {
    this.getUserConsoInfos();
  }

  ionViewDidEnter() {
    this.getUserConsoInfos();
  }

  getUserConsoInfos() {
    this.loadingConso = true;
    this.consoService
      .getUserCunsomation()
      .pipe(
        tap((res) => {
          this.userConso = this.processDetailsConso(res);
          this.loadingConso = false;
        }),
        catchError((err) => {
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
