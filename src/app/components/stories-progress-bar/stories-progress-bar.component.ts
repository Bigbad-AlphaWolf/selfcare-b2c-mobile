import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {StoryOem} from 'src/app/models/story-oem.model';
import {STORIES_OEM_CONFIG} from 'src/shared';

@Component({
  selector: 'app-stories-progress-bar',
  templateUrl: './stories-progress-bar.component.html',
  styleUrls: ['./stories-progress-bar.component.scss']
})
export class StoriesProgressBarComponent implements OnInit {
  currentProgressValue = 0;
  @Input() story: StoryOem;
  @Input() stepValue = 0.01;
  @Input() isLast: boolean;
  @Input() isCurrentStory: boolean;
  @Output() idStoryChange = new EventEmitter<any>();
  @Output() finish = new EventEmitter();
  progressBarStepTime = 100;
  timeOutIds: any[] = [];
  totalSteps: number;
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  startProgressBar(from: number = 1) {
    this.initConfigProgressBar();
    console.log('from', from, 'totalSteps', this.totalSteps);

    for (let index = from + 1; index <= this.totalSteps; index++) {
      console.log('from', from);

      this.setProgressBarEvolution(index);
    }
  }

  setProgressBarEvolution(index: number) {
    const idTimeOut = setTimeout(() => {
      this.currentProgressValue = Math.round(index * +this.stepValue * 100) / 100;
      console.log('index', index);

      if (index === this.totalSteps) {
        this.idStoryChange.emit(true);
      }
      if (this.isLast && index === this.totalSteps) {
        this.finish.emit(this.isLast);
      }

      this.cd.detectChanges();
    }, this.progressBarStepTime * index);
    this.timeOutIds.push(idTimeOut);
  }

  setProgressBarEvolutionV2(index: number) {
    const idTimeOut = setInterval(() => {
      this.currentProgressValue += +this.stepValue;
      console.log('index', index);

      if (index === this.totalSteps) {
        this.idStoryChange.emit(true);
      }
      if (this.isLast && index === this.totalSteps) {
        this.finish.emit(this.isLast);
      }

      this.cd.detectChanges();
    }, this.progressBarStepTime);
    this.timeOutIds.push(idTimeOut);
  }

  resetProgressBar() {
    for (const id of this.timeOutIds) {
      clearTimeout(id);
    }
    this.timeOutIds = [];
  }

  emptyProgressBar() {
    this.currentProgressValue = 0;
    this.cd.detectChanges();
  }

  initConfigProgressBar() {
    if (this.story.duration > STORIES_OEM_CONFIG.MAX_DURATION_BY_ELEMENT) {
      this.story.duration = STORIES_OEM_CONFIG.MAX_DURATION_BY_ELEMENT;
    }
    if (this.story) {
      this.progressBarStepTime = +(this.stepValue * this.story.duration).toFixed(2);
      this.totalSteps = Math.trunc(this.story.duration / this.progressBarStepTime);
    }
    this.cd.detectChanges();
  }

  getCurrentIndexProgress() {
    return this.currentProgressValue ? Math.round(this.currentProgressValue * 100 / (100 * this.stepValue)) : 1;
  }

  pauseStoryProgress() {
    this.resetProgressBar();
  }

  fillProgressBar() {
    this.currentProgressValue = 1;
    this.cd.detectChanges();
  }

  playStoryProgress() {
    console.log('timeIds', this.timeOutIds);

    const currentIndex = this.getCurrentIndexProgress();
    console.log('currentIndex', currentIndex);
    this.currentProgressValue = 0.5;
    console.log('currentIndex', this.currentProgressValue);
    this.startProgressBar(currentIndex);
  }

  setProgressStoryDuration(duration: number) {
    this.story.duration = duration;
    console.log('this.story.duration', this.story.duration);

    this.cd.detectChanges();
  }
}
