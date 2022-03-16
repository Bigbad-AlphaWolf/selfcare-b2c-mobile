import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as SecureLS from 'secure-ls';
import { FACE_ID_OM_INFOS, OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-face-id-request-modal',
  templateUrl: './face-id-request-modal.component.html',
  styleUrls: ['./face-id-request-modal.component.scss'],
})
export class FaceIdRequestModalComponent implements OnInit {

  @Input() operationData;

  constructor(private omService: OrangeMoneyService, private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.operationData);
    
  }

  allowFaceId() {
    this.omService.allowFaceId();
    ls.set(FACE_ID_OM_INFOS, this.operationData)
    this.modalController.dismiss()
  }

  denyFaceId() {
    this.omService.denyFaceId();
    this.modalController.dismiss()
  }

  askLaterFaceId() {
    this.omService.askFaceIdLater();
    this.modalController.dismiss()
  }

}
