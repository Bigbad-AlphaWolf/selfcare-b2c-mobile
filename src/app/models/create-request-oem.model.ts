export interface CreateRequestOem {
  msisdn: string;
  type?: TypeRequest;
  motif: string;
  message: string;
  num_fix?: string;
  id_request?: string;
}

const enum TypeRequest {
  RECLAMATION = 'RECLAMATION',
  DERANGEMENT = 'DERANGEMENT',
}
