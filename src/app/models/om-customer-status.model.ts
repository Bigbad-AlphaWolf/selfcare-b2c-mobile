import { CustomerStatusStep } from './enums/om-customer-status.enum';

export interface OMCustomerStatusModel {
	operation: 'DEPLAFONNEMENT' | 'OUVERTURE_COMPTE';
	operationStatus: CustomerStatusStep;
	message: string;
	hmac: string;
	omNumber: string;
}
