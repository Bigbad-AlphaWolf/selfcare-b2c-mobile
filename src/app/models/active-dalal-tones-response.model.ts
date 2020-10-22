import { ActiveDalalToneModel } from './active-dalal-tone.model';

export interface ActiveDalalTonesResponseModel {
  category?: string;
  description?: string;
  isServiceEnabled?: true;
  name?: string;
  startDate?: string;
  relatedParty?: string;
  serviceCharacteristic?: ActiveDalalToneModel[];
}
