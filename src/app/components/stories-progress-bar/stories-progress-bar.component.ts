import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-stories-progress-bar',
  templateUrl: './stories-progress-bar.component.html',
  styleUrls: ['./stories-progress-bar.component.scss']
})
export class StoriesProgressBarComponent implements OnInit {
  currentProgressValue = 0;
  @Input() maxTimeProgressBar = 5000;
  @Input() progressBarStepTime = 100;
  @Output() finish = new EventEmitter();
  intervalID: any;
  constructor() {}

  ngOnInit() {
    console.log(this.progressBarStepTime, this.maxTimeProgressBar);
    this.startProgressBar();
    this.stop();
  }

  startProgressBar() {
    this.intervalID = setInterval(() => {
      this.currentProgressValue += +(this.progressBarStepTime / this.maxTimeProgressBar).toFixed(2);
      console.log(this.currentProgressValue);
    }, this.progressBarStepTime);
  }

  stop() {
    setTimeout(() => {
      this.finish.emit(true);
      clearInterval(this.intervalID);
    }, this.maxTimeProgressBar + 1000);
  }
}
