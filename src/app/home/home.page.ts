import {
  NativePageTransitions,
  NativeTransitionOptions,
} from '@ionic-native/native-page-transitions/ngx';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
const ORANGE_HOME_PAGE_URL = 'http://orange.sn';
declare var FollowAnalytics: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    loop: true,
    zoom: false,
  };

  slides = [
    {
      imageSrc: '/assets/images/1.png',
      text:
        '<span>Dalal ak Jam <br/> Ci </span> <span class="scb-text-orange">Orange</span>',
    },
    {
      imageSrc: '/assets/images/2.png',
      text:
        '<span>Suivre ma </span> <br /><span class="scb-text-blue">conso</span>',
    },
    {
      imageSrc: '/assets/images/3.png',
      text:
        '<span>Contacter </span> <br /> <span class="scb-text-green">l’assistance</span>',
    },
    {
      imageSrc: '/assets/images/4.png',
      text:
        'Acheter du <span class="scb-text-purple">crédit</span> <br/> et des <span class="scb-text-purple">pass</span>',
    },
    {
      imageSrc: '/assets/images/5.png',
      text:
        '<span>Gérer mes </span> <br /><span class="scb-text-yellow">offres</span>',
    },
  ];

  currentIndex;

  constructor(
    private router: Router,
    private nativePageTransition: NativePageTransitions
  ) {
    if (typeof FollowAnalytics !== 'undefined') {
      FollowAnalytics.logEvent('Home', 'success');
    }
  }

  ngOnInit() {
    //  this.open();
  }

  goToLoginPage() {
    this.nativePageTransition.fade(null);
    this.router.navigate(['/login']);
  }

  goToRegistrationPage() {
    this.nativePageTransition.fade(null);
    this.router.navigate(['/register']);
  }

  goToOrangeHomePage() {
    window.location.href = ORANGE_HOME_PAGE_URL;
  }
}
