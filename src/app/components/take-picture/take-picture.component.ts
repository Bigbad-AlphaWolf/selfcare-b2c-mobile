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
  operation: 'OUVERTURE' | 'ANNULATION_TRANSFERT' = 'OUVERTURE';
  nbreSteps = 3;
  constructor(
    private cameraPreview: CameraPreview,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.startCamera();
  }

  ionViewWillEnter() {
    this.getCurrentStep();
    this.getNbreStep();
  }

  ionViewWillLeave() {
    this.getCurrentStep();
    this.stopCamera()
  }

  switchCamera() {
    this.cameraPreview.switchCamera();
  }

  getNbreStep() {
    if(history.state.operation) {
      this.operation = history.state.operation;
      this.nbreSteps = this.operation === 'OUVERTURE' ? 3 : 2;
    }
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
      .startCamera(cameraOption)
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
        this.picture = 'data:image/png;base64,' + imageData;
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
    const previousUrl = this.operation === 'OUVERTURE' ? '/new-deplafonnement-om' : '/cancel-transaction-om';
    this.navController.navigateBack(previousUrl, {
      state: {
        image: this.picture,
        step: this.step,
      },
    });
  }

  goBack() {
    const previousUrl = this.operation === 'OUVERTURE' ? '/new-deplafonnement-om' : '/cancel-transaction-om';
    this.navController.navigateBack(previousUrl);
  }
}
