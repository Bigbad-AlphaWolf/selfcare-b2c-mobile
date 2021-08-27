import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-new-suivi-conso',
  templateUrl: './new-suivi-conso.page.html',
  styleUrls: ['./new-suivi-conso.page.scss'],
})
export class NewSuiviConsoPage implements OnInit {
  tabs = [
    { label: 'Ma conso' },
    { label: 'Mes communications' },
    { label: 'Mes souscriptions' },
  ];
  currentSlideIndex = 0;
  slideOpts = {
    speed: 400,
    slideShadows: true,
  };
  @ViewChild('slides') sliders: IonSlides;

  constructor() {}

  ngOnInit() {}

  setSlidesIndex(index) {
    this.sliders.slideTo(index);
  }

  getCurrentSlide() {
    this.sliders.getActiveIndex().then((index) => {
      this.currentSlideIndex = index;
    });
  }
}
