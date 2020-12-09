import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-set-recipient-names-modal',
  templateUrl: './set-recipient-names-modal.component.html',
  styleUrls: ['./set-recipient-names-modal.component.scss'],
})
export class SetRecipientNamesModalComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      recipientFirstname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('[a-zA-Z ]*'),
        ],
      ],
      recipientLastname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('[a-zA-Z ]*'),
        ],
      ],
    });
  }

  continue() {
    this.modalController.dismiss(this.form.value);
  }

  close() {
    this.modalController.dismiss();
  }
}
