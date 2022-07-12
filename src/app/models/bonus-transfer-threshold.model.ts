export interface BonusTransferThresholdModel {
  minTransferBonusAmount: number;
  maxTransferBonusAmount: number;
}

export const BONUS_TRANSFER_THRESHOLD_STORAGE_KEY = 'TRANSFER_BONUS_THRESHOLD';
export const DEFAULT_BONUS_TRANSFER_THRESHOLD: BonusTransferThresholdModel = {
    minTransferBonusAmount: 100,
    maxTransferBonusAmount: 10000,
}