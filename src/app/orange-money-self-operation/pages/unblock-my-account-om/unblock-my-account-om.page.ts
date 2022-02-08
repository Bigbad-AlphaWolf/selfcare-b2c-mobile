import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {ModalForUnblockAccountOmComponent} from '../../components/modal-for-unblock-account-om/modal-for-unblock-account-om.component';

@Component({
  selector: 'app-unblock-my-account-om',
  templateUrl: './unblock-my-account-om.page.html',
  styleUrls: ['./unblock-my-account-om.page.scss']
})
export class UnblockMyAccountOmPage implements OnInit {
  constructor(private navController: NavController, private modalController: ModalController) {}

  ngOnInit() {}

  goBack() {
    this.navController.pop();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalForUnblockAccountOmComponent
    });
    return await modal.present();
  }
}
