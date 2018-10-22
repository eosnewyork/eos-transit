import { ApiInterfaces } from 'eosjs';

// Wallet Providers

export interface WalletProvider {
  name: string;
  signatureProvider: ApiInterfaces.SignatureProvider;
  connect: (accountName?: string, permission?: string) => Promise<any>;
}

export interface WalletProviderInstance {
  name: string;
  sign: (
    signatureProviderArgs: ApiInterfaces.SignatureProviderArgs
  ) => Promise<string[]>;
}

// Transactions

export type TransactionResult = any;

// Configuration

export interface UALOptions {
  appName: string;
  eosRpcUrl: string;
  network?: string;
  chainId?: string;
  expireInSeconds?: number;
  walletProviders: WalletProvider[];
}

// Instance and public APIs

export interface UALInstance {
  connect: (accountName?: string) => Promise<any>;
  getAccount: (accountName: string) => Promise<any>;
  transfer: (
    from: string,
    to: string,
    amount: number,
    memo?: string
  ) => Promise<TransactionResult>;
}
