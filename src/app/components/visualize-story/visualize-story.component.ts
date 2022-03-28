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
import { Platform } from '@ionic/angular';
import { ImageAttribute } from 'ionic-image-loader';
import {StoryOem} from 'src/app/models/story-oem.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';

@Component({
  selector: "app-visualize-story",
  templateUrl: "./visualize-story.component.html",
  styleUrls: ["./visualize-story.component.scss"],
})
export class VisualizeStoryComponent implements OnInit {
  @Input() story: StoryOem;
  @Input() isVisible: boolean;
  @Output() mediaDurationChange = new EventEmitter();
  @Output() imageReady = new EventEmitter();
  @Output() audioReady = new EventEmitter();
  @Output() touch = new EventEmitter();
  mediaDuration: any;
  @ViewChild("audioOrVideo") media: ElementRef;
  @ViewChild("image") image: any;
  isLoading: boolean = true;
  isWeb: boolean;
  imageAttributes: ImageAttribute[] = [
    {
      element: "class",
      value: "img-full-width",
    },
  ];
  hasErrorLoading: boolean;
  mediaLoaded: boolean;
  constructor(
    private ref: ChangeDetectorRef,
    private platform: Platform,
    private followAnalytics: FollowAnalyticsService,
    private dashService: DashboardService
  ) {
    this.isWeb = platform.is("mobileweb");
  }

  ngOnInit() {
    console.log("Init on nG");
  }

  loadMediaV2() {
    console.log("image", this.image);
  }

  ngAfterViewInit() {}

  getInfoMetaData(event: any) {
    if (event && event?.srcElement) {
      this.mediaDuration = event.srcElement.duration * 1000;
      this.story.duration = this.mediaDuration;
      this.mediaDurationChange.emit(this.mediaDuration);
    }
    this.ref.detectChanges();
  }

  loadMedia() {
    if (this.story?.audio) {
      if (this.media && this.media.nativeElement) {
        this.media.nativeElement.load();
        this.ref.detectChanges();
      }
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
    this.mediaLoaded = true;
    this.ref.detectChanges();
  }

  imageLoaded(event: any) {
    this.mediaLoaded = true;
    this.hasErrorLoading = false;
    this.isLoading = false;
    this.imageReady.emit(this.isVisible);
    this.ref.detectChanges();
  }

  makeAction(event: any) {
    const msisdn = this.dashService.getCurrentPhoneNumber();
    this.followAnalytics.registerEventFollow("story_link_clic", "event", {
      msisdn,
    });
    this.touch.emit({ slide: event, btn: true, action: this.story?.action });
  }

  userReadStory() {
    this.story.read = true;
    this.ref.detectChanges();
  }

  handleErrorLoading(event: any) {
    this.hasErrorLoading = true;
    this.isLoading = false;
    this.ref.detectChanges();
  }
}
