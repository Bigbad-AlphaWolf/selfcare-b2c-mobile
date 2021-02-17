export interface ArticleModel {
  id?: number;
  code?: string;
  titre?: string;
  sousTitre?: string;
  imageHeader?: string;
  actif?: boolean;
  contenu?: string;
  createdDate?: string;
  categorieArticle?: ArticleCategoryModel;
}

export interface ArticleCategoryModel {
  id?: number;
  code?: string;
  colorCode?: string;
  image?: string;
  name?: string;
}

export interface CommentModel {
  id?: number;
  content?: string;
  msisdn?: string;
  firstName?: string;
  lastName?: string;
  createdDate?: string;
  lastUpdatedDate?: string;
  isEdited?: boolean;
  article?: ArticleModel;
}
