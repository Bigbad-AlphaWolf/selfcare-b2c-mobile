import {CountryOem} from './country-oem.model';

export interface ContactOem {
  displayName?: string;
  numbers?: string[];
  thumbnail?: any;
  phoneNumber?: string;
  country?: CountryOem;
  formatedPhoneNumber?: string;
}
