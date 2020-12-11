import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ItemBesoinAide } from 'src/shared';
import { AssistanceService } from '../services/assistance.service';

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
    private navController: NavController
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
}
