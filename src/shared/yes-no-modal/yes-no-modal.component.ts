import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OPERATION_CONFIRM_DELETE_RATTACH_NUMBER } from '..';

@Component({
  selector: 'app-yes-no-modal',
  templateUrl: './yes-no-modal.component.html',
  styleUrls: ['./yes-no-modal.component.scss'],
})
export class YesNoModalComponent implements OnInit {
  @Input() typeModal: string;
  @Input() numero: string;
  OPERATION_CONFIRM_DELETE_RATTACH_NUMBER = OPERATION_CONFIRM_DELETE_RATTACH_NUMBER;
  constructor(private modal: ModalController) { }

  ngOnInit() {}

  process(yesOrNo: boolean){
    this.modal.dismiss({
      'continue': yesOrNo
    })
  }

}
