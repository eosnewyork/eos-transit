import { Wallet } from 'eos-transit';

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
  wallet: Wallet;
  amount: number;
  receiverName: string;
  currency: string;
  transactionStatus: TransactionStatus;
  transactionInfo?: TransactionInfo;
}
