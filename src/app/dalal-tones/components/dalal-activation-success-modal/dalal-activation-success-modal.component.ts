import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DalalTonesModel } from 'src/app/models/dalal-tones.model';

@Component({
  selector: 'app-dalal-activation-success-modal',
  templateUrl: './dalal-activation-success-modal.component.html',
  styleUrls: ['./dalal-activation-success-modal.component.scss'],
})
export class DalalActivationSuccessModalComponent implements OnInit {
  @Input() choosenDalal: DalalTonesModel;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
