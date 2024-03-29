import {Component, OnInit} from '@angular/core';
import {FavorisService} from 'src/app/services/favoris/favoris.service';
import {of, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MarchandOem} from 'src/app/models/marchand-oem.model';
import {FavorisOem} from 'src/app/models/favoris-oem.model';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-favorite-merchant',
  templateUrl: './favorite-merchant.component.html',
  styleUrls: ['./favorite-merchant.component.scss']
})
export class FavoriteMerchantComponent implements OnInit {
  // merchants$: Observable<MarchandOem[]> = of([
  //   { name: 'Maison Nord-foire', merchantCode: '14206941826' },
  //   { name: 'Audi Q5', merchantCode: '14206941826' },
  //   { name: 'Mn Nord-foire', merchantCode: '14206941826' },
  // ]);
  merchants$: Observable<MarchandOem[]>;
  typeFavoris = 'marchand';

  constructor(private favoriService: FavorisService, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.merchants$ = this.favoriService.fetchFavorites(this.typeFavoris).pipe(
      map((favoris: FavorisOem[]) => {
        let results = [];
        favoris.forEach(el => {
          results.push({name: el.ref_label, merchantCode: el.ref_num});
        });
        return results;
      })
    );
  }

  onFavoriteMerchantSelected(merchant: MarchandOem) {
    this.modalCtrl.dismiss({
      TYPE_BS: 'FAVORIES',
      ACTION: 'FORWARD',
      merchant
    });
  }

  navigateBack() {
    this.modalCtrl.dismiss({TYPE_BS: 'FAVORIES', ACTION: 'BACK'});
  }
}
