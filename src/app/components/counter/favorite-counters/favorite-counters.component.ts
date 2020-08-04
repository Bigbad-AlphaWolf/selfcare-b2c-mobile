import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CounterOem } from 'src/app/models/counter-oem.model';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
import { map } from 'rxjs/operators';
import { FavorisOem } from 'src/app/models/favoris-oem.model';
import { ModalController } from '@ionic/angular';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';

@Component({
  selector: 'app-favorite-counters',
  templateUrl: './favorite-counters.component.html',
  styleUrls: ['./favorite-counters.component.scss'],
})
export class FavoriteCountersComponent implements OnInit {
  // counters$: Observable<CounterOem[]> = of([
  //   { name: 'Maison Nord-foire', counterNumber: '14206941826' },
  //   { name: 'Audi Q5', counterNumber: '14206941826' },
  //   { name: 'Mn Nord-foire', counterNumber: '14206941826' },
  // ]);
  counters$: Observable<CounterOem[]>;

  constructor(
    private favoriService: FavorisService,
    private bsService: BottomSheetService,
    private modalCtrl : ModalController
  ) {}

  ngOnInit() {
    let type_favoris = 'compteur';
    let code = this.bsService.opXtras.billData.company.code;
    this.counters$ = this.favoriService.fetchFavorites(type_favoris).pipe(
      map((favoris: FavorisOem[]) => {
        let results = [];
        favoris = favoris.slice(0, 3);
        favoris.forEach((el) => {
          if (code === el.service_code)
            results.push({ name: el.ref_label, counterNumber: el.ref_num });
        });
        return results;
      })
    );
  }

  onFavoriteCounterSlected(counter: CounterOem) {
    this.modalCtrl.dismiss({
      TYPE_BS: 'FAVORIES',
      ACTION: 'FORWARD',
      counter: counter,
    });
  }

  navigateBack() {
    this.modalCtrl.dismiss({ TYPE_BS: 'FAVORIES', ACTION: 'BACK' });
  }
}
