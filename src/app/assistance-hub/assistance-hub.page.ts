import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { FIND_AGENCE_EXTERNAL_URL, ItemBesoinAide } from 'src/shared';
import { AssistanceService } from '../services/assistance.service';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { ContactIbouModalComponent } from './components/contact-ibou-modal/contact-ibou-modal.component';

@Component({
  selector: 'app-assistance-hub',
  templateUrl: './assistance-hub.page.html',
  styleUrls: ['./assistance-hub.page.scss'],
})
export class AssistanceHubPage implements OnInit {
  slideOpts = {
    speed: 400,
    slidesPerView: 1.14,
    slideShadows: true,
    loop: true,
  };
  fastActions = [
    {
      act: 'DEPLAFONNEMENT',
      description: 'Déplafonner mon compte Orange Money',
      image:
        '/assets/images/04-boutons-01-illustrations-03-paiement-facture.svg',
    },
    {
      act: 'TRANSACTION_ERROR',
      description: 'Déclarer une erreur de transaction',
      image:
        '/assets/images/04-boutons-01-illustrations-03-paiement-facture.svg',
    },
    {
      act: 'OUVERTURE_OM_ACCOUNT',
      description: 'Ouvrir un compte Orange Money',
      image:
        '/assets/images/04-boutons-01-illustrations-03-paiement-facture.svg',
    },
  ];
  moreActions = [
    {
      act: 'IBOU_CONTACT',
      description: 'Contacter votre assistant Ibou',
      image:
        '/assets/images/04-boutons-01-illustrations-21-ibou-assistance.png',
    },
    {
      act: 'AGENCE_LOCATOR',
      description: 'Trouver l’agence la plus proche',
      image: '/assets/images/04-boutons-01-illustrations-22-store-locator.svg',
    },
  ];
  listQuestions: ItemBesoinAide[];
  loadingFAQ: boolean;
  constructor(
    private assistanceService: AssistanceService,
    private router: Router,
    private navController: NavController,
    private inAppBrowser: InAppBrowser,
    private followAnalyticsService: FollowAnalyticsService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getFAQ();
  }

  getFAQ() {
    this.loadingFAQ = true;
    this.assistanceService.getFAQ().subscribe(
      (res) => {
        this.listQuestions = res;
        this.loadingFAQ = false;
      },
      (err) => {
        this.loadingFAQ = false;
      }
    );
  }

  goAllActionsHub() {
    this.router.navigate(['/assistance-hub/actions']);
  }

  goAllQuestionsHub() {
    this.router.navigate(['/assistance-hub/questions']);
  }

  goBack() {
    this.navController.pop();
  }

  goFindToAgenceWebSite() {
    this.inAppBrowser.create(FIND_AGENCE_EXTERNAL_URL, '_self');
    this.followAnalyticsService.registerEventFollow(
      'Trouver_agence_orange',
      'event',
      'clicked'
    );
  }

  goFastAction(action) {
    switch (action.act) {
      case 'IBOU_CONTACT':
        this.openIbouContactModal();
        break;
      case 'AGENCE_LOCATOR':
        this.goFindToAgenceWebSite();
        break;
    }
  }

  async openIbouContactModal() {
    const modal = await this.modalController.create({
      component: ContactIbouModalComponent,
      cssClass: 'select-recipient-modal',
    });
    modal.onDidDismiss().then((resp) => {});
    return await modal.present();
  }
}
