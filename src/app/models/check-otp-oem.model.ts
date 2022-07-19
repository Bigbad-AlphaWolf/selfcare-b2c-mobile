export interface CheckOtpOem {
  hmac: string;
  msisdn?: string;
  uuid?: any;
}

export interface CheckOtpCodeModel {
  code?: string;
  msisdn?: string;
  valid?: boolean;
  uuid?: string;
  hmac?: string;
}