import { ApiInterfaces } from 'eosjs';
import ScatterJS, { Blockchains, SocketService } from 'scatterjs-core';
import { WalletProvider } from '../../types';

function connectToScatter(appName: string) {
  return new Promise((resolve, reject) => {
    const scatter = ScatterJS.scatter;

    scatter
      .connect(
        appName,
        { initTimeout: 10000 }
      )
      .then((connected: boolean) => {
        if (connected) {
          resolve(scatter);
        } else {
          reject('Cannot connect to Scatter');
        }
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

function ensureConnected(appName: string): Promise<any> {
  return connectToScatter(appName);
}

export function makeScatterSignatureProvider(
  appName: string,
  networkConfig: any
) {
  return {
    async getAvailableKeys() {
      return SocketService.sendApiRequest({
        type: 'identityFromPermissions',
        payload: {}
      }).then((identity: any) => {
        if (!identity) return [];

        return identity.accounts
          .filter((account: any) => account.blockchain === 'eos')
          .map((account: any) => account.publicKey);
      });
    },

    async sign(
      signatureProviderArgs: ApiInterfaces.SignatureProviderArgs
    ): Promise<string[]> {
      const scatter = await ensureConnected(appName);

      const signatureRequestPayload = {
        ...signatureProviderArgs,
        blockchain: Blockchains.EOS,
        network: networkConfig,
        requiredFields: {}
      };

      const result = await SocketService.sendApiRequest({
        type: 'requestSignature',
        payload: signatureRequestPayload
      });

      if (!result) return [];
      return typeof result.signatures !== 'undefined'
        ? result.signatures
        : result;
    }
  };
}

export function makeScatterDesktopWalletProvider(
  appName: string,
  networkConfig: any
): WalletProvider {
  async function connect(accountName?: string): Promise<any> {
    try {
      const scatter = await ensureConnected(appName);
      const identity = await scatter.getIdentity({
        accounts: [networkConfig]
      });

      if (!identity) {
        return Promise.reject('No identity obtained from Scatter');
      }

      const account =
        (identity &&
          identity.accounts &&
          (identity.accounts as any[]).find(x => x.blockchain === 'eos')) ||
        void 0;

      if (!account) {
        return Promise.reject('No account data obtained from Scatter identity');
      }

      // Should be walletInfo (needs typing on the UAL level)
      return {
        accountName: account.name,
        accountAuthority: account.authority,
        accountPublicKey: account.publicKey
      };
    } catch (error) {
      console.log('[scatter-desktop]', error);
      return Promise.reject(error);
    }
  }

  return {
    name: 'scatter-desktop',
    signatureProvider: makeScatterSignatureProvider(appName, networkConfig),
    connect
  };
}
