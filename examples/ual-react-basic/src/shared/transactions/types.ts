import { WalletModel } from 'shared/wallets/types';

export interface TransactionStatus {
  inProgress?: boolean;
  progressStatus?: string;
  success?: boolean;
  successMessage?: string;
  error?: boolean;
  errorMessage?: string;
}

export interface TransactionInfo {
  id?: string;
  // TODO: Other data
}

export interface TransactionModel {
  wallet: WalletModel;
  amount: number;
  receiverName: string;
  currency: string;
  transactionStatus: TransactionStatus;
  transactionInfo?: TransactionInfo;
}
