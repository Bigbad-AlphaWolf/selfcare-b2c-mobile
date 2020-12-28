import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-orange-money-pin',
  templateUrl: './change-orange-money-pin.page.html',
  styleUrls: ['./change-orange-money-pin.page.scss'],
})
export class ChangeOrangeMoneyPinPage implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  goBack() {}

  changePinOM() {}
}
