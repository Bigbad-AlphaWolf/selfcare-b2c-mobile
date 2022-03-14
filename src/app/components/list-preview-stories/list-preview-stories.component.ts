import {Component, Input, OnInit} from '@angular/core';
import {AnimationController, ModalController, Platform} from '@ionic/angular';
import { ImageAttribute } from 'ionic-image-loader';
import {of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Story} from 'src/app/models/story-oem.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import {StoriesService} from 'src/app/services/stories-service/stories.service';
import { VisualizeStoriesByCategoriesComponent } from '../visualize-stories-by-categories/visualize-stories-by-categories.component';
import {VisualizeStoriesComponent} from '../visualize-stories/visualize-stories.component';

@Component({
  selector: "app-list-preview-stories",
  templateUrl: "./list-preview-stories.component.html",
  styleUrls: ["./list-preview-stories.component.scss"],
})
export class ListPreviewStoriesComponent implements OnInit {
  @Input()
  storiesByCategory: {
    categorie: {
      libelle?: string;
      ordre?: number;
      code?: string;
      zoneAffichage?: string;
      image?: string;
    };
    stories: Story[];
    readAll: boolean;
  }[];
  @Input() isLoadingStories: boolean;
  @Input() hasError: boolean;
  @Input() areDataLoadedExternally: boolean;
  isWeb: boolean;
  imageAttributes: ImageAttribute[] = [
    {
      element: "class",
      value: "img-rounded",
    },
  ];
  currentMsisdn = this.dashboardService.getCurrentPhoneNumber();

  constructor(
    public modalController: ModalController,
    public animationCtrl: AnimationController,
    private storiesService: StoriesService,
    private platform: Platform,
    private followAnalyticsService: FollowAnalyticsService,
    private dashboardService: DashboardService
  ) {
    this.isWeb = platform.is("mobileweb");
  }

  ngOnInit() {
    if (!this.areDataLoadedExternally) this.fetchUserStories();
  }

  fetchUserStories() {
    this.isLoadingStories = true;
    this.storiesByCategory = [];
    this.hasError = false;
    this.storiesService
      .getCurrentStories()
      .pipe(
        tap((res: any) => {
          this.isLoadingStories = false;
          console.log(
            "groupeStoriesByCategory",
            this.storiesService.groupeStoriesByCategory(res)
          );
          this.storiesByCategory =
            this.storiesService.groupeStoriesByCategory(res);
        }),
        catchError((err) => {
          this.isLoadingStories = false;
          this.hasError = true;
          return of(err);
        })
      )
      .subscribe();
  }

  async presentModal(
    item: {
      categorie: {
        libelle?: string;
        ordre?: number;
        code?: string;
        zoneAffichage?: string;
      };
      stories: Story[];
      readAll: boolean;
    }
  ) {
    this.followAnalyticsService.registerEventFollow('story_clic', 'event', {msisdn: this.currentMsisdn})
    const modal = await this.modalController.create({
      component: VisualizeStoriesByCategoriesComponent,
      backdropDismiss: true,
      swipeToClose: true,
      mode: "ios",
      presentingElement: await this.modalController.getTop(),
      componentProps: {
        allStories: this.storiesByCategory,
        currentItem: item,
      },
    });
    modal.onDidDismiss().then((res) => {
      res?.role ? this.followAnalyticsService.registerEventFollow('story_close', 'event', {msisdn: this.currentMsisdn}) : '';
      if (res?.data) {
        this.updateInternalStoriesListe(
          res?.data?.index,
          res?.data?.storyByCategory
        );
      } else {
        this.fetchUserStories();
      }
    });
    return await modal.present();
  }

  updateInternalStoriesListe(
    index: number,
    item: {
      categorie: {
        libelle?: string;
        ordre?: number;
        code?: string;
        zoneAffichage?: string;
      };
      stories: Story[];
      readAll: boolean;
    }
  ) {
    this.storiesByCategory[index] = item;
    this.storiesByCategory[index].readAll = !this.storiesByCategory[
      index
    ].stories.filter((elt) => {
      return elt.read === false;
    }).length;
  }
}
