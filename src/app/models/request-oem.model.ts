export interface RequestOem {
  status?: string;
  title?: string;
  description?: string;
  type?: string;
  order?: number;
  historic?: boolean;
  requestId?: string;
  currentState?: boolean;
  redirectTo?: RedirectionEnum;
}

export enum RedirectionEnum {
  IBOU = 'IBOU',
}
