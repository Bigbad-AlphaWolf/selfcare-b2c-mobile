export interface IlliflexModel {
  data: number;
  amount: number;
  bonusSms: number;
  voice: number;
  validity: string;
  recipient: string;
  sender: string;
  recipientOfferCode: string;
  em?: string;
  pin?: string;
}
