import { Component, EventEmitter, OnInit, Output } from '@angular/core';

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
  @Output() goback = new EventEmitter();

  constructor(
    private cameraPreview: CameraPreview,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.startCamera();
  }

  ionViewWillEnter() {
    this.step = history.state.step;
    console.log(this.step);
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
        this.goBack();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  goBack() {
    this.navController.navigateBack('/new-deplafonnement-om', {
      state: {
        image: this.picture,
        step: this.step,
      },
    });
  }
}
