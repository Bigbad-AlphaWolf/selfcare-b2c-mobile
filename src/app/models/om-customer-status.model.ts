import { CustomerOperationStatus } from './enums/om-customer-status.enum';

export interface OMCustomerStatusModel {
  operation: 'DEPLAFONNEMENT' | 'OUVERTURE_COMPTE' | 'FULL';
  operationStatus: CustomerOperationStatus;
  message: string;
  hmac: string;
  omNumber: string;
}

export enum OMStatusOperationEnum {
  DEPLAFONNEMENT = 'DEPLAFONNEMENT',
  OUVERTURE_COMPTE = 'OUVERTURE_COMPTE',
  FULL = 'FULL',
}
