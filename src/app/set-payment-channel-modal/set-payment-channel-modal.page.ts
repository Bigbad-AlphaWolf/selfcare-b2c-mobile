import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DashboardService } from '../services/dashboard-service/dashboard.service';

@Component({
  selector: 'set-payment-channel-modal',
  templateUrl: './set-payment-channel-modal.page.html',
  styleUrls: ['./set-payment-channel-modal.page.scss'],
})
export class SetPaymentChannelModalPage implements OnInit {
  @Input() pass;
  selectedPaymentChannel: 'CREDIT' | 'ORANGE_MONEY';
  soldeCredit;

  constructor(
    public modalController: ModalController,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.getUserConsommations();
  }

  setPaymentChannel(channel: 'CREDIT' | 'ORANGE_MONEY') {
    this.selectedPaymentChannel = channel;
  }

  validateChannel() {
    this.modalController.dismiss({
      paymentMod: this.selectedPaymentChannel,
    });
  }

  getUserConsommations() {
    this.dashboardService.getUserConsoInfosByCode().subscribe(
      (res: any[]) => {
        const appelConso = res.find((x) => x.categorie === 'APPEL');
        this.soldeCredit = appelConso.consommations.find(
          (x) => x.code === 1
        ).montant;
      },
      (err) => {}
    );
  }
}
