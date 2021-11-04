import {Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { ModalController } from '@ionic/angular';
import {Story} from 'src/app/models/story-oem.model';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { VisualizeStoriesComponent } from '../visualize-stories/visualize-stories.component';

@Component({
  selector: 'app-visualize-stories-by-categories',
  templateUrl: './visualize-stories-by-categories.component.html',
  styleUrls: ['./visualize-stories-by-categories.component.scss']
})
export class VisualizeStoriesByCategoriesComponent implements OnInit {
  @Input()
  allStories: {
    categorie: {
			id?: string;
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
	@ViewChildren(VisualizeStoriesComponent) storiesView: QueryList<VisualizeStoriesComponent>;
	config: SwiperOptions = {
		effect: 'cube'
	};
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  setSwiperInstance(ev) {
    this.slides = ev;
  }

	refreshProgressBarStories(index: number) {
		const storiesOfCategory: VisualizeStoriesComponent =
			this.storiesView.toArray()[index];
			storiesOfCategory.deactiveStoryMedia();
			storiesOfCategory.stopAnimateProgressBar()
			storiesOfCategory.emptyProgressBar()
	}

	loadLastStoriesState(index: number) {
		const storiesOfCategory: VisualizeStoriesComponent =
			this.storiesView.toArray()[index];
			storiesOfCategory.loadLastStoriesState();
			storiesOfCategory.loadStoryMedia();
	}

	slideChange() {
		this.refreshProgressBarStories(this.currentSlideIndex);
		this.currentSlideIndex = this.slides?.activeIndex;
		this.loadLastStoriesState(this.currentSlideIndex);

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
