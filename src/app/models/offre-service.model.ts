export interface OffreService {
  code?: string;
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
  nouveau?: boolean;
  iconeBackground?: string;
}

export interface CategoryOffreServiceModel {
  categorieOffreServices?: any[];
  description?: string;
  libelle?: string;
  niveau?: string;
  offreServices?: OffreService;
  ordre?: number;
}
