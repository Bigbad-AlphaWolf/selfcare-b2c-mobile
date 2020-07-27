import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonIssuesComponent } from 'src/shared/common-issues/common-issues.component';
import { HelpModalDefaultContent } from 'src/shared';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home-v2',
  templateUrl: './home-v2.page.html',
  styleUrls: ['./home-v2.page.scss'],
})
export class HomeV2Page implements OnInit {
  options: {
    title: string;
    subtitle: string;
    type: 'REGISTER' | 'LOGIN' | 'VISITOR' | 'HELP' | 'FORGOT_PWD';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  }[] = [
    {
      title: "C'est ma première visite",
      subtitle:
        'Je crée mon compte Orange et moi, pour accéder un accès à mon espace',
      type: 'REGISTER',
      url: '/new-registration',
      action: 'REDIRECT',
    },
    {
      title: 'J’ai oublié mon mot de passe',
      subtitle: 'Je le réinitialise pour accéder un accès à mon espace',
      type: 'FORGOT_PWD',
      url: '/forgotten-password',
      action: 'REDIRECT',
    },
    {
      title: "J'ai déja un compte",
      subtitle: 'Je me connecte',
      type: 'LOGIN',
      url: '/login',
      action: 'REDIRECT',
    },
    {
      title: 'J’ai besoin d’aide',
      subtitle: "J'ai des difficultés pour me connecter",
      type: 'HELP',
      url: '',
      action: 'POPUP',
    },
  ];
  constructor(
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  goTo(option: {
    title: string;
    subtitle: string;
    type: 'REGISTER' | 'LOGIN' | 'VISITOR' | 'HELP';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  }) {
    if (option.action === 'REDIRECT') {
      this.router.navigate([option.url]);
    } else if (option.action === 'POPUP') {
      if (option.type === 'HELP') {
        this.openHelpModal(HelpModalDefaultContent);
      }
    }
  }

  async openHelpModal(sheetData?: any) {
    const modal = await this.modalController.create({
      component: CommonIssuesComponent,
      cssClass: 'besoin-daide-modal',
      componentProps: { data: sheetData },
    });
    return await modal.present();
  }
}
