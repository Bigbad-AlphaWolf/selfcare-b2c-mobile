import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DalalDisablePopupComponent } from '../dalal-disable-popup/dalal-disable-popup.component';

@Component({
  selector: 'app-activated-dalal-page',
  templateUrl: './activated-dalal-page.component.html',
  styleUrls: ['./activated-dalal-page.component.scss'],
})
export class ActivatedDalalPageComponent implements OnInit {
  currentActiveDalals: any[];
  editMode: boolean;

  constructor(
    private navController: NavController,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  switchMode() {
    this.editMode = !this.editMode;
  }

  ionViewWillEnter() {
    this.currentActiveDalals = history.state.activeDalal;
  }

  async openDisablePopup(dalal) {
    if (!this.editMode) return;
    const modal = await this.modalController.create({
      component: DalalDisablePopupComponent,
      cssClass: 'select-recipient-modal',
      backdropDismiss: true,
      componentProps: { dalal },
    });
    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }

  goBack() {
    this.navController.pop();
  }
}
