import {
	ChangeDetectorRef,
	Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Story } from 'src/app/models/story-oem.model';
import { StoriesProgressBarComponent } from '../stories-progress-bar/stories-progress-bar.component';
import { VisualizeStoryComponent } from '../visualize-story/visualize-story.component';
import SwiperCore, { EffectCoverflow, EffectFade, EffectFlip, Navigation, Pagination, SwiperOptions } from 'swiper';
import { IonicSwiper } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { TYPE_ACTION_ON_BANNER } from 'src/shared';
import { StoriesService } from 'src/app/services/stories-service/stories.service';
import { SwiperComponent } from 'swiper/angular';
import { tap } from 'rxjs/operators';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';

SwiperCore.use([IonicSwiper, Navigation, Pagination, EffectFade, EffectCoverflow, EffectCoverflow, EffectFlip]);

@Component({
  selector: "app-visualize-stories",
  templateUrl: "./visualize-stories.component.html",
  styleUrls: ["./visualize-stories.component.scss"],
})
export class VisualizeStoriesComponent implements OnInit, OnDestroy {
	@Output() leaveStories = new EventEmitter();
  @Input() storyByCategory: {
    categorie: {
      libelle?: string;
      ordre?: number;
      code?: string;
      zoneAffichage?: string;
    };
    stories: Story[];
    readAll: boolean;
  } = null;
  @Input() index: number;
  @Input() isVisibleForHigherView: boolean;
  @Input() view: "SINGLE_CATEGORY" | "ALL_CATEGORIES" = "SINGLE_CATEGORY";
  @Output() action = new EventEmitter();
  private slides;
  @ViewChildren(StoriesProgressBarComponent)
  storiesProgressBarView: QueryList<StoriesProgressBarComponent>;
  @ViewChildren(VisualizeStoryComponent)
  storiesView: QueryList<VisualizeStoryComponent>;
  currentSlideIndex = 0;
  @ViewChild("slides", { static: false }) swiper?: SwiperComponent;
  config: SwiperOptions = {
    init: false,
    effect: "fade",
    lazy: true,
    navigation: {
      nextEl: ".right",
      prevEl: ".left",
    },
  };
  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private iab: InAppBrowser,
    private storiesServ: StoriesService,
    private cd: ChangeDetectorRef,
	private followAnalyticsService: FollowAnalyticsService,
	private dashService: DashboardService
  ) {}

  ngOnInit() {}
  ngAfterViewInit() {
    this.loadLastStoriesState();
  }

  loadLastStoriesState(index?: number) {
    setTimeout(() => {
      const startIndex = !index ? this.retrieveSlideStartingIndex() : index;
      this.fillAllPreviousProgressBar(startIndex);
      this.setSwiperIndex(startIndex);
    });
  }

  resetListStoriesState(index?: number) {
    const startIndex = !index ? this.retrieveSlideStartingIndex() : index;
    this.fillAllPreviousProgressBar(startIndex);
    this.setSwiperIndex(startIndex);
  }

  setSwiperIndex(index: number) {
    this.swiper.setIndex(index);
  }

  ngOnDestroy() {
    this.deactiveStoryMedia(this.currentSlideIndex);
    this.stopAnimateProgressBar(this.currentSlideIndex);
  }

  close() {
    if (this.view === "SINGLE_CATEGORY") {
      this.modalCtrl.dismiss({
        storyByCategory: this.storyByCategory,
        index: this.index,
      });
    } else {
      this.action.emit({
        finish: true,
      });
    }
  }

  setSwiperInstance(ev) {
    this.slides = ev;
  }

  playStory(event: any) {
    this.resumeStory(this.currentSlideIndex);
    if (this.storyByCategory?.stories[this.currentSlideIndex].audio) {
      this.activeStoryMedia(this.currentSlideIndex);
    }
  }

  loadStoryMedia(index: number = this.currentSlideIndex) {
    const storyComponent: VisualizeStoryComponent =
      this.storiesView.toArray()[index];
    if (storyComponent) {
      if (storyComponent?.mediaLoaded) {
        this.onImageReady(true);
        this.onAudioReady(null);
      }
    }
  }

  resumeStory(index: number) {
    const progressBarStory: StoriesProgressBarComponent =
      this.storiesProgressBarView.toArray()[index];
    progressBarStory.playStoryProgress();
  }

  pauseStory(event: any) {
    this.stopAnimateProgressBar(this.currentSlideIndex);
    if (this.storyByCategory?.stories[this.currentSlideIndex]?.audio) {
      this.deactiveStoryMedia(this.currentSlideIndex);
    }
  }

  onProgressFinish(event: any) {
    console.log("next");

    if (this.slides) {
      this.swiper?.swiperRef?.slideNext();
    }
  }

  slide(index: number) {
    this.slides?.slideTo(index);
  }

  retrieveSlideStartingIndex() {
    return this.storyByCategory?.stories.findIndex((item) => {
      return item.read === false;
    });
  }

  slideChange() {
    if (this.currentSlideIndex > this.slides?.activeIndex) {
      this.emptyProgressBar(this.currentSlideIndex);
    } else if (this.currentSlideIndex < this.slides?.activeIndex) {
      this.fillProgressBar(this.currentSlideIndex);
    }
    this.deactiveStoryMedia(this.currentSlideIndex);
    this.stopAnimateProgressBar(this.currentSlideIndex);
    this.currentSlideIndex = this.slides?.activeIndex;
    this.loadStoryMedia(this.currentSlideIndex);
  }

  seeStory() {
    const storyComponent: VisualizeStoryComponent =
      this.storiesView.toArray()[this.currentSlideIndex];
    if (!storyComponent?.story?.read) {
      this.storiesServ
        .seeStory(storyComponent?.story)
        .pipe(
          tap((res: any) => {
            storyComponent.userReadStory();
            this.setStoryReadAttribute();
          })
        )
        .subscribe();
    }
  }

  setStoryReadAttribute() {
    if (
      this.storyByCategory.stories.length &&
      this.storyByCategory.stories[this.currentSlideIndex]
    )
      this.storyByCategory.stories[this.currentSlideIndex].read = true;
  }

  activeStoryMedia(index: number) {
    const storyComponent: VisualizeStoryComponent =
      this.storiesView.toArray()[index];
    if (storyComponent && storyComponent.story && storyComponent.story.audio) {
      storyComponent.playMedia();
    }
  }

  deactiveStoryMedia(index: number = this.currentSlideIndex) {
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

  stopAnimateProgressBar(index: number = this.currentSlideIndex) {
    if (index < 0) return;
    const progressBarStory: StoriesProgressBarComponent =
      this.storiesProgressBarView.toArray()[index];
    progressBarStory.resetProgressBar();
  }

  emptyProgressBar(index: number = this.currentSlideIndex) {
    const progressBarStory: StoriesProgressBarComponent =
      this.storiesProgressBarView.toArray()[index];
    progressBarStory.emptyProgressBar();
  }

  fillProgressBar(index: number) {
    const progressBarStory: StoriesProgressBarComponent =
      this.storiesProgressBarView.toArray()[index];
    progressBarStory.fillProgressBar();
  }

  fillAllPreviousProgressBar(index: number) {
    if (index > 0) {
      for (let i = 0; i <= index - 1; i++) {
        this.fillProgressBar(i);
      }
    }
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
      if (!this.storyByCategory?.stories[this.currentSlideIndex].audio) {
        this.startAnimateProgressBar(this.currentSlideIndex);
        this.seeStory();
      }
    }
  }

  clickOnSlide(event: any) {
    if (event?.btn) {
      const action = event?.action;
      this.close();
      this.onActionBtnClicked(action);
    } else {
      this.stopAnimateProgressBar(this.currentSlideIndex);
    }
  }

  onActionBtnClicked(data: {
    typeAction: string;
    description: string;
    url: string;
    label: string;
  }) {
    switch (data.typeAction) {
      case TYPE_ACTION_ON_BANNER.DEEPLINK:
		  this.leaveStories.emit('close')
        this.navCtrl.navigateForward([data.url]);
        break;
      case TYPE_ACTION_ON_BANNER.REDIRECTION:
        this.iab.create(data.url, "_blank");
        break;
      default:
        break;
    }
  }

  navigateStory(side: "next" | "prev") {
    const msisdn = this.dashService.getCurrentPhoneNumber();
    const evName = side === "next" ? "story_next" : "story_back";
    this.followAnalyticsService.registerEventFollow(evName, "event", {
      msisdn,
    });
  }
}
