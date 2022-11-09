import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { OffreService } from 'src/app/models/offre-service.model';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';

@Component({
  selector: 'app-assistance-actions',
  templateUrl: './assistance-actions.component.html',
  styleUrls: ['./assistance-actions.component.scss'],
})
export class AssistanceActionsComponent implements OnInit {
  listActes?: OffreService[] = [];
  acts?: Map<string, OffreService[]> = new Map([]);
  actsStatic: Map<string, any> = new Map([
    [
      'Mobiles',
      [
        {
          act: 'FIBRE_OPTIC',
          description: 'Vérifier mon éligibilité à la fibre optique',
          image: '/assets/images/04-boutons-01-illustrations-04-paiement-marchand.svg',
        },
        {
          act: 'CODE_PUK',
          description: 'Retrouver mon code PUK',
          image: '/assets/images/04-boutons-01-illustrations-03-payer-ma-facture.svg',
        },
        {
          act: 'SET_INTERNET',
          description: 'Paramétrer mon mobile à internet',
          image: '/assets/images/04-boutons-01-illustrations-03-payer-ma-facture.svg',
        },
        {
          act: 'SEDDO_CODE',
          description: 'Changer mon code Seddo',
          image: '/assets/images/04-boutons-01-illustrations-03-payer-ma-facture.svg',
        },
        {
          act: 'SUIVI_DEMANDE',
          description: 'Suivre l’état de ma demande',
          image: '/assets/images/04-boutons-01-illustrations-25-suivi.svg',
        },
        {
          act: 'SEARCH_AGENCY',
          description: 'Retrouver les agences',
          image: '/assets/images/04-boutons-01-illustrations-03-payer-ma-facture.svg',
        },
      ],
    ],
    [
      'Orange Money',
      [
        {
          act: 'TRANSACTION_ERROR',
          description: 'Déclarer une erreur de transaction',
          image: '/assets/images/04-boutons-01-illustrations-03-payer-ma-facture.svg',
        },
        {
          act: 'OUVERTURE_OM_ACCOUNT',
          description: 'Ouvrir un compte Orange Money',
          image: '/assets/images/04-boutons-01-illustrations-03-payer-ma-facture.svg',
        },
        {
          act: 'DEPLAFONNEMENT',
          description: 'Déplafonner mon compte Orange Money',
          image: '/assets/images/04-boutons-01-illustrations-03-payer-ma-facture.svg',
        },
        {
          act: 'CHANGE_PIN_OM',
          description: 'Changer mon code de transaction Orange Money',
          image: '/assets/images/change-pin-om.png',
        },
      ],
    ],
  ]);
  @ViewChild('slides', { static: true }) slides: IonSlides;
  currentSlideIndex = 0;
  displaySearchIcon: boolean = true;
  @ViewChild('searchInput', { static: true }) searchRef;
  constructor(private navController: NavController, private oemLoggingService: OemLoggingService) {}

  ngOnInit() {
    this.listActes = history.state && history.state.listActes ? history.state.listActes : [];
    this.groudActesByCategorie();
  }

  groudActesByCategorie() {
    this.listActes.forEach((a, i) => {
      let cat = a.categorieOffreServices[0];
      if (!cat) {
        cat = { libelle: 'Autres' };
      }

      let catLibelle = cat.libelle;

      if (this.acts.get(catLibelle)) {
        this.acts.set(catLibelle, [...this.acts.get(catLibelle), a]);
        return;
      }

      this.acts.set(catLibelle, [a]);
    });
    this.oemLoggingService.registerEvent('Assistance_actions_affichage_success');
  }

  slideChanged() {
    this.slides.getActiveIndex().then(index => {
      this.currentSlideIndex = index;
    });
  }

  slide(index: number) {
    this.slides.slideTo(index);
  }

  onInputChange($event) {
    const inputvalue = $event.detail.value;
    this.displaySearchIcon = true;
    if (inputvalue) {
      this.navController.navigateForward(['/assistance-hub/search'], {
        state: { listBesoinAides: this.listActes, search: inputvalue },
      });
      this.displaySearchIcon = false;
    }
  }

  onClear(searchInput) {
    const inputValue: string = searchInput.value;
    searchInput.value = inputValue.slice(0, inputValue.length - 1);
  }

  goBack() {
    this.navController.pop();
  }
}
