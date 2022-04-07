import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
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
  error: boolean;

  constructor(
    private modal: ModalController,
    private favorisService: FavorisService,
    private omService: OrangeMoneyService
  ) {}

  ngOnInit() {}

  save() {
    this.saving = true;
    this.error = false;
    this.omService.getOmMsisdn().pipe(
      switchMap(msisdn => {
        const payload = {
          msisdn,
          ref_num: this.counter,
          ref_label: this.name,
          service_code: this.favorisService.getFavoriteCode(this.purchaseType)
        }
        return this.favorisService.saveFavorite(payload);
      })
    ).pipe(
      tap(res => {
        this.saveSuccess = true;
        this.saving = false;
        setTimeout(() => {
          this.modal.dismiss();
        }, 3000)
      }),
      catchError(err => {
        this.saving = false;
        this.error = true;
        return throwError(err)
      })
    ).subscribe()
  }
}
