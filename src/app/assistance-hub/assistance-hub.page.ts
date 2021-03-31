import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { FIND_AGENCE_EXTERNAL_URL } from 'src/shared';
import { BesoinAideType } from '../models/enums/besoin-aide-type.enum';
import { OffreService } from '../models/offre-service.model';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { OperationService } from '../services/oem-operation/operation.service';

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
  listBesoinAides: OffreService[];
  listFaqs?: OffreService[];
  listActes?: OffreService[];
  loadingHelpItems: boolean;
  displaySearchIcon: boolean = true;
  @ViewChild('searchInput') searchRef;
  constructor(
    private operationService: OperationService,
    private router: Router,
    private navController: NavController,
    private inAppBrowser: InAppBrowser,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.fetchAllHelpItems();
  }

  ionViewDidEnter() {
    this.searchRef.value = '';
  }

  fetchAllHelpItems() {
    this.loadingHelpItems = true;
    this.operationService.getServicesByFormule(null, true).subscribe(
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

  splitHelpItemsByType() {
    this.listActes = this.listBesoinAides.filter((item: OffreService) => {
      return item.typeService === BesoinAideType.ACTE;
    });
    this.listFaqs = this.listBesoinAides.filter((item: OffreService) => {
      return item.typeService === BesoinAideType.FAQ;
    });
  }

  goAllActionsHub() {
    this.router.navigate(['/assistance-hub/actions'], {
      state: { listActes: this.listActes },
    });
  }

  goAllQuestionsHub() {
    this.router.navigate(['/assistance-hub/questions'], {
      state: { listFaqs: this.listFaqs },
    });
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

  onInputChange($event) {
    const inputvalue = $event.detail.value;
    this.displaySearchIcon = true;
    if (inputvalue) {
      this.navController.navigateForward(['/assistance-hub/search'], {
        state: { listBesoinAides: this.listBesoinAides, search: inputvalue },
      });
      this.displaySearchIcon = false;
    }
  }

  onClear(searchInput) {
    const inputValue: string = searchInput.value;
    searchInput.value = inputValue.slice(0, inputValue.length - 1);
  }
}
