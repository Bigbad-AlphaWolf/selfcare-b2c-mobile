import {
	Component,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { StoryOem } from 'src/app/models/story-oem.model';
import { StoriesProgressBarComponent } from '../stories-progress-bar/stories-progress-bar.component';
import { VisualizeStoryComponent } from '../visualize-story/visualize-story.component';

import SwiperCore, { EffectCoverflow, EffectFade, EffectFlip, Navigation, Pagination } from 'swiper';
import { IonicSwiper } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { TYPE_ACTION_ON_BANNER } from 'src/shared';
import { tap } from 'rxjs/operators';
import { StoriesService } from 'src/app/services/stories-service/stories.service';

SwiperCore.use([IonicSwiper, Navigation, Pagination, EffectFade, EffectCoverflow, EffectCoverflow, EffectFlip]);

@Component({
  selector: 'app-visualize-stories',
  templateUrl: './visualize-stories.component.html',
  styleUrls: ['./visualize-stories.component.scss'],
})
export class VisualizeStoriesComponent implements OnInit, OnDestroy {
  @Input() stories: StoryOem[];
  private slides;
  @ViewChildren(StoriesProgressBarComponent, { emitDistinctChangesOnly: true })
  storiesProgressBarView: QueryList<StoriesProgressBarComponent>;
  @ViewChildren(VisualizeStoryComponent)
  storiesView: QueryList<VisualizeStoryComponent>;
  currentSlideIndex = 0;
  constructor(private modalCtrl: ModalController, private navCtrl: NavController, private iab: InAppBrowser, private storiesServ: StoriesService) {}

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
    //this.deactiveStoryMedia(this.currentSlideIndex - 1);
    //this.startAnimateProgressBar(this.currentSlideIndex);
    //this.activeStoryMedia(this.currentSlideIndex);
  }

	playStory(swiper: any, event?: any) {
		const progressBarStory: StoriesProgressBarComponent =
		this.storiesProgressBarView.toArray()[this.currentSlideIndex];
			progressBarStory.playStoryProgress();
	}

	pauseStory(event: any) {
		console.log('PauseStory', event);

		const progressBarStory: StoriesProgressBarComponent =
		this.storiesProgressBarView.toArray()[this.slides?.activeIndex];
		progressBarStory.pauseStoryProgress();
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
		if(this.currentSlideIndex > this.slides?.activeIndex ) {
			this.emptyProgressBar(this.currentSlideIndex)
		} else {
			this.fillProgressBar(this.slides?.activeIndex);
		}
		this.deactiveStoryMedia(this.currentSlideIndex);
		this.stopAnimateProgressBar(this.currentSlideIndex);
		this.currentSlideIndex = this.slides?.activeIndex;
  }

	seeStory() {
		const storyComponent: VisualizeStoryComponent =
      this.storiesView.toArray()[this.currentSlideIndex];
			if(!storyComponent.story.read) {
				this.storiesServ.seeStory(storyComponent.story).pipe(
					tap((res: any) => {
						storyComponent.userReadStory();
					})
				).subscribe()
			}
	}


  activeStoryMedia(index: number) {
    const storyComponent: VisualizeStoryComponent =
      this.storiesView.toArray()[index];
    if (storyComponent && storyComponent.story && storyComponent.story.audio) {
			storyComponent.playMedia();
    }
  }

  deactiveStoryMedia(index: number) {
    if (index < 0) return;
    const storyComponent: VisualizeStoryComponent =
      this.storiesView.toArray()[index];

    if (storyComponent && storyComponent.story && storyComponent.story.audio) {
			storyComponent.pauseMedia();
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
			progressBarStory.setProgressStoryDuration(duration);
  }

	onAudioReady(event: any) {
		this.seeStory();
		this.activeStoryMedia(this.currentSlideIndex);
		this.startAnimateProgressBar(this.currentSlideIndex);
	}

	onImageReady(isCurrentstory: any) {
		if (isCurrentstory) {
			if(!this.stories[this.currentSlideIndex].audio) {
				this.startAnimateProgressBar(this.currentSlideIndex);
				this.seeStory();
			}
		}
	}

  slideTransitionStart() {
    //console.log('slideTransitionStart');
    //console.log(2);
  }

	clickOnSlide(event: any) {
		if(event?.btn) {
			const action = event?.action;
			this.close();
			this.onActionBtnClicked(action);
		}
	}

	onActionBtnClicked(data: { typeAction: string; description: string; url: string; label: string; }) {
		switch (data.typeAction) {
			case TYPE_ACTION_ON_BANNER.DEEPLINK:
				this.navCtrl.navigateForward([data.url]);
				break;
			case TYPE_ACTION_ON_BANNER.REDIRECTION:
				this.iab.create(data.url, '_blank');
				break;
			default:
				break;
		}
	}
}
