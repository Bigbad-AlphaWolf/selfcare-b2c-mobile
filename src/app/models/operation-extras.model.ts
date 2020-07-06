export interface OperationExtras{
    senderMsisdn?: string;
    recipientMsisdn?: string;
    recipientFirstname?: string;
    recipientLastname?:string;
    recipientName?:string;
    recipientFromContact?:boolean;
    purchaseType?:string;
    forSelf?:boolean;
    
    userHasNoOmAccount?:boolean;
    amount?:any;
    includeFee?:any;
    fee?:any;
}