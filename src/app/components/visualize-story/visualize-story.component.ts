import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Platform } from '@ionic/angular';
import { ImageAttribute } from 'ionic-image-loader';
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
	isWeb: boolean;
	imageAttributes: ImageAttribute[] = [{
		element: 'class',
		value: 'img-full-width'
	}];

  constructor(private ref: ChangeDetectorRef, private platform: Platform) {
		this.isWeb = platform.is('mobileweb')
	}

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
			if (this.media && this.media.nativeElement) {
				this.media.nativeElement.pause();
			}
			this.audioReady.emit(true);
			this.ref.detectChanges()
  }

  onError(event: any) {
    //console.log('event', event);
  }

  imageLoaded(event: any) {
    this.isLoading = false;
    this.imageReady.emit(this.isCurrentStory);
		this.ref.detectChanges()
  }

	makeAction(event:any) {
		this.touch.emit({ slide: event, btn: true, action: this.story?.action });
	}

	userReadStory() {
		this.story.read = true;
		this.ref.detectChanges();
	}
}
