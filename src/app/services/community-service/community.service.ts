import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  ArticleModel,
  ArticleCategoryModel,
} from 'src/app/models/article.model';
import { environment } from 'src/environments/environment';
import { SubscriptionModel } from 'src/shared';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { DashboardService } from '../dashboard-service/dashboard.service';
const { SERVER_API_URL, COMMUNITY_MANAGEMENT_SERVICE } = environment;
const COMMUNITY_BASE_URL = `${SERVER_API_URL}/${COMMUNITY_MANAGEMENT_SERVICE}/api`;
const ARTICLE_CATEGORIES_ENDPOINT = `${COMMUNITY_BASE_URL}/categorie-articles`;
const ARTICLES_ENDPOINT = `${COMMUNITY_BASE_URL}/articles`;

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private dashboardService: DashboardService
  ) {}

  getArticlesCategories(): Observable<ArticleCategoryModel[]> {
    return this.http
      .get(ARTICLE_CATEGORIES_ENDPOINT)
      .pipe(map((res: ArticleCategoryModel[]) => res));
  }

  getArticlesByCategory(category): Observable<ArticleModel[]> {
    const currentMsisdn = this.dashboardService.getCurrentPhoneNumber();
    return this.authenticationService.getSubscription(currentMsisdn).pipe(
      switchMap((sub: SubscriptionModel) => {
        const queryParams = `?code=${sub.code}&categorie=${category.code}`;
        return this.http
          .get(`${ARTICLES_ENDPOINT}${queryParams}`)
          .pipe(map((res: ArticleModel[]) => res));
      })
    );
  }

  getArticlesComments() {}
}
