import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Contact, IContactField } from '@ionic-native/contacts';

@Component({
  selector: 'app-select-number-popup',
  templateUrl: './select-number-popup.component.html',
  styleUrls: ['./select-number-popup.component.scss']
})
export class SelectNumberPopupComponent implements OnInit {
  form: FormGroup;
  selectedNumber: string;
  constructor(
    public dialogRef: MatDialogRef<SelectNumberPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      gender: ['', [Validators.required]]
    });
  }

  selectNumber(phoneNumber: string) {
    this.selectedNumber = phoneNumber;
  }

  validateNumber() {
    this.dialogRef.close(this.selectedNumber);
  }
}
