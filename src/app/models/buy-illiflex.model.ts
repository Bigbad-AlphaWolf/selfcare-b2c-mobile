export interface BuyIlliflexModel {
  sender?: {
    msisdn?: string;
  };
  receiver?: {
    msisdn?: string;
  };
  bucket?: {
    budget?: {
      unit?: string;
      value?: number;
    };
    dataBucket?: {
      balance?: {
        amount: number;
        unit: string;
      };
      code?: number;
      maxBalance?: {
        amount?: number;
        unit?: string;
      };
      usageType?: string;
      validity?: string;
    };
    voiceBucket?: {
      balance?: {
        amount: number;
        unit: string;
      };
      code?: number;
      maxBalance?: {
        amount?: number;
        unit?: string;
      };
      usageType?: string;
      validity?: string;
    };
  };
}
