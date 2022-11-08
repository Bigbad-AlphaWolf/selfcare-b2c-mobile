export interface InfosAbonneModel {
  birthDate?: string;
  contactNumbers?: string[];
  familyName?: string;
  gender?: string;
  givenName?: string;
  status?: string;
  title?: string;
  individualIdentification?: { identificationId: string; type: string }[];
}
