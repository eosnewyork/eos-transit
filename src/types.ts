import { EosSignArgs, EosSignature } from 'eosjs';

export type TransactionSignature = any;

export type EosSignProvider = (
  eosSignArgs: EosSignArgs
) => Promise<EosSignature[] | null>;

// Intergrations

export interface Integration {
  name: string;
  signProvider?: EosSignProvider;
  connect: (accountName?: string) => Promise<any>;
}

export interface IntegrationInstance {
  name: string;
  signProvider?: (eosSignArgs: EosSignArgs) => Promise<EosSignature[] | null>;
}

// Transactions

export type TransactionResult = any;

// Configuration

export interface UALOptions {
  appName: string;
  network?: string;
  chainId?: string;
  httpEndpoint?: string;
  expireInSeconds?: number;
  integrations: Integration[];
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
