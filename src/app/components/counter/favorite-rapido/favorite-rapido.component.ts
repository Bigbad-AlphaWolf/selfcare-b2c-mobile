import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
import { map } from 'rxjs/operators';
import { FavorisOem } from 'src/app/models/favoris-oem.model';
import { ModalController } from '@ionic/angular';
import { FavoriteType } from 'src/app/models/enums/om-favori-type.enum';

@Component({
  selector: 'app-favorite-rapidos',
  templateUrl: './favorite-rapido.component.html',
  styleUrls: ['./favorite-rapido.component.scss'],
})
export class FavoriteRapidoComponent implements OnInit {
  rapidos$: Observable<any[]>;

  constructor(
    private favoriService: FavorisService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.rapidos$ = this.favoriService
      .favoritesByService(FavoriteType.RAPIDO)
      .pipe(
        map((favoris: FavorisOem[]) => {
          let results = [];
          favoris = favoris.slice(0, 5);
          favoris.forEach((el) => {
            results.push({ name: el.ref_label, counterNumber: el.ref_num });
          });
          return results;
        })
      );
  }

  onFavoriteRapidoSlected(rapido: any) {
    this.modalCtrl.dismiss({
      TYPE_BS: 'FAVORIES',
      ACTION: 'FORWARD',
      counter: rapido,
    });
  }

  navigateBack() {
    this.modalCtrl.dismiss({ TYPE_BS: 'FAVORIES', ACTION: 'BACK' });
  }
}
