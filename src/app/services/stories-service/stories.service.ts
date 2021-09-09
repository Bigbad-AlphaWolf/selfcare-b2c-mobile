import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {CategoryOffreServiceModel} from 'src/app/models/offre-service.model';
import {Story, StoryOem} from 'src/app/models/story-oem.model';
import {environment} from 'src/environments/environment';
import {STORIES_OEM_CONFIG, SubscriptionModel} from 'src/shared';
import {AuthenticationService} from '../authentication-service/authentication.service';
import {DashboardService} from '../dashboard-service/dashboard.service';

const {SERVICES_SERVICE, SERVER_API_URL} = environment;

const GET_USER_STORIES_ENDPOINT = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/stories-by-msisdn`;
const SET_USER_READ_STORY_INFO_ENDPOINT = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/user-read-stories`;

@Injectable({
  providedIn: 'root'
})
export class StoriesService {
  currentMsisdn: string = this.dashbService.getCurrentPhoneNumber();
  constructor(private http: HttpClient, private dashbService: DashboardService, private authServ: AuthenticationService) {}

  getCurrentStories(msisdn: string = this.currentMsisdn) {
    return this.authServ.getSubscription(msisdn).pipe(
      switchMap((res: SubscriptionModel) => {
        return this.http.get<Story[]>(`${GET_USER_STORIES_ENDPOINT}/${msisdn}?code=${res.code}`);
      })
    );
  }

  seeStory(story: Story) {
    const data = {msisdn: this.currentMsisdn, storyId: story.id};
    return this.http.post(`${SET_USER_READ_STORY_INFO_ENDPOINT}`, data);
  }

  groupeStoriesByCategory(
    list: StoryOem[]
  ): {
    categorie: {
      libelle?: string;
      ordre?: number;
      code?: string;
      zoneAffichage?: string;
    };
    stories: Story[];
  }[] {
    console.log('list', list);
    let result: {
      categorie: {
        libelle: string;
        ordre: number;
        code: string;
        zoneAffichage: string;
      };
      stories: Story[];
    }[] = [];
    let categories: {
      libelle: string;
      ordre: number;
      code: string;
      zoneAffichage: string;
    }[] = list.map(item => {
      return item.categorieOffreService;
    });
    categories.forEach(elt => {
      if (
        !result.find(element => {
          return element.categorie.libelle === elt.libelle;
        })
      ) {
        result.push({
          categorie: elt,
          stories: list
            .filter(value => {
              return value.categorieOffreService.libelle === elt.libelle;
            })
            .map(story => {
              story.duration = STORIES_OEM_CONFIG.DEFAULT_DURATION_BY_ELEMENT;
              return story;
            })
        });
      }
    });
    result = result.sort((elt1, elt2) => {
      return elt1.categorie.ordre - elt2.categorie.ordre;
    });
    console.log('categories', result);

    return result;
  }
}
