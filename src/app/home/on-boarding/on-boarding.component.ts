import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrls: ['./on-boarding.component.scss']
})
export class OnBoardingComponent implements OnInit {
  @ViewChild('sliders') sliders: IonSlides;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    loop: false,
    zoom: false
  };

  slides = [
    {
      imageSrc: '/assets/images/onboarding1.png',
      title: 'Dalal ak jam ci Orange et moi',
      text:
        'L’application pour gérer vos offres internet et mobile, vous dépanner ou nous contacter, facilement depuis votre mobile.'
    },
    {
      imageSrc: '/assets/images/onboarding2.png',
      title: 'Suivez votre consommation',
      text:
        'L’application pour gérer vos offres internet et mobile, vous dépanner ou nous contacter, facilement depuis votre mobile.'
    },
    {
      imageSrc: '/assets/images/onboarding3.png',
      title: 'Achetez du crédit et des pass',
      text:
        'L’application pour gérer vos offres internet et mobile, vous dépanner ou nous contacter, facilement depuis votre mobile.'
    },
    {
      imageSrc: '/assets/images/onboarding4.png',
      title: 'Contactez l’assistance',
      text:
        'L’application pour gérer vos offres internet et mobile, vous dépanner ou nous contacter, facilement depuis votre mobile.'
    }
  ];
  currentSlideIndex: number;
  endOfSlide = false;
  constructor(private router: Router) {
    this.currentSlideIndex = 0;
  }

  ngOnInit() {}

  slideChanged() {
    this.sliders.getActiveIndex().then(index => {
      if (index === 0) {
        this.currentSlideIndex = 0;
      } else {
        this.currentSlideIndex = index;
      }
    });
  }
  next() {
    this.sliders.slideNext();
  }
  goToCheckNumberPage() {
    this.router.navigate(['/check-number']);
  }
}
