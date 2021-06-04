import { CustomerOperationStatus } from './enums/om-customer-status.enum';

export interface OMCustomerStatusModel {
	operation: 'DEPLAFONNEMENT' | 'OUVERTURE_COMPTE';
	operationStatus: CustomerOperationStatus;
	message: string;
	hmac: string;
	omNumber: string;
}
