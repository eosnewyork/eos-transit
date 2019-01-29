import { ApiInterfaces, RpcInterfaces } from 'eosjs';
import { WalletProvider, NetworkConfig, WalletAuth } from 'eos-transit';

// A fake wallet provider that does nothing and always
// errors on connection attempts. Useful for demoing.

export function makeSignatureProvider() {
  return {
    async getAvailableKeys() {
      return [];
    },

    async sign(signatureProviderArgs: ApiInterfaces.SignatureProviderArgs): Promise<RpcInterfaces.PushTransactionArgs> {
      // This is where you'd implement your custom signature provider
      var signatureArray = [""];
      var txn = new Uint8Array(10); 
      
      var respone : RpcInterfaces.PushTransactionArgs =  {
        signatures : signatureArray,
        serializedTransaction : txn
      };

      return respone;
      
    }
  };
}

export interface StubWalletProviderOptions {
  id: string;
  name: string;
  shortName: string;
  description?: string;
  errorTimeout?: number;
}

export function stubWalletProvider({
  id,
  name,
  shortName,
  description,
  errorTimeout
}: StubWalletProviderOptions) {
  return function makeWalletProvider(network: NetworkConfig): WalletProvider {
    function connect(appName: string) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(`Cannot connect to "${shortName}" wallet provider`);
        }, errorTimeout || 2500);
      });
    }

    function disconnect(): Promise<any> {
      return Promise.resolve();
    }

    // Authentication

    async function login(accountName?: string): Promise<WalletAuth> {
      return new Promise<WalletAuth>((resolve, reject) => {
        setTimeout(() => {
          reject(`Cannot login to "${shortName}" wallet provider`);
        }, errorTimeout || 2500);
      });
    }

    function logout(accountName?: string): Promise<boolean> {
      return Promise.resolve(true);
    }

    const walletProvider: WalletProvider = {
      id,
      meta: {
        name,
        shortName,
        description
      },
      signatureProvider: makeSignatureProvider(),
      connect,
      disconnect,
      login,
      logout
    };

    return walletProvider;
  };
}

export default stubWalletProvider;
