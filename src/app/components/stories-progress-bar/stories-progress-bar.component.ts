import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Output() idStoryChange = new EventEmitter<any>();
  @Output() finish = new EventEmitter();
  progressBarStepTime = 100;
  timeOutIds: any[] = [];
  totalSteps: number;
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  startProgressBar(from: number = 0) {
    this.initConfigProgressBar();
    this.setProgressBarEvolutionV2(from);
  }

  setProgressBarEvolution(index: number) {
    const idTimeOut = setTimeout(() => {
      this.currentProgressValue = Math.round(index * +this.stepValue * 100) / 100;

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

  setProgressBarEvolutionV2(startValue: number = 0) {
    this.currentProgressValue = startValue;
    const idTimeOut = setInterval(() => {
      this.currentProgressValue += +this.stepValue;

      if (this.currentProgressValue >= 1) {
        this.resetProgressBar();
        this.idStoryChange.emit(true);
        if (this.isLast) {
          this.finish.emit(this.isLast);
        }
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
    this.startProgressBar(this.currentProgressValue);
  }

  setProgressStoryDuration(duration: number) {
    this.story.duration = duration;
    this.cd.detectChanges();
  }
}
