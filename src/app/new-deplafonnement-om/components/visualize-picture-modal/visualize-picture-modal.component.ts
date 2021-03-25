import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-visualize-picture-modal',
  templateUrl: './visualize-picture-modal.component.html',
  styleUrls: ['./visualize-picture-modal.component.scss'],
})
export class VisualizePictureModalComponent implements OnInit {
  @Input() base64Img = '';

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close(accepted?: boolean) {
    this.modalController.dismiss({ accepted });
  }
}
