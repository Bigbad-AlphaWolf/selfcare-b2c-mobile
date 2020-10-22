import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DalalTonesService } from 'src/app/services/dalal-tones-service/dalal-tones.service';
import { DalalActivationSuccessModalComponent } from '../dalal-activation-success-modal/dalal-activation-success-modal.component';

@Component({
  selector: 'app-dalal-disable-popup',
  templateUrl: './dalal-disable-popup.component.html',
  styleUrls: ['./dalal-disable-popup.component.scss'],
})
export class DalalDisablePopupComponent implements OnInit {
  @Input() dalal: any;
  loading: boolean;
  hasError: boolean;
  error: string;
  constructor(
    private modalController: ModalController,
    private dalalTonesService: DalalTonesService
  ) {}

  ngOnInit() {}

  disableDalal() {
    this.loading = true;
    this.hasError = false;
    this.dalalTonesService.activateDalal(this.dalal, true).subscribe(
      (resp) => {
        this.loading = false;
        this.modalController.dismiss();
        this.openDalalDisableSuccessPopup();
      },
      (err) => {
        this.loading = false;
        this.hasError = true;
        this.error =
          err && err.error && err.error.message
            ? err.error.message
            : 'Une erreur est survenue';
      }
    );
  }

  async openDalalDisableSuccessPopup() {
    const modal = await this.modalController.create({
      component: DalalActivationSuccessModalComponent,
      cssClass: 'dalal-success-modal',
      componentProps: { choosenDalal: this.dalal },
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }

  close() {
    this.modalController.dismiss();
  }
}
