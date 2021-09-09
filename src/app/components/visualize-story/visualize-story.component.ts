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
export class VisualizeStoryComponent implements OnInit {
  @Input() story: StoryOem;
  @Input() isCurrentStory: boolean;
  @Output() mediaDurationChange = new EventEmitter();
  @Output() imageReady = new EventEmitter();
  @Output() audioReady = new EventEmitter();
  @Output() touch = new EventEmitter();
  mediaDuration: any;
  @ViewChild('audioOrVideo') media: ElementRef;
  isLoading: boolean = true;
  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
  }

  getInfoMetaData(event: any) {
    if (event && event?.srcElement) {
      this.mediaDuration = event.srcElement.duration * 1000;
      this.story.duration = this.mediaDuration;
      this.mediaDurationChange.emit(this.mediaDuration);
    }
		this.ref.detectChanges()
  }

  loadMedia() {
    if (this.media && this.media.nativeElement && this.story.audio) {
      this.media.nativeElement.load();
      this.ref.detectChanges();
    }
  }


  playMedia() {
    if (this.media && this.media.nativeElement) {
      this.media.nativeElement.play();
    }
  }

  pauseMedia() {
    if (this.media && this.media.nativeElement) {
      this.media.nativeElement.pause();
    }
  }

  canPlay(event: any) {
			this.audioReady.emit(true);
  }

  onError(event: any) {
    //console.log('event', event);
  }

  imageLoaded(event: any) {
    this.isLoading = false;
    this.imageReady.emit(this.isCurrentStory);
    //console.log('imageLoaded', event);
  }

	makeAction(event:any) {
		this.touch.emit({ slide: event, btn: true, action: this.story?.action });
	}

	userReadStory() {
		this.story.read = true;
		this.ref.detectChanges();
	}
}
