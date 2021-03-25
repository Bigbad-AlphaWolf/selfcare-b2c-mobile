import { CustomerStatusStep } from './enums/om-customer-status.enum';

export interface OMCustomerStatusModel {
  content: {
    data: {
      covid: boolean;
      om: boolean;
      full: boolean;
      step: CustomerStatusStep;
      hmac: string;
      request_wording: any;
    };
  };
  act_app_vers: string;
  act_conf_vers: string;
  status_code: string;
  status_wording: string;
  conf_string: string;
  nb_notif: number;
  omNumber: string;
}
