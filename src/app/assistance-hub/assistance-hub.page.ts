import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { FIND_AGENCE_EXTERNAL_URL, ItemBesoinAide } from 'src/shared';
import { BesoinAideType } from '../models/enums/besoin-aide-type.enum';
import { AssistanceService } from '../services/assistance.service';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';

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
        '/assets/images/04-boutons-01-illustrations-03-payer-ma-facture.svg',
    },
    {
      act: 'TRANSACTION_ERROR',
      description: 'Déclarer une erreur de transaction',
      image:
        '/assets/images/04-boutons-01-illustrations-03-payer-ma-facture.svg',
    },
    {
      act: 'FIBRE_OPTIC',
      description: 'Vérifier mon éligibilité à la fibre optique',
      image:
        '/assets/images/04-boutons-01-illustrations-04-paiement-marchand.svg',
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
  listBesoinAides: ItemBesoinAide[];
  listFaqs?: ItemBesoinAide[];
  listActes?: ItemBesoinAide[];
  loadingHelpItems: boolean;
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
    this.fetchAllHelpItems();
  }

  fetchAllHelpItems() {
    this.loadingHelpItems = true;
    this.assistanceService.fetchHelpItems(
      {
        page: 0,
        size: 1000000,
        sort: ['type,asc', 'priorite,asc', 'id']
      }
    ).subscribe(
      (res) => {
        this.listBesoinAides = res;
        this.loadingHelpItems = false;
        this.splitHelpItemsByType();
      },
      (err) => {
        this.loadingHelpItems = false;
      }
    );
  }

  splitHelpItemsByType(){
    const firtFaqIndex = this.listBesoinAides.map((i)=>i.type).indexOf(BesoinAideType.FAQ);
    this.listActes = this.listBesoinAides.slice(0,firtFaqIndex);
    this.listFaqs = this.listBesoinAides.slice(firtFaqIndex);
  }

  goAllActionsHub() {
    this.router.navigate(['/assistance-hub/actions'],{state:{listActes:this.listActes}});
  }

  goAllQuestionsHub() {
    this.router.navigate(['/assistance-hub/questions'],{state:{listFaqs:this.listFaqs}});
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
        this.goIbouContactPage();
        break;
      case 'AGENCE_LOCATOR':
        this.goFindToAgenceWebSite();
        break;
    }
  }

  async goIbouContactPage() {
    this.router.navigate(['/contact-ibou-hub']);
  }
}
