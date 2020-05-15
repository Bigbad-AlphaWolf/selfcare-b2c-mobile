import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-no-om-account-modal',
  templateUrl: './no-om-account-modal.component.html',
  styleUrls: ['./no-om-account-modal.component.scss'],
})
export class NoOmAccountModalComponent implements OnInit {

  constructor(private modal: ModalController) { }

  ngOnInit() {}

  process(yesOrNo: boolean){
    this.modal.dismiss({
      'continue': yesOrNo
    })
  }

}
