import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { FORGOT_PWD_PAGE_URL } from 'src/shared';
import { OemLoggingService } from '../services/oem-logging/oem-logging.service';
const ORANGE_HOME_PAGE_URL = 'http://orange.sn';
declare var FollowAnalytics: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    loop: true,
    zoom: false,
  };

  slides = [
    {
      imageSrc: '/assets/images/new-boarding-1.png',
      text: 'Dalal ak Jam ci<br/> Orange et moi',
      description: `L’application pour gérer vos offres internet et mobile facilement depuis votre mobile.`,
    },
    {
      imageSrc: '/assets/images/new-boarding-2.png',
      text: 'Suivre ma <br />consommation',
      description: `Consultez vos soldes en temps réel (Crédit, internet, Orange Money et Sargal)`,
    },
    {
      imageSrc: '/assets/images/new-boarding-3.png',
      text: 'Acheter du crédit <br /> et des pass',
      description: `Retrouvez vos pass internet et illimix préférés et profitez des promos`,
    },
    {
      imageSrc: '/assets/images/new-boarding-4.png',
      text: `Transférer de <br/> l’argent`,
      description: `Effectuez toutes vos opérations de transferts d’argent sans vous déplacer`,
    },
    {
      imageSrc: '/assets/images/new-boarding-3.png',
      text: 'Payer vos <br />factures',
      description: `Consultez et payer toutes vos factures en un seul lieu et en toute sécurité`,
    },
  ];

  currentIndex;

  constructor(private router: Router, private oemLogging: OemLoggingService) {
    if (typeof FollowAnalytics !== 'undefined') {
      FollowAnalytics.logEvent('Home', 'success');
    }
  }

  ngOnInit() {}

  goToLoginPage() {
    this.oemLogging.registerEvent('home_login_click', []);
    this.router.navigate(['/login']);
  }

  goToRegistrationPage() {
    this.oemLogging.registerEvent('home_direct_access_click', []);
    this.router.navigate(['/new-registration']);
  }

  goToOrangeHomePage() {
    window.location.href = ORANGE_HOME_PAGE_URL;
  }

  forgotPwd() {
    this.oemLogging.registerEvent('home_reset_password_click', []);
    this.router.navigate([FORGOT_PWD_PAGE_URL]);
  }
}
