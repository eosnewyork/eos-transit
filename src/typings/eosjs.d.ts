declare module 'eosjs' {
  type Asset = any;
  type TransferTransactionResult = any;

  export interface Network {
    getInfo(options: any): Promise<any>;
  }

  // TODO: Define correct types
  export type EosSignature = any;
  export type EosSignArgs = any;

  export interface EosConfig {
    chainId?: string | null; // 32 byte (64 char) hex string
    keyProvider?: string | string[]; // WIF string or array of keys..
    httpEndpoint?: string;
    logger?: any; // TODO: type
    expireInSeconds?: number;
    debug?: boolean;
    broadcast?: boolean;
    verbose?: boolean; // API activity
    sign?: boolean;
    signProvider?: (signargs: EosSignArgs) => Promise<EosSignature[] | null>;
  }

  export interface EosInstance {
    getInfo(): Promise<string>;
    getAccount(accountName: string): Promise<string>;
    getCurrencyBalance(
      code: string,
      account: string,
      symbol: string
    ): Promise<Asset[]>;

    // Special
    transfer(
      from: string,
      to: string,
      amount: number,
      memo?: string
    ): Promise<TransferTransactionResult>;
  }

  export interface Eos {
    (config?: EosConfig): EosInstance;
  }

  var Eos: Eos;
  export default Eos;
}
