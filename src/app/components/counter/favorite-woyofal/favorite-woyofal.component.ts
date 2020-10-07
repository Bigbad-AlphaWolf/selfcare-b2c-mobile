import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
import { map } from 'rxjs/operators';
import { FavorisOem } from 'src/app/models/favoris-oem.model';
import { ModalController } from '@ionic/angular';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';

@Component({
  selector: 'app-favorite-woyofals',
  templateUrl: './favorite-woyofal.component.html',
  styleUrls: ['./favorite-woyofal.component.scss'],
})
export class FavoriteWoyofalComponent implements OnInit {
  woyofals$: Observable<any[]>;

  constructor(
    private favoriService: FavorisService,
    private bsService: BottomSheetService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    let type_favoris = 'compteur';
    console.log(this.bsService.opXtras.billData);

    let code = this.bsService.opXtras.billData.company.code;
    this.woyofals$ = this.favoriService.fetchFavorites(type_favoris).pipe(
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

  onFavoriteWoyofalSelected(woyofal: any) {
    this.modalCtrl.dismiss({
      TYPE_BS: 'FAVORIES',
      ACTION: 'FORWARD',
      counter: woyofal,
    });
  }

  navigateBack() {
    this.modalCtrl.dismiss({ TYPE_BS: 'FAVORIES', ACTION: 'BACK' });
  }
}
