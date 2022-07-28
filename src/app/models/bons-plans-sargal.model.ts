export interface BonPlanSargalModel {
  active?: boolean;
  dateDebut?: string;
  dateFin?: string;
  imagePath?: string;
  nom?: string;
  partnerReductions?: PartnerReductionModel[];
}

export interface PartnerReductionModel {
  imagePath: string;
  partner: PartnerSargalModel;
  reduction: ReductionModel;
}

export interface BonPlanSargalCategoryModel {
  description?: string;
  id?: number;
  nomCategorie?: string;
}

export interface ReductionModel {
  description?: string;
  profilSargal?: string;
  unite?: string;
  value?: number | string;
}

export interface PartnerSargalModel {
  categoryPartner?: BonPlanSargalCategoryModel;
  description: string;
  imagePartner: string;
  nomPartner: string;
  pointOfSales: any[];
  reductions: any[];
  siteWebUrl: string;
}
