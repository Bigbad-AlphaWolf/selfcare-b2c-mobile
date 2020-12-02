import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DalalTonesModel } from 'src/app/models/dalal-tones.model';
import { downloadAvatarEndpoint } from 'src/app/services/dashboard-service/dashboard.service';

@Component({
  selector: 'app-dalal-activation-success-modal',
  templateUrl: './dalal-activation-success-modal.component.html',
  styleUrls: ['./dalal-activation-success-modal.component.scss'],
})
export class DalalActivationSuccessModalComponent implements OnInit {
  @Input() choosenDalal: DalalTonesModel;
  downloadAvatarEndpoint = downloadAvatarEndpoint;
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
