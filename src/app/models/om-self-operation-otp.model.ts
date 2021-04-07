export interface OmInitOtpModel {
  adresse: string;
  birth_date: string;
  civilite: string;
  cniRectoBase64: string;
  cniVectoBase64: string;
  cni_recto: string;
  cni_verso: string;
  delivery_date?: string;
  expiry_date?: string;
  first_name: string;
  hmac2?: string;
  id_num: string;
  last_name: string;
  msisdn: string;
  type_piece?: string;
}

export interface OmCheckOtpModel {
  channel: string;
  cniRectoBase64: string;
  cniVersoBase64: string;
  imageBase64: string;
  kyc: OmInitOtpModel;
  msisdn: string;
  typeDemande: string;
}

export interface checkOtpResponseModel {
  act_app_vers: string;
  act_conf_vers: string;
  conf_string: string;
  content: {
    data: {
      compliantKyc: boolean;
      hmac: string;
      send: boolean;
    };
  };
  nb_notif: number;
  status_code: string;
  status_wording: string;
}
