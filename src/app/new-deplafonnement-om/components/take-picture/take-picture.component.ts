import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import {
  CameraPreview,
  CameraPreviewOptions,
  CameraPreviewPictureOptions,
} from '@ionic-native/camera-preview/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { VisualizePictureModalComponent } from '../visualize-picture-modal/visualize-picture-modal.component';

const cameraPreviewOpts: CameraPreviewOptions = {
  x: 0,
  y: 0,
  width: window.screen.width,
  height: window.screen.height,
  camera: 'rear',
  tapPhoto: true,
  previewDrag: true,
  toBack: true,
  alpha: 1,
};

const pictureOpts: CameraPreviewPictureOptions = {
  width: 1280,
  height: 1280,
  quality: 85,
};

@Component({
  selector: 'app-take-picture',
  templateUrl: './take-picture.component.html',
  styleUrls: ['./take-picture.component.scss'],
})
export class TakePictureComponent implements OnInit {
  picture;
  step: 'recto' | 'verso' | 'selfie';
  stepNumber: number;
  stepDescription: string;

  constructor(
    private cameraPreview: CameraPreview,
    private navController: NavController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.startCamera();
  }

  ionViewWillEnter() {
    this.getCurrentStep();
  }

  switchCamera() {
    cameraPreviewOpts.camera =
      cameraPreviewOpts.camera === 'rear' ? 'front' : 'rear';
    console.log(cameraPreviewOpts);

    this.cameraPreview.stopCamera().then((_) => {
      this.startCamera();
    });
  }

  async previsualizePicture() {
    const modal = await this.modalController.create({
      component: VisualizePictureModalComponent,
      cssClass: 'previsualize-picture-modal',
      componentProps: { base64Img: this.picture },
    });
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data && resp.data.accepted) {
        this.returnPicture();
      }
    });
    return await modal.present();
  }

  getCurrentStep() {
    this.step = history.state.step;
    switch (this.step) {
      case 'recto':
        this.stepNumber = 1;
        this.stepDescription = `Placez le recto de votre carte sur le rectangle violet puis appuyer sur “Capturer”`;
        break;
      case 'verso':
        this.stepNumber = 2;
        this.stepDescription = `Placez le verso de votre carte sur le rectangle violet puis appuyer sur “Capturer”`;
        break;
      case 'selfie':
        this.stepNumber = 3;
        this.stepDescription = `Prenez vous en selfie`;
        break;
      default:
        break;
    }
  }

  startCamera() {
    this.cameraPreview
      .startCamera(cameraPreviewOpts)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  takePicture() {
    this.cameraPreview.takePicture(pictureOpts).then(
      (imageData) => {
        this.picture = 'data:image/jpeg;base64,' + imageData;
        this.previsualizePicture();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  returnPicture() {
    this.navController.navigateBack('/new-deplafonnement-om', {
      state: {
        image: this.picture,
        step: this.step,
      },
    });
  }

  goBack() {
    this.navController.navigateBack('/new-deplafonnement-om');
  }
}
