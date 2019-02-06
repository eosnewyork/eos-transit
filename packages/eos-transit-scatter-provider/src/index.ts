import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';
import { WalletProvider, NetworkConfig, WalletAuth } from 'eos-transit';

const { scatter } = ScatterJS;

scatter.loadPlugin(new ScatterEOS());

export function makeSignatureProvider(network: NetworkConfig) {
  // 3rd param: beta3 = true
  return scatter.eosHook({ ...network, blockchain: 'eos'}, null, true);
}

// TODO: Ability to pass Scatter options
export function scatterWalletProvider() {
  return function makeWalletProvider(network: NetworkConfig): WalletProvider {
    // Connection

    function connect(appName: string): Promise<any> {
      return scatter
        .connect(
          appName,
          { initTimeout: 10000 }
        )
        .then((connected: boolean) => {
          if (connected) return true;
          return Promise.reject('Cannot connect to Scatter');
        });
    }

    function disconnect(): Promise<any> {
      // TODO: Uncomment when Scatter implements this correctly
      // (probably by using `socket.close()` instead of `socket.disconnect()`)
      scatter.disconnect();
      return Promise.resolve(true);
    }

    // Authentication

    async function login(accountName?: string): Promise<WalletAuth> {
      try {
        const identity = await scatter.getIdentity({
          accounts: [{ ...network, blockchain: 'eos' }]
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
          return Promise.reject(
            'No account data obtained from Scatter identity'
          );
        }

        return {
          accountName: account.name,
          permission: account.authority,
          publicKey: account.publicKey
        };
      } catch (error) {
        console.log('[scatter]', error);
        return Promise.reject(error);
      }
    }

    function logout(accountName?: string): Promise<any> {
      return scatter.forgetIdentity();
    }

    const walletProvider: WalletProvider = {
      id: 'scatter',
      meta: {
        name: 'Scatter Desktop',
        shortName: 'Scatter',
        description:
          'Scatter Desktop application that keeps your private keys secure'
      },
      signatureProvider: makeSignatureProvider(network),
      connect,
      disconnect,
      login,
      logout
    };

    return walletProvider;
  };
}

export default scatterWalletProvider;
