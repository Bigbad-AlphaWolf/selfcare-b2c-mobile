import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-modal-for-unblock-account-om',
  templateUrl: './modal-for-unblock-account-om.component.html',
  styleUrls: ['./modal-for-unblock-account-om.component.scss']
})
export class ModalForUnblockAccountOmComponent implements OnInit {
  @Input() typeInfos: 'CONDITIONS' | 'LASTNAME' | 'FIRSTNAME' | 'BIRTHDATE' | 'CNI';
  titles = {
    CONDITIONS: 'Conditions de déblocage',
    FIRSTNAME: 'Choix du nom',
    LASTNAME: 'Choix du prénom',
    BIRTHDATE: 'Choix de la date de naissance',
    CNI: 'Choix du numéro de CNI'
  };
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  goBack() {
    this.modalCtrl.dismiss();
  }
}
