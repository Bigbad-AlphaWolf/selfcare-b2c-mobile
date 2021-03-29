import { Component, OnInit } from '@angular/core';

import {
  CameraPreview,
  CameraPreviewOptions,
  CameraPreviewPictureOptions,
} from '@ionic-native/camera-preview/ngx';
import { ModalController, NavController } from '@ionic/angular';

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
    this.cameraPreview.switchCamera();
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
        this.cameraPreview.stopCamera();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  retry() {
    this.picture = null;
    this.startCamera();
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
