import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { TypeOtpModalComponent } from './components/type-otp-modal/type-otp-modal.component';
import { VisualizePictureModalComponent } from './components/visualize-picture-modal/visualize-picture-modal.component';

@Component({
  selector: 'app-new-deplafonnement-om',
  templateUrl: './new-deplafonnement-om.page.html',
  styleUrls: ['./new-deplafonnement-om.page.scss'],
})
export class NewDeplafonnementOmPage implements OnInit {
  personalInfosForm: FormGroup;
  identityForm: FormGroup;
  rectoFilled: boolean;
  rectoImage: any;
  rectoFileName = 'recto.jpg';
  versoFilled: boolean;
  versoImage: any;
  versoFileName = 'verso.jpg';
  selfieFilled: boolean;
  selfieImage: any;
  selfieFileName = 'selfie.jpg';
  acceptCGU: boolean;
  omMsisdn: string;
  gettingOmNumber: boolean;
  getMsisdnHasError: boolean;
  checkingStatus: boolean;
  userOmStatus: any;
  checkStatusError: boolean;
  omMessage: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private orangeMoneyService: OrangeMoneyService,
    private navController: NavController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.initForms();
    this.checkStatus();
    this.getOmMsisdn();
  }

  ionViewWillEnter() {
    this.getStepImage();
  }

  initForms() {
    this.personalInfosForm = this.formBuilder.group({
      civility: [null, [Validators.required]],
      lastname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      birthdate: [null, [Validators.required]],
    });
    this.identityForm = this.formBuilder.group({
      nIdentity: [null, [Validators.required]],
      identityType: [[Validators.required]],
    });
  }

  checkStatus() {
    this.checkingStatus = true;
    this.checkStatusError = false;
    this.orangeMoneyService.getUserStatus().subscribe(
      (status) => {
        this.omMsisdn = status.omNumber;
        this.omMessage = status.status_wording;
        this.userOmStatus = status.content.data;
        this.checkingStatus = true;
      },
      (err) => {
        this.checkingStatus = false;
        if (err === 'NO_OM_ACCOUNT') this.openPinpad();
        this.checkStatusError = true;
      }
    );
  }

  getOmMsisdn() {
    this.getMsisdnHasError = false;
    this.gettingOmNumber = true;
    this.orangeMoneyService.getOmMsisdn().subscribe(
      (msisdn: string) => {
        this.gettingOmNumber = false;
        if (msisdn.match('error')) {
          this.openPinpad();
          this.getMsisdnHasError = true;
        } else {
          this.omMsisdn = msisdn;
        }
        console.log(this.omMsisdn, !this.omMsisdn);
      },
      (err) => {
        this.getMsisdnHasError = true;
      }
    );
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
    });
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data && resp.data.success) {
        this.getOmMsisdn();
      }
    });
    return await modal.present();
  }

  getStepImage() {
    const state = history.state;
    const step = state ? state.step : null;
    switch (step) {
      case 'recto':
        this.rectoFilled = true;
        this.rectoImage = state.image;
        break;
      case 'verso':
        this.versoFilled = true;
        this.versoImage = state.image;
        break;
      case 'selfie':
        this.selfieFilled = true;
        this.selfieImage = state.image;
        break;
      default:
        break;
    }
  }

  generateOtp() {}

  async openTypeOtpModal() {
    const modal = await this.modalController.create({
      component: TypeOtpModalComponent,
      cssClass: 'select-recipient-modal',
    });
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data && resp.data.accept) {
        this.openSuccessModal();
      }
    });
    return await modal.present();
  }

  openSuccessModal() {}

  goBack() {
    this.navController.pop();
  }

  toggleAcceptCGU() {
    this.acceptCGU = !this.acceptCGU;
  }

  takePicture(step?: 'recto' | 'verso' | 'selfie') {
    this.router.navigate(['new-deplafonnement-om/take-picture'], {
      state: { step },
    });
  }

  removePicture(step: 'recto' | 'verso' | 'selfie') {
    switch (step) {
      case 'recto':
        this.rectoFilled = false;
        this.rectoImage = null;
        break;
      case 'verso':
        this.versoFilled = false;
        this.versoImage = null;
        break;
      case 'selfie':
        this.selfieFilled = false;
        this.selfieImage = null;
        break;
      default:
        break;
    }
  }
}
