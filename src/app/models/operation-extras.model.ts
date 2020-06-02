export interface OperationExtras{
    senderMsisdn?: string;
    recipientMsisdn?: string;
    recipientFirstname?: string;
    recipientLastname?:string;
    purchaseType?:string;
    self?:boolean;
    userHasNoOmAccount?:boolean;
    amount?:any;
    includeFee?:any;
    fee?:any;
}