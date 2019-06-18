import { ApiInterfaces, RpcInterfaces } from 'eosjs';
import {
  WalletProvider,
  NetworkConfig,
  WalletAuth,
  DiscoveryOptions
} from 'eos-transit';
import Portis from '@portis/eos';

let portis: Portis;
let accName: string;
let permission: string;
let publicKey: string;

function makeSignatureProvider(network: NetworkConfig) {
  return {
    async getAvailableKeys() {
      return publicKey ? [publicKey] : [];
    },

    async sign(
      signatureProviderArgs: ApiInterfaces.SignatureProviderArgs
    ): Promise<RpcInterfaces.PushTransactionArgs> {
      const widgetCommunication = (await portis.widget).communication;
      const signedTx = await widgetCommunication.signTransaction(
        signatureProviderArgs,
        portis.config
      );

      if (!signedTx.result) {
        throw new Error(signedTx.error);
      }

      return {
        signatures: signedTx.result,
        serializedTransaction: signatureProviderArgs.serializedTransaction
      };
    }
  };
}

function signArbitrary(data: string, userMessage: string): Promise<string> {
  return new Promise((resolve, reject) => {
    reject('not implemented');
  });
}

export interface portisWalletProviderOptions {
  id?: string;
  name?: string;
  shortName?: string;
  description?: string;
  exchangeTimeout?: number;
  DappId?: string;
}

export function portisWalletProvider({
  id = 'PortisProvider',
  name = 'Portis',
  shortName = 'Portis',
  description = 'Portis EOS wallet provider',
  DappId = '__YOUR_DAPPID_HERE__'
}: portisWalletProviderOptions = {}) {
  return function makeWalletProvider(network: NetworkConfig): WalletProvider {
    // Connection
    async function connect(): Promise<boolean> {
      try {
        portis = new Portis(DappId, 'eos', {});
        portis.onLogin(
          (
            walletAddress: string,
            email?: string,
            reputation?: string,
            accountName?: string,
            accountPermission?: string
          ) => {
            console.log('insid eonlogin');
            publicKey = walletAddress;
            accName = accountName!;
            permission = accountPermission!;
          }
        );
        return Promise.resolve(true);
      } catch (err) {
        return Promise.reject('Cannot connect to Portis wallet provider.');
      }
    }

    function discover(discoveryOptions: DiscoveryOptions) {
      return new Promise((resolve, reject) => {
        const discoveryInfo = {
          keys: [],
          note: 'Wallet does not support discovery'
        };

        resolve(discoveryInfo);
      });
    }

    function disconnect(): Promise<any> {
      return Promise.resolve(true);
    }

    // Authentication
    async function login(accountName?: string): Promise<WalletAuth> {
      await portis.getAccounts();
      if (!accName) {
        // await portis.createEosAccount();
      }
      return { publicKey, accountName: accName, permission };
    }

    function logout(accountName?: string): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve({
          keys: [],
          note: 'Wallet does not support logout'
        });
      });
    }

    function show() {
      return portis.showPortis();
    }

    const walletProvider: WalletProvider = {
      //   id: 'PortisProvider',
      //   meta: {
      //     name: 'Portis',
      //     shortName: 'Portis',
      //     description: 'Portis EOS wallet provider'
      //   },
      id,
      meta: {
        name,
        shortName,
        description
      },
      signatureProvider: makeSignatureProvider(network),
      connect,
      discover,
      disconnect,
      login,
      logout,
      signArbitrary,
      show
    };

    return walletProvider;
  };
}

export default portisWalletProvider;
