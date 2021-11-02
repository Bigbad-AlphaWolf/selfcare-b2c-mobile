import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { ModalController } from '@ionic/angular';
import {Story} from 'src/app/models/story-oem.model';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-visualize-stories-by-categories',
  templateUrl: './visualize-stories-by-categories.component.html',
  styleUrls: ['./visualize-stories-by-categories.component.scss']
})
export class VisualizeStoriesByCategoriesComponent implements OnInit {
  @Input()
  allStories: {
    categorie: {
      libelle?: string;
      ordre?: number;
      code?: string;
      zoneAffichage?: string;
    };
    stories: Story[];
    readAll: boolean;
  }[] = [];
  private slides;
	currentSlideIndex = 0;
	@ViewChild('slide', { static: false }) swiper?: SwiperComponent;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  setSwiperInstance(ev) {
    this.slides = ev;
  }

	slideChange() {
		this.currentSlideIndex = this.slides?.activeIndex;
  }

	goNext(event: { finish: boolean }) {
		if(event?.finish) {
			if(this.slides?.isEnd) {
				this.modalCtrl.dismiss();
			} else {
				this.swiper?.swiperRef?.slideNext();
			}
		}
	}
}
