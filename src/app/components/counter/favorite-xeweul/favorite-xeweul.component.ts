import {Component, OnInit, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {IXeweulCard} from '../../../models/xeweul/card.model';

@Component({
  selector: 'app-favorite-xeweuls',
  templateUrl: './favorite-xeweul.component.html',
  styleUrls: ['./favorite-xeweul.component.scss']
})
export class FavoriteXeweulComponent implements OnInit {
  @Input() xeweulsFavorites$: IXeweulCard[];
  @Input() operation: string;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onFavoriteXeweulSlected(xeweul: IXeweulCard) {
    console.log('selectin oh');
    console.log(xeweul);
    console.log(this.operation);
    console.log('selectin oh');


    this.modalCtrl.dismiss({
      TYPE_BS: 'FAVORIES',
      ACTION: 'FORWARD',
      counter: {name: xeweul?.label, counterNumber: xeweul?.id},
      operation: this.operation
    });
  }

  navigateBack() {
    this.modalCtrl.dismiss({TYPE_BS: 'FAVORIES', ACTION: 'BACK', operation: this.operation});
  }
}
