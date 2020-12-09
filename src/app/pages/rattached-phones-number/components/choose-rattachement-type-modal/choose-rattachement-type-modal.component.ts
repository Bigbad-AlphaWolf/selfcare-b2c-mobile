import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-choose-rattachement-type-modal',
  templateUrl: './choose-rattachement-type-modal.component.html',
  styleUrls: ['./choose-rattachement-type-modal.component.scss'],
})
export class ChooseRattachementTypeModalComponent implements OnInit {
  @Input() phoneNumber: string;
  typeRattachement = "CIN";
  constructor(private modCtrl: ModalController) { }

  ngOnInit() {}

  confirmChoice() {    
    this.modCtrl.dismiss({
      typeRattachment: this.typeRattachement
    })
  }

  goBack() {
    this.modCtrl.dismiss({
      direction: "BACK"
    })
  }

}
