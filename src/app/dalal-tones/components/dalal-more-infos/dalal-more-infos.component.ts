import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dalal-more-infos',
  templateUrl: './dalal-more-infos.component.html',
  styleUrls: ['./dalal-more-infos.component.scss'],
})
export class DalalMoreInfosComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
