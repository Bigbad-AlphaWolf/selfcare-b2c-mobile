import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  ArticleModel,
  ArticleCategoryModel,
  CommentModel,
} from 'src/app/models/article.model';
import { environment } from 'src/environments/environment';
import { SubscriptionModel } from 'src/shared';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { DashboardService } from '../dashboard-service/dashboard.service';
const { SERVER_API_URL, COMMUNITY_MANAGEMENT_SERVICE } = environment;
const COMMUNITY_BASE_URL = `${SERVER_API_URL}/${COMMUNITY_MANAGEMENT_SERVICE}/api`;
const ARTICLE_CATEGORIES_ENDPOINT = `${COMMUNITY_BASE_URL}/categorie-articles`;
const ARTICLES_ENDPOINT = `${COMMUNITY_BASE_URL}/articles`;
const ARTICLE_COMMENTS_ENDPOINT = `${COMMUNITY_BASE_URL}/commentaires-by-article`;
const POST_ARTICLE_COMMENT_ENDPOINT = `${COMMUNITY_BASE_URL}/commentaires`;
const FAMOUS_ARTICLE_ENDPOINT = `${COMMUNITY_BASE_URL}/famous-article`;
const RECOMMENDED_ARTICLE_ENDPOINT = `${COMMUNITY_BASE_URL}/recommended-article`;
const ALL_ARTICLES_ENDPOINT = `${COMMUNITY_BASE_URL}/admin/articles`;
@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private dashboardService: DashboardService
  ) {}

  getAllArticles(): Observable<ArticleModel[]> {
    return this.http
      .get(ALL_ARTICLES_ENDPOINT)
      .pipe(map((res: ArticleModel[]) => res));
  }

  getArticlesCategories(): Observable<ArticleCategoryModel[]> {
    return this.http
      .get(ARTICLE_CATEGORIES_ENDPOINT)
      .pipe(map((res: ArticleCategoryModel[]) => res));
  }

  getArticlesByCategory(
    category?: ArticleCategoryModel,
    params?
  ): Observable<HttpResponse<ArticleModel[]>> {
    const currentMsisdn = this.dashboardService.getCurrentPhoneNumber();
    return this.authenticationService.getSubscription(currentMsisdn).pipe(
      switchMap((sub: SubscriptionModel) => {
        let queryParams = `?code=${sub.code}`;
        if (category && category.code) {
          queryParams += `&categorie=${category.code}`;
        }
        if (params && typeof params === 'object') {
          for (const param in params) {
            queryParams += `&${param}=${params[param]}`;
          }
        }
        return this.http
          .get(`${ARTICLES_ENDPOINT}${queryParams}`, {
            observe: 'response',
          })
          .pipe(map((res: HttpResponse<ArticleModel[]>) => res));
      })
    );
  }

  getFamousArticles() {
    return this.getArticlesByCategory().pipe(map((res) => res.body));
    const currentMsisdn = this.dashboardService.getCurrentPhoneNumber();
    return this.http
      .get(`${FAMOUS_ARTICLE_ENDPOINT}/${currentMsisdn}`)
      .pipe(map((res: ArticleModel[]) => res));
  }

  getRecommendedArticles() {
    return this.getArticlesByCategory().pipe(map((res) => res.body));
    const currentMsisdn = this.dashboardService.getCurrentPhoneNumber();
    return this.http
      .get(`${RECOMMENDED_ARTICLE_ENDPOINT}/${currentMsisdn}`)
      .pipe(map((res: ArticleModel[]) => res));
  }

  getArticlesComments(
    article: ArticleModel,
    params?
  ): Observable<HttpResponse<CommentModel[]>> {
    const currentMsisdn = this.dashboardService.getCurrentPhoneNumber();
    let queryParams = '?';
    if (params && typeof params === 'object') {
      for (const param in params) {
        queryParams += `&${param}=${params[param]}`;
      }
    }
    return this.http
      .get(`${ARTICLE_COMMENTS_ENDPOINT}/${article.code}${queryParams}`, {
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<CommentModel[]>) => res));
  }

  postComment(comment: CommentModel): Observable<CommentModel> {
    return this.http
      .post(POST_ARTICLE_COMMENT_ENDPOINT, comment)
      .pipe(map((createdComment: CommentModel) => createdComment));
  }
}
