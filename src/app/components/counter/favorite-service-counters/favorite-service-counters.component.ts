import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { FavoriteType } from 'src/app/models/enums/om-favori-type.enum';
import { FavorisOem } from 'src/app/models/favoris-oem.model';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
import { OPERATION_TYPE_SENELEC_BILLS, OPERATION_TYPE_SENEAU_BILLS } from 'src/app/utils/operations.constants';

@Component({
  selector: "app-favorite-service-counters",
  templateUrl: "./favorite-service-counters.component.html",
  styleUrls: ["./favorite-service-counters.component.scss"],
})
export class FavoriteServiceCountersComponent implements OnInit {
  fetchingFavorites: boolean;
  favorites: any[];
  @Input() operationType: string;
  OPERATION_TYPE_SENELEC_BILLS = OPERATION_TYPE_SENELEC_BILLS;
  OPERATION_TYPE_SENEAU_BILLS = OPERATION_TYPE_SENEAU_BILLS;

  constructor(
    private favoritesService: FavorisService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.fetchFavorites();
  }

  fetchFavorites() {
    this.fetchingFavorites = true;
    const service = this.favoritesService.getFavoriteCode(this.operationType);
    this.favoritesService
      .favoritesByService(service)
      .pipe(
        map((favoris: FavorisOem[]) => {
          let results = [];
          // favoris = favoris.slice(0, 3);
          favoris.forEach((el) => {
            results.push({ name: el.ref_label, counterNumber: el.ref_num });
          });
          return results;
        }),
        catchError((err) => {
          this.fetchingFavorites = false;
          return of([]);
        }),
        tap((fav) => {
          this.fetchingFavorites = false;
          this.favorites = fav;
        })
      )
      .subscribe();
  }

  selectFav(counter?: {counterNumber; name: string}) {
    this.modalController.dismiss({
      TYPE_BS: 'FAVORIES',
      ACTION: counter ? 'FORWARD' : 'BACK',
      ligne: counter?.counterNumber,
      counter,
      type: this.operationType
    });
  }

  navigateBack() {
    this.modalController.dismiss({TYPE_BS: 'FAVORIES', ACTION: 'BACK', operation: this.operationType});
  }
}
