import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';

@Component({
  selector: 'app-assistance-actions',
  templateUrl: './assistance-actions.component.html',
  styleUrls: ['./assistance-actions.component.scss'],
})
export class AssistanceActionsComponent implements OnInit {
  acts: Map<string, any> = new Map([
    [
      'Mobiles',
      [
        {
          act: 'FIBRE_OPTIC',
          description: 'Vérifier mon éligibilité à la fibre optique',
          image:
            '/assets/images/04-boutons-01-illustrations-03-paiement-facture.svg',
        },
        {
          act: 'CODE_PUK',
          description: 'Retrouver mon code PUK',
          image:
            '/assets/images/04-boutons-01-illustrations-03-paiement-facture.svg',
        },
        {
          act: 'SET_INTERNET',
          description: 'Paramétrer mon mobile à internet',
          image:
            '/assets/images/04-boutons-01-illustrations-03-paiement-facture.svg',
        },
        {
          act: 'SEDDO_CODE',
          description: 'Changer mon code Seddo',
          image:
            '/assets/images/04-boutons-01-illustrations-03-paiement-facture.svg',
        },
        {
          act: 'SUIVI_DEMANDE',
          description: 'Suivre l’état de ma demande',
          image:
            '/assets/images/04-boutons-01-illustrations-03-paiement-facture.svg',
        },
        {
          act: 'SEARCH_AGENCY',
          description: 'Retrouver les agences',
          image:
            '/assets/images/04-boutons-01-illustrations-03-paiement-facture.svg',
        },
      ],
    ],
    [
      'Orange Money',
      [
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
        {
          act: 'DEPLAFONNEMENT',
          description: 'Déplafonner mon compte Orange Money',
          image:
            '/assets/images/04-boutons-01-illustrations-03-paiement-facture.svg',
        },
      ],
    ],
  ]);
  @ViewChild('slides') slides: IonSlides;
  currentSlideIndex = 0;
  constructor(private navController: NavController) {}

  ngOnInit() {}

  slideChanged() {
    this.slides.getActiveIndex().then((index) => {
      this.currentSlideIndex = index;
    });
  }

  slide(index: number) {
    this.slides.slideTo(index);
  }

  goBack() {
    this.navController.pop();
  }
}
