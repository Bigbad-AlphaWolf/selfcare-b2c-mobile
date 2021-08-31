import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { StoryOem } from 'src/app/models/story-oem.model';
import { StoriesProgressBarComponent } from '../stories-progress-bar/stories-progress-bar.component';
import { VisualizeStoryComponent } from '../visualize-story/visualize-story.component';

@Component({
  selector: 'app-visualize-stories',
  templateUrl: './visualize-stories.component.html',
  styleUrls: ['./visualize-stories.component.scss'],
})
export class VisualizeStoriesComponent implements OnInit {
  slideOpts = {
    //on: {
    //  beforeInit() {
    //    const swiper = this;
    //    swiper.classNames.push(`${swiper.params.containerModifierClass}flip`);
    //    swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
    //    const overwriteParams = {
    //      slidesPerView: 1,
    //      slidesPerColumn: 1,
    //      slidesPerGroup: 1,
    //      watchSlidesProgress: true,
    //      spaceBetween: 0,
    //      virtualTranslate: true
    //    };
    //    swiper.params = Object.assign(swiper.params, overwriteParams);
    //    swiper.originalParams = Object.assign(swiper.originalParams, overwriteParams);
    //  },
    //  setTranslate() {
    //    const swiper = this;
    //    const {$, slides, rtlTranslate: rtl} = swiper;
    //    for (let i = 0; i < slides.length; i += 1) {
    //      const $slideEl = slides.eq(i);
    //      let progress = $slideEl[0].progress;
    //      if (swiper.params.flipEffect.limitRotation) {
    //        progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
    //      }
    //      const offset$$1 = $slideEl[0].swiperSlideOffset;
    //      const rotate = -180 * progress;
    //      let rotateY = rotate;
    //      let rotateX = 0;
    //      let tx = -offset$$1;
    //      let ty = 0;
    //      if (!swiper.isHorizontal()) {
    //        ty = tx;
    //        tx = 0;
    //        rotateX = -rotateY;
    //        rotateY = 0;
    //      } else if (rtl) {
    //        rotateY = -rotateY;
    //      }
    //      $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;
    //      if (swiper.params.flipEffect.slideShadows) {
    //        // Set shadows
    //        let shadowBefore = swiper.isHorizontal()
    //          ? $slideEl.find('.swiper-slide-shadow-left')
    //          : $slideEl.find('.swiper-slide-shadow-top');
    //        let shadowAfter = swiper.isHorizontal()
    //          ? $slideEl.find('.swiper-slide-shadow-right')
    //          : $slideEl.find('.swiper-slide-shadow-bottom');
    //        if (shadowBefore.length === 0) {
    //          shadowBefore = swiper.$(
    //            `<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'left' : 'top'}"></div>`
    //          );
    //          $slideEl.append(shadowBefore);
    //        }
    //        if (shadowAfter.length === 0) {
    //          shadowAfter = swiper.$(
    //            `<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'right' : 'bottom'}"></div>`
    //          );
    //          $slideEl.append(shadowAfter);
    //        }
    //        if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
    //        if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
    //      }
    //      $slideEl.transform(`translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    //    }
    //  },
    //  setTransition(duration) {
    //    const swiper = this;
    //    const {slides, activeIndex, $wrapperEl} = swiper;
    //    slides
    //      .transition(duration)
    //      .find(
    //        '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left'
    //      )
    //      .transition(duration);
    //    if (swiper.params.virtualTranslate && duration !== 0) {
    //      let eventTriggered = false;
    //      // eslint-disable-next-line
    //      slides.eq(activeIndex).transitionEnd(function onTransitionEnd() {
    //        if (eventTriggered) return;
    //        if (!swiper || swiper.destroyed) return;
    //        eventTriggered = true;
    //        swiper.animating = false;
    //        const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
    //        for (let i = 0; i < triggerEvents.length; i += 1) {
    //          $wrapperEl.trigger(triggerEvents[i]);
    //        }
    //      });
    //    }
    //  }
    //}
  };
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
  @ViewChild('slides') ionSlide: IonSlides;
  @ViewChildren(StoriesProgressBarComponent, { emitDistinctChangesOnly: true })
  storiesProgressBarView: QueryList<StoriesProgressBarComponent>;
  @ViewChildren(VisualizeStoryComponent)
  storiesView: QueryList<VisualizeStoryComponent>;
  currentSlideIndex = 0;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  ngAfterViewInit() {
    console.log('storiesProgressBar', this.storiesProgressBarView.toArray());
    this.deactiveStoryMedia(this.currentSlideIndex - 1);
    this.startAnimateProgressBar(this.currentSlideIndex);
    this.activeStoryMedia(this.currentSlideIndex);
  }

  onProgressFinish(event: any) {
    //console.log('event', event);
    if (this.ionSlide) {
      this.ionSlide.slideNext();
    }
  }

  slide(index: number) {
    this.ionSlide.slideTo(index);
  }

  initAnimation() {
    console.log('startsss');
  }

  slideTransitionEnd() {
    //console.log('slideTransitionEnd');
  }

  slideHasChanged() {
    this.ionSlide.getActiveIndex().then((index) => {
      this.deactiveStoryMedia(this.currentSlideIndex);
      this.stopAnimateProgressBar(this.currentSlideIndex);

      this.currentSlideIndex = index;
      this.startAnimateProgressBar(index);
      this.activeStoryMedia(index);
    });
  }

  activeStoryMedia(index: number) {
    const storyComponent: VisualizeStoryComponent =
      this.storiesView.toArray()[index];
    if (storyComponent && storyComponent.story && storyComponent.story.audio) {
      //console.log('play');
      //storyComponent.playMedia();
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

  setProgressBarDuration(duration: number, index: number) {
    const progressBarStory: StoriesProgressBarComponent =
      this.storiesProgressBarView.toArray()[index];
    progressBarStory.story.duration = duration;
    console.log('storyProgressBar', duration);

    if (duration) {
      //console.log('changeProgressBarDuration');
    }
  }

  slideTransitionStart() {
    //console.log('slideTransitionStart');
    //console.log(2);
  }
}
