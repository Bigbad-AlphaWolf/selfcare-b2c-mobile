import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { REGEX_NUMBER } from 'src/shared';
import { ModalController } from '@ionic/angular';
import { ParrainageService } from 'src/app/services/parrainage-service/parrainage.service';

@Component({
  selector: 'app-create-sponsor-form',
  templateUrl: './create-sponsor-form.component.html',
  styleUrls: ['./create-sponsor-form.component.scss']
})
export class CreateSponsorFormComponent implements OnInit {
  form: FormGroup;
  creatingSponsee = false;
  showErrMessage = false;
  showSuccessMessage = false;
  errorMsg: string;
  constructor(
    private fb: FormBuilder,
    public modalController: ModalController,
    private parrainageService: ParrainageService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      sponseeMsisdn: [
        '',
        [Validators.required, Validators.pattern(REGEX_NUMBER)]
      ],
      firstname: ['', [Validators.pattern('[a-zA-Z ]*')]]
    });
  }

  createSponsee() {
    this.showErrMessage = false;
    this.showSuccessMessage = false;
    this.creatingSponsee = true;
    const msisdn = this.form.value.sponseeMsisdn;
    const firstName = this.form.value.firstname;
    this.parrainageService.createSponsee({ msisdn, firstName }).subscribe(
      (res: any) => {
        this.creatingSponsee = false;
        this.showSuccessMessage = true;
        this.form.reset();
        this.closeModal();
      },
      (err: any) => {
        this.creatingSponsee = false;
        this.showErrMessage = true;
        if (err && err.status === 400 && err.error.title) {
          this.errorMsg = err.error.title;
        } else {
          this.errorMsg = 'Une erreur est survenue';
        }
      }
    );
  }

  closeModal() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
