import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Player} from '@vime/angular';
import {StoryOem} from 'src/app/models/story-oem.model';

@Component({
  selector: 'app-visualize-story',
  templateUrl: './visualize-story.component.html',
  styleUrls: ['./visualize-story.component.scss']
})
export class VisualizeStoryComponent implements OnInit, OnChanges {
  @Input() story: StoryOem;
  @Input() isCurrentStory: boolean;
  @Output() mediaDurationChange = new EventEmitter();
  mediaDuration: any;
  @ViewChild('audioOrVideo') mediaTag: HTMLAudioElement;
  @ViewChild('audioOrVideo') media: ElementRef;
  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {}

  getInfoMetaData(event: any) {
    if (event && event.srcElement) {
      this.mediaDuration = event.srcElement.duration * 1000;
      this.story.duration = this.mediaDuration;
      this.mediaDurationChange.emit(this.mediaDuration);
    }
  }

  ngAfterViewInit() {
    if (this.media && this.media.nativeElement && this.story.audio) {
      this.media.nativeElement.load();
      if (this.isCurrentStory) {
        this.playMedia();
      }
      //console.log('this.media.nativeElement', this.media.nativeElement);
    }
  }

  ngOnChanges(simple: SimpleChanges) {
    //console.log('simple', simple);

    if (this.story.audio) {
      if (simple.isCurrentStory.currentValue === true) {
        this.playMedia();
      } else {
        this.pauseMedia();
      }
    }
  }

  loadStart(event: any) {
    //console.log('evennnnt', event.target.duration);
    //this.canPlayMedia.emit(true);
  }

  playMedia() {
    //console.log('this.media', this.media);

    if (this.media && this.media.nativeElement) {
      this.media.nativeElement.load();
      this.media.nativeElement.play();
    }
  }

  pauseMedia() {
    if (this.media && this.media.nativeElement) {
      this.media.nativeElement.pause();
    }
  }

  canPlay(event: any) {
    //console.log('canPlay', event);
    //this.media.nativeElement.play();
  }

  onError(event: any) {
    //console.log('event', event);
  }
}
