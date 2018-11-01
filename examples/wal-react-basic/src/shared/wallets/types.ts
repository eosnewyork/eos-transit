export interface WalletConnectionStatus {
  connecting?: boolean;
  connected: boolean;
  error?: boolean;
  errorMessage?: string;
}

export interface WalletProviderInfo {
  id: string;
  name?: string;
  shortName?: string;
  description?: string;
}

export interface WalletInfo {
  accountName: string;
  accountAuthority?: string;
  publicKey?: string;
  eosBalance?: number;
  ram?: number;
  cpu?: number;
  net?: number;
}

export interface WalletModel {
  providerInfo: WalletProviderInfo;
  connectionStatus: WalletConnectionStatus;
  walletInfo?: WalletInfo;
}
