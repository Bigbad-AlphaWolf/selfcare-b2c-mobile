export interface OffreService {
  id?: any;
  code?: string;
  codeOM?: string;
  titre?: string;
  shortDescription?: string;
  duree?: string;
  activated?: boolean;
  fullDescription?: string;
  tariff?: number;
  profilAbonnes?: any;
  formuleAbonnes?: any;
  description?: string;
  icone?: string;
  ordre?: number;
  libelle?: string;
  categorieOffreServices?: any[];
  redirectionType?: string;
  redirectionPath?: string;
  reasonDeactivation?: string;
  clicked?: boolean;
  newOffer?: boolean;
  passUsage?: boolean;
  iconeBackground?: string;
  banniere?: string;
  besoinAide?: boolean;
  typeService?: string;
  question?: string;
  reponse?: string;
  countTermMached?: number;
  countFiedMached?: number;
}

export interface CategoryOffreServiceModel {
  id?: number;
  categorieOffreServices?: CategoryOffreServiceModel[];
  description?: string;
  libelle?: string;
  niveau?: string;
  offreServices?: OffreService;
  ordre?: number;
  code?: string;
}
