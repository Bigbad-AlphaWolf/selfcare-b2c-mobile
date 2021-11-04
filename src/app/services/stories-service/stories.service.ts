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
  constructor(private http: HttpClient, private dashbService: DashboardService, private authServ: AuthenticationService) {}

  getCurrentStories() {
    const msisdn = this.dashbService.getCurrentPhoneNumber();
    return this.authServ.getSubscription(msisdn).pipe(
      switchMap((res: SubscriptionModel) => {
        return this.http.get<Story[]>(`${GET_USER_STORIES_ENDPOINT}/${msisdn}?code=${res.code}`);
      })
    );
  }

  seeStory(story: Story) {
    const msisdn = this.dashbService.getCurrentPhoneNumber();
    const data = {msisdn, storyId: story.id};
    return this.http.post(`${SET_USER_READ_STORY_INFO_ENDPOINT}`, data);
  }

  groupeStoriesByCategory(
    list: StoryOem[]
  ): {
    categorie: {
      id?: string;
      libelle?: string;
      ordre?: number;
      code?: string;
      zoneAffichage?: string;
      image: string;
    };
    stories: Story[];
    readAll: boolean;
  }[] {
    let result: {
      categorie: {
        id?: string;
        libelle: string;
        ordre: number;
        code: string;
        zoneAffichage: string;
        image: string;
      };
      stories: Story[];
      readAll: boolean;
    }[] = [];
    let categories: {
      id?: string;
      libelle: string;
      ordre: number;
      code: string;
      zoneAffichage: string;
      image: string;
    }[] = list.map(item => {
      return item.categorieOffreService;
    });
    categories.forEach(elt => {
      if (
        !result.find(element => {
          return element.categorie.libelle === elt.libelle;
        })
      ) {
        const listStoriesFilteredByCat = list
          .filter(value => {
            return value.categorieOffreService.libelle === elt.libelle;
          })
          .sort((val1, val2) => {
            return +val2.read - +val1.read;
          });
        result.push({
          categorie: elt,
          stories: listStoriesFilteredByCat.map(story => {
            story.duration = STORIES_OEM_CONFIG.DEFAULT_DURATION_BY_ELEMENT;
            return story;
          }),
          readAll: !listStoriesFilteredByCat.filter(item => {
            return item.read === false;
          }).length
        });
      }
    });
    result = result.sort((elt1, elt2) => {
      return elt1.categorie.ordre - elt2.categorie.ordre;
    });
    console.log('categorieshhree', result);

    return result;
  }
}
