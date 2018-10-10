import { EosSignArgs } from 'eosjs';
import ScatterJS, { Blockchains, SocketService } from 'scatterjs-core';
import { Integration } from '../../types';

function connectToScatter(appName: string) {
  return new Promise((resolve, reject) => {
    const scatter = ScatterJS.scatter;

    // Note: This actually tries to connect to Scatter Desktop explicitly
    // and logs out the console error if its not running.
    scatter
      .connect(
        appName,
        { initTimeout: 5000 }
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

export function makeScatterSignProvider(appName: string, networkConfig: any) {
  return async function scatterDesktopSignProvider(
    eosSignArgs: EosSignArgs
  ): Promise<any[] | null> {
    const scatter = await ensureConnected(appName);
    const identity = await scatter.getIdentity({
      accounts: [networkConfig]
    });

    const signatureRequestPayload = {
      ...eosSignArgs,
      blockchain: Blockchains.EOS,
      network: networkConfig,
      requiredFields: {}
    };

    const result = await SocketService.sendApiRequest({
      type: 'requestSignature',
      payload: signatureRequestPayload
    });

    if (!result) return null;
    return typeof result.signatures !== 'undefined'
      ? result.signatures
      : result;
  };
}

export function makeScatterDesktopIntegration(
  appName: string,
  networkConfig: any
): Integration {
  async function connect(accountName?: string): Promise<any> {
    const scatter = await ensureConnected(appName);
    const account =
      (scatter &&
        scatter.identity &&
        scatter.identity.accounts &&
        scatter.identity.accounts[0]) ||
      void 0;

    if (!account) {
      return Promise.reject('No account data passed by the wallet provider');
    }

    // Should be walletInfo (needs typing on the UAL level)
    return {
      accountName: account.name,
      accountAuthority: account.authority,
      accountPublicKey: account.publicKey
    };
  }

  return {
    name: 'scatter-desktop',
    signProvider: makeScatterSignProvider(appName, networkConfig),
    connect
  };
}
