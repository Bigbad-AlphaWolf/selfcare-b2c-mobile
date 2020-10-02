export interface OffreService {
  code?: number;
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
  categorieOffreServices?: any;
  redirectionType?: string;
  redirectionPath?: string;
  reasonDeactivation?: string;
  clicked?:boolean;
}
