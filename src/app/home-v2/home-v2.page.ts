import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonIssuesComponent } from 'src/shared/common-issues/common-issues.component';
import {
  HelpModalDefaultContent,
  JAMONO_PRO_CODE_FORMULE,
  SubscriptionModel,
} from 'src/shared';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import {
  AuthenticationService,
  ConfirmMsisdnModel,
} from '../services/authentication-service/authentication.service';
import { UuidService } from '../services/uuid-service/uuid.service';
import { PROFILE_TYPE_POSTPAID } from '../dashboard';
import * as SecureLS from 'secure-ls';
const ls = new SecureLS({ encodingType: 'aes' });
@Component({
  selector: 'app-home-v2',
  templateUrl: './home-v2.page.html',
  styleUrls: ['./home-v2.page.scss'],
})
export class HomeV2Page implements OnInit {
  getMsisdnSubscription: Subscription;
  confirmMsisdnSubscription: Subscription;
  loginSubscription: Subscription;
  msisdn: string;
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
  lightAccessItem: {
    title: string;
    subtitle: string;
    type: 'REGISTER' | 'LOGIN' | 'VISITOR' | 'HELP';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  } = {
    title: 'Accèder sans créer de compte',
    subtitle: 'Accès visiteurs, avec un accés limité aux fonctionnalités',
    type: 'VISITOR',
    url: '',
    action: 'REDIRECT',
  };
  constructor(
    private router: Router,
    private modalController: ModalController,
    private uuidService: UuidService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.getUserMsisdn();
  }

  goTo(option: {
    title: string;
    subtitle: string;
    type: 'REGISTER' | 'LOGIN' | 'VISITOR' | 'HELP';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  }) {
    if (option.action === 'REDIRECT') {
      if (option.type === 'VISITOR') {
        if (this.msisdn) this.router.navigate(['/dashboard-prepaid-light']);
      } else {
        this.router.navigate([option.url]);
      }
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

  getUserMsisdn() {
    const uuid = this.uuidService.getUuid();
    this.getMsisdnSubscription = this.authenticationService
      .getMsisdnByNetwork()
      .subscribe((res: { msisdn: string }) => {
        const msisdn = res.msisdn;
        this.confirmMsisdnSubscription = this.authenticationService
          .confirmMsisdnByNetwork(msisdn)
          .subscribe((response: ConfirmMsisdnModel) => {
            if (response.status) {
              this.authenticationService.setHmacOnLs(response.hmac);
              this.msisdn =
                response.msisdn && response.msisdn.startsWith('221')
                  ? response.msisdn.substring(3)
                  : response.msisdn;
              this.loginAnonymAccount();
            }
          });
      });
  }

  loginAnonymAccount() {
    this.loginSubscription = this.authenticationService
      .getTokenFromBackend()
      .subscribe((res) => {
        ls.set('light_token', res.access_token);
        this.authenticationService
          .getSubscriptionForTiers(this.msisdn)
          .subscribe((sub: SubscriptionModel) => {
            const profile = sub.profil;
            const code = sub.code;
            console.log(sub);
            ls.set('currentPhoneNumber', this.msisdn);
            if (
              profile !== PROFILE_TYPE_POSTPAID &&
              code !== JAMONO_PRO_CODE_FORMULE
            ) {
              this.options.splice(1, 0, this.lightAccessItem);
            }
          });
      });
  }
}
