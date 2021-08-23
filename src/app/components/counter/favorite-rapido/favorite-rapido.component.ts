import { Component, OnInit, Input } from '@angular/core';
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
  @Input() rapidosFavorites$: Observable<any[]>;
  @Input() operation: string;
  constructor(
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
  }

  onFavoriteRapidoSlected(rapido: any) {

    this.modalCtrl.dismiss({
      TYPE_BS: 'FAVORIES',
      ACTION: 'FORWARD',
      counter: rapido,
      operation: this.operation
    });
  }

  navigateBack() {
    this.modalCtrl.dismiss({ TYPE_BS: 'FAVORIES', ACTION: 'BACK', operation: this.operation });
  }
}
