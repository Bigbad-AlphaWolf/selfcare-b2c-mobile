import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { ScrollVanishDirective } from '../directives/scroll-vanish/scroll-vanish.directive';

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
    spaceBetween: 20,
  };
  @ViewChild('slides') sliders: IonSlides;
  @ViewChildren(ScrollVanishDirective) dir;

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

  search() {
    this.dir.first.show();
  }
}
