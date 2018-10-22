import { Api, JsonRpc } from 'eosjs';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { UALOptions, UALInstance } from './types';
export * from './types';

function transfer(
  eosApi: Api,
  senderName: string,
  receiverName: string,
  amount: number,
  memo: string = ''
) {
  return new Promise((resolve, reject) => {
    if (!senderName) {
      return reject(new Error('Sender account name is not provided!'));
    }
    if (!receiverName) {
      return reject(new Error('Receiver account name is not provided!'));
    }

    if (!amount) return reject(new Error('Amount not specified'));

    return eosApi
      .transact({
        actions: [
          {
            account: senderName,
            name: 'transfer',
            authorization: [
              {
                actor: senderName,
                permission: 'active'
              }
            ],
            data: {
              from: senderName,
              to: receiverName,
              quantity: `${Number(amount).toFixed(4)} EOS`,
              memo
            }
          }
        ]
      })
      .then(resolve)
      .catch(reject);
  });
}

export function makeUAL(options: UALOptions): UALInstance {
  const { walletProviders } = options;
  const selectedProvider = walletProviders[0];

  const eosJsonRpc = new JsonRpc(options.eosRpcUrl, { fetch });

  // Note: The EOS instance is per-wallet-provider
  // (would be created upon user selecting one)
  const eosApi = new Api({
    rpc: eosJsonRpc,
    chainId: options.chainId,
    signatureProvider: selectedProvider.signatureProvider,
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder()
  });

  return {
    connect(accountName?: string) {
      return selectedProvider.connect(accountName);
    },

    getAccount(accountName: string) {
      return fetch(`${options.eosRpcUrl}/v1/chain/get_account`).then(response =>
        response.json()
      );
    },

    transfer(from: string, to: string, amount: number, memo?: string) {
      return transfer(eosApi, from, to, amount, memo);
    }
  };
}
