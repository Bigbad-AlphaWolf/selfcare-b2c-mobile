export interface SosPayloadModel {
  amount: number;
  typeCredit: 'data' | 'credit';
  msisdn: string;
}

export interface SoSModel {
  id: number;
  codeIN: number;
  nom: string;
  montant: number;
  frais: number;
  description: string;
  formuleMobiles: any[];
  typeSOS: TypeSOS;
}

export interface TypeSOS {
  id: number;
  ordre: number;
  nom: string;
}
