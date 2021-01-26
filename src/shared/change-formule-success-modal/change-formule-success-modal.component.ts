import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-change-formule-success-modal',
  templateUrl: './change-formule-success-modal.component.html',
  styleUrls: ['./change-formule-success-modal.component.scss'],
})
export class ChangeFormuleSuccessModalComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
    this.router.navigate(['/dashboard']);
  }
}
