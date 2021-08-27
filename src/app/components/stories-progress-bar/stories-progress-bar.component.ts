import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {StoryOem} from 'src/app/models/story-oem.model';
import {STORIES_OEM_CONFIG} from 'src/shared';

@Component({
  selector: 'app-stories-progress-bar',
  templateUrl: './stories-progress-bar.component.html',
  styleUrls: ['./stories-progress-bar.component.scss']
})
export class StoriesProgressBarComponent implements OnInit, OnChanges {
  currentProgressValue = 0;
  @Input() story: StoryOem;
  @Input() progressBarStepTime = 1000;
  @Input() idStory: number = -1;
  @Input() lastId: number = -1;
  @Input() isCurrentStory: boolean;
  @Output() idStoryChange = new EventEmitter<any>();
  @Output() finish = new EventEmitter();
  timeOutIds: any[] = [];
  totalSteps;
  stepValue;
  constructor() {}

  ngOnInit() {}

  startProgressBar() {
    this.currentProgressValue = 0;
    this.initConfigProgressBar();
    for (let index = 1; index <= this.totalSteps; index++) {
      this.setProgressBarEvolution(index);
    }
  }

  setProgressBarEvolution(index: number) {
    const idTimeOut = setTimeout(() => {
      this.currentProgressValue = Math.round(index * +this.stepValue * 100) / 100;
      if (index === this.totalSteps) {
        this.idStoryChange.emit(true);
      }
      if (this.idStory === this.lastId && index === this.totalSteps) {
        this.finish.emit(this.idStory);
      }
    }, this.progressBarStepTime * index);
    this.timeOutIds.push(idTimeOut);
  }

  resetProgressBar() {
    this.currentProgressValue = 0;
    for (const id of this.timeOutIds) {
      clearTimeout(id);
    }
    this.timeOutIds = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isCurrentStory && !changes.isCurrentStory.currentValue) {
      this.currentProgressValue = 0;
    }
  }

  initConfigProgressBar() {
    console.log('initConfig', this.story);
    if (this.story.duration > STORIES_OEM_CONFIG.MAX_DURATION_BY_ELEMENT) {
      this.story.duration = STORIES_OEM_CONFIG.MAX_DURATION_BY_ELEMENT;
    }
    if (this.story) {
      this.stepValue = +(this.progressBarStepTime / this.story.duration).toFixed(2);
      this.totalSteps = Math.trunc(this.story.duration / this.progressBarStepTime);
    }
  }
}
