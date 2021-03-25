import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-simple-operation-success-modal',
  templateUrl: './simple-operation-success-modal.component.html',
  styleUrls: ['./simple-operation-success-modal.component.scss'],
})
export class SimpleOperationSuccessModalComponent implements OnInit {
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
