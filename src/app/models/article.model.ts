export interface ArticleModel {
  id?: number;
  code?: string;
  titre?: string;
  sousTitre?: string;
  imageHeader?: string;
  actif?: boolean;
  contenu?: string;
  createdDate?: string;
}

export interface ArticleCategoryModel {
  id?: number;
  code?: string;
  colorCode?: string;
  image?: string;
  name?: string;
}
