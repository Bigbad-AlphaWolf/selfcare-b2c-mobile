import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';

@Component({
  selector: 'app-new-deplafonnement-om',
  templateUrl: './new-deplafonnement-om.page.html',
  styleUrls: ['./new-deplafonnement-om.page.scss'],
})
export class NewDeplafonnementOmPage implements OnInit {
  personalInfosForm: FormGroup;
  identityForm: FormGroup;
  rectoFilled: boolean;
  versoFilled: boolean;
  selfieFilled: boolean;
  acceptCGU: boolean;
  omMsisdn: string;
  gettingOmNumber: boolean;
  getMsisdnHasError: boolean;
  @ViewChild('selectCivility') selectCivility: ElementRef;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private orangeMoneyService: OrangeMoneyService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.initForms();
    this.getOmMsisdn();
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
      },
      (err) => {
        this.getMsisdnHasError = true;
      }
    );
  }

  openPinpad() {}

  chooseCivility() {
    this.selectCivility.nativeElement.click();
  }

  ionViewWillEnter() {
    const image = history.state;
    console.log(image);
  }

  goBack() {
    this.navController.pop();
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
    });
  }

  toggleAcceptCGU() {
    this.acceptCGU = !this.acceptCGU;
  }

  takePicture(step?: 'recto' | 'verso' | 'selfie') {
    this.router.navigate(['new-deplafonnement-om/take-picture'], {
      state: { step },
    });
  }
}
