import { ApiInterfaces } from 'eosjs';
import { WalletProvider, NetworkConfig } from '../types';

// A fake wallet provider that does nothing and always
// errors on connection attempts. Useful for demoing.

export function makeStubSignatureProvider() {
  return {
    async getAvailableKeys() {
      return [];
    },

    async sign(
      signatureProviderArgs: ApiInterfaces.SignatureProviderArgs
    ): Promise<string[]> {
      return [];
    }
  };
}

export interface StubWalletProviderOptions {
  id: string;
  name: string;
  shortName: string;
  description?: string;
}

export function stubWalletProvider({
  id,
  name,
  shortName,
  description
}: StubWalletProviderOptions) {
  return function makeStubWalletProvider(
    network: NetworkConfig
  ): WalletProvider {
    function connect(appName: string) {
      return Promise.reject(`Cannot connect to "${shortName}" wallet provider`);
    }

    function disconnect(): Promise<any> {
      return Promise.resolve();
    }

    // Authentication

    async function login(accountName?: string): Promise<boolean> {
      try {
        return true;
      } catch (error) {
        console.log('[scatter]', error);
        return Promise.reject(`Cannot login to "${shortName}" wallet provider`);
      }
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
      signatureProvider: makeStubSignatureProvider(),
      connect,
      disconnect,
      login,
      logout
    };

    return walletProvider;
  };
}
