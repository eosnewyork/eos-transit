import { EosSignArgs, EosSignature } from 'eosjs';

export type TransactionSignature = any;

export type EosSignProvider = (
  eosSignArgs: EosSignArgs
) => Promise<EosSignature[] | null>;

// Intergrations

export interface Integration {
  name: string;
  // signatureProvider?: SignatureProvider;
  signProvider?: EosSignProvider;
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
  getAccount: (accountName: string) => Promise<string>;
  transfer: (
    from: string,
    to: string,
    amount: number,
    memo?: string
  ) => Promise<TransactionResult>;
}
