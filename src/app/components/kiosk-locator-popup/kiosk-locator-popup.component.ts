import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';

@Component({
  selector: 'app-kiosk-locator-popup',
  templateUrl: './kiosk-locator-popup.component.html',
  styleUrls: ['./kiosk-locator-popup.component.scss'],
})
export class KioskLocatorPopupComponent implements OnInit {
  constructor(private router: Router, private oemLoggingService: OemLoggingService, private modalController: ModalController) {}

  ngOnInit() {}

  continue() {
    this.modalController.dismiss();
    this.oemLoggingService.registerEvent('Kiosk_locator_opened');
    this.router.navigate(['kiosk-locator']);
  }
}
