import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';

@Component({
  selector: "app-favorite-counter-name-modal",
  templateUrl: "./favorite-counter-name-modal.component.html",
  styleUrls: ["./favorite-counter-name-modal.component.scss"],
})
export class FavoriteCounterNameModalComponent implements OnInit {
  name: string;
  saving: boolean;
  saveSuccess: boolean;
  @Input() counter;
  @Input() purchaseType;

  constructor(
    private modal: ModalController,
    private favorisService: FavorisService,
    private omService: OrangeMoneyService
  ) {}

  ngOnInit() {}

  save() {
    // this.saving = true;
    // this.omService.getOmMsisdn().pipe(
    //   switchMap(msisdn => {
    //     const payload = {
    //       msisdn,
    //       card_num: this.counter,

    //     }
    //     return this.favorisService.saveRapidoFavorite()
    //   })
    // )
  }
}
