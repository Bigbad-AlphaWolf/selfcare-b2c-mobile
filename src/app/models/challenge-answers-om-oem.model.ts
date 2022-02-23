export interface ChallengeAnswersOMOEM {
  barred: boolean;
  cnis: string[];
  datesNaissance: string[];
  eligible: boolean;
  message: string;
  messageDescriptionList: string[];
  noms: string[];
  prenoms: string[];
}

export interface ValidateChallengeOMOEM {
  index_cni: number;
  index_date_naissance: number;
  index_nom: number;
  index_prenom: number;
  msisdn: string;
}
