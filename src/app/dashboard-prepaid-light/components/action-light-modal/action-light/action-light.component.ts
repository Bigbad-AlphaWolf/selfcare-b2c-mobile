import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-action-light',
  templateUrl: './action-light.component.html',
  styleUrls: ['./action-light.component.scss'],
})
export class ActionLightComponent implements OnInit {
  constructor(
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  goLogin() {
    this.modalController.dismiss();
    this.router.navigate(['/login']);
  }

  goRegister() {
    this.modalController.dismiss();
    this.router.navigate(['/new-registration']);
  }
}
