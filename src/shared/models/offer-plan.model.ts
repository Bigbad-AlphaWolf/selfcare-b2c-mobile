import { PassInfoModel } from '..';

export interface OfferPlan{
    bpTarget: string,
    bpValidityDurability: string,
    typeMPO: string,
    price: any,
    productOfferingId: any,
    canBeSubscribed: boolean,
    description: string,
    productOfferingName: string,
    pass?: PassInfoModel
}