import { Component, OnInit } from '@angular/core';

import {
  CameraPreview,
  CameraPreviewOptions,
  CameraPreviewPictureOptions,
} from '@ionic-native/camera-preview/ngx';
import { NavController } from '@ionic/angular';

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
  tapFocus: true
};

const pictureOpts: CameraPreviewPictureOptions = {
  width: 1280,
  height: 1280,
  quality: 85
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
    private navController: NavController
  ) {}

  ngOnInit() {
    this.startCamera();
  }

  ionViewWillEnter() {
    this.getCurrentStep();
  }

  ionViewWillLeave() {
    this.getCurrentStep();
    this.stopCamera()
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
    const cameraOption = cameraPreviewOpts;
    if (this.step === 'selfie') {
      cameraOption.camera = 'front'
    }
    this.cameraPreview
      .startCamera(cameraPreviewOpts)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  stopCamera() {
    this.cameraPreview.stopCamera().then().catch((err) => {
      console.log(err);
    })
  }

  takePicture() {
    this.cameraPreview.takePicture(pictureOpts).then(
      (imageData) => {
        this.picture = 'data:image/jpeg;base64,' + imageData;
        this.cameraPreview.stopCamera();
        // this.crop.crop(this.picture, {quality: 75}).then(
        //   newImage => console.log('new image path is: ' + newImage),
        //    error => console.error('Error cropping image', error)
        // );
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
