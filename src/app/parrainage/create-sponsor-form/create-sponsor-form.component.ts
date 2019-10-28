import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { REGEX_NUMBER } from 'src/shared';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-sponsor-form',
  templateUrl: './create-sponsor-form.component.html',
  styleUrls: ['./create-sponsor-form.component.scss']
})
export class CreateSponsorFormComponent implements OnInit {
  form: FormGroup;
  creatingSponsee = false;
  showErrMessage = false;
  errorMsg: string;
  constructor(
    private fb: FormBuilder,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      sponseeMsisdn: [
        '',
        [Validators.required, Validators.pattern(REGEX_NUMBER)]
      ],
      firstname: ['', [Validators.pattern('[a-zA-Z ]*')]],
      lastname: ['', [Validators.pattern('[a-zA-Z ]*')]]
    });
  }

  createSponsee() {
    this.creatingSponsee = true;
  }

  closeModal() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
