import {
	Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StoryOem } from 'src/app/models/story-oem.model';
import { StoriesProgressBarComponent } from '../stories-progress-bar/stories-progress-bar.component';
import { VisualizeStoryComponent } from '../visualize-story/visualize-story.component';

import SwiperCore, { EffectCoverflow, EffectFade, EffectFlip, Navigation, Pagination } from 'swiper';
import { IonicSwiper } from '@ionic/angular';

SwiperCore.use([IonicSwiper, Navigation, Pagination, EffectFade, EffectCoverflow, EffectCoverflow, EffectFlip]);

@Component({
  selector: 'app-visualize-stories',
  templateUrl: './visualize-stories.component.html',
  styleUrls: ['./visualize-stories.component.scss'],
})
export class VisualizeStoriesComponent implements OnInit, OnDestroy {
  stories: StoryOem[] = [
    {
      name: 'test 1',
      description: 'etst',
      shortlabel: 'shortLabel',
      longLabel: 'longLabel',
      storyContent: 'assets/images/story-default.webp',
      categorieOffreService: null,
      action: {
        label: 'Envoyer ',
        description: 'send money',
        url: null,
        typeAction: 'REDIRECTION',
      },
      audio: null,
      type: 'IMAGE',
      duration: 5000,
    },
    {
      name: 'test 2',
      description: 'etst',
      shortlabel: 'shortLabel',
      longLabel: 'longLabel',
      storyContent: 'assets/images/story-default-2.webp',
      categorieOffreService: null,
      action: {
        label: 'Envoyer ',
        description: 'send money',
        url: null,
        typeAction: 'REDIRECTION',
      },
      audio: null,
      type: 'IMAGE',
      duration: 5000,
    },
    {
      name: 'test 4',
      description: 'etst',
      shortlabel: 'shortLabel',
      longLabel: 'longLabel',
      storyContent: 'assets/images/story-default-2.webp',
      categorieOffreService: null,
      action: {
        label: 'Envoyer ',
        description: 'send money',
        url: null,
        typeAction: 'REDIRECTION',
      },
      audio: 'assets/audio.mp3',
      type: 'IMAGE',
      duration: 5000,
    },
    {
      name: 'test 3',
      description: 'etst',
      shortlabel: 'shortLabel',
      longLabel: 'longLabel',
      storyContent: 'assets/images/story-default.webp',
      categorieOffreService: null,
      action: {
        label: 'Envoyer ',
        description: 'send money',
        url: null,
        typeAction: 'REDIRECTION',
      },
      audio: null,
      type: 'IMAGE',
      duration: 5000,
    },
  ];
  private slides;
  @ViewChildren(StoriesProgressBarComponent, { emitDistinctChangesOnly: true })
  storiesProgressBarView: QueryList<StoriesProgressBarComponent>;
  @ViewChildren(VisualizeStoryComponent)
  storiesView: QueryList<VisualizeStoryComponent>;
  currentSlideIndex = 0;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  ngOnDestroy() {
		this.deactiveStoryMedia(this.currentSlideIndex);
		this.stopAnimateProgressBar(this.currentSlideIndex);
	}

  close() {
    this.modalCtrl.dismiss();
  }


	setSwiperInstance(ev) {
    this.slides = ev;
  }

  ngAfterViewInit() {
    this.deactiveStoryMedia(this.currentSlideIndex - 1);
    this.startAnimateProgressBar(this.currentSlideIndex);
    this.activeStoryMedia(this.currentSlideIndex);
  }

	playStory(swiper: any, event?: any) {
		//console.log('swiper', swiper, 'event', event);
		//const progressBarStory: StoriesProgressBarComponent =
		//this.storiesProgressBarView.toArray()[this.currentSlideIndex];
		//	progressBarStory.playStoryProgress();
	}

	pauseStory() {
		//const progressBarStory: StoriesProgressBarComponent =
		//this.storiesProgressBarView.toArray()[this.currentSlideIndex];
		//progressBarStory.pauseStoryProgress();
	}

  onProgressFinish(event: any) {
    if (this.slides) {
      this.slides?.slideNext();
    }
  }

  slide(index: number) {
    this.slides?.slideTo(index);
  }

  slideChange() {
		this.deactiveStoryMedia(this.currentSlideIndex);
		this.stopAnimateProgressBar(this.currentSlideIndex);
		if(this.currentSlideIndex > this.slides?.activeIndex ) {
			this.emptyProgressBar(this.currentSlideIndex)
		} else {
			this.fillProgressBar(this.slides?.activeIndex);
		}
		this.currentSlideIndex = this.slides?.activeIndex;
		this.startAnimateProgressBar(this.currentSlideIndex);
		this.activeStoryMedia(this.currentSlideIndex);
  }


  activeStoryMedia(index: number) {
    const storyComponent: VisualizeStoryComponent =
      this.storiesView.toArray()[index];
    if (storyComponent && storyComponent.story && storyComponent.story.audio) {

    }
  }

  deactiveStoryMedia(index: number) {
    if (index < 0) return;
    const storyComponent: VisualizeStoryComponent =
      this.storiesView.toArray()[index];

    if (storyComponent && storyComponent.story && storyComponent.story.audio) {
    }
  }

  startAnimateProgressBar(index: number) {
    const progressBarStory: StoriesProgressBarComponent =
      this.storiesProgressBarView.toArray()[index];
    progressBarStory?.startProgressBar();
  }

  stopAnimateProgressBar(index: number) {
    if (index < 0) return;
    const progressBarStory: StoriesProgressBarComponent =
      this.storiesProgressBarView.toArray()[index];
			progressBarStory.resetProgressBar();
  }

	emptyProgressBar(index: number) {
			const progressBarStory: StoriesProgressBarComponent =
			this.storiesProgressBarView.toArray()[this.currentSlideIndex];
			progressBarStory.emptyProgressBar();
	}

	fillProgressBar(index: number) {
			const progressBarStory: StoriesProgressBarComponent =
			this.storiesProgressBarView.toArray()[this.currentSlideIndex];
			progressBarStory.fillProgressBar();
	}

  setProgressBarDuration(duration: number, index: number) {
    const progressBarStory: StoriesProgressBarComponent =
      this.storiesProgressBarView.toArray()[index];
    progressBarStory.story.duration = duration;
  }

  slideTransitionStart() {
    //console.log('slideTransitionStart');
    //console.log(2);
  }
}
