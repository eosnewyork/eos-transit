import Eos from 'eosjs';
import { UALOptions, UALInstance } from './types';

function transfer(
  eosInstance: any,
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

    eosInstance
      .transfer({
        from: senderName,
        to: receiverName,
        quantity: `${Number(amount).toFixed(4)} EOS`,
        memo
      })
      .then(resolve)
      .catch(reject);
  });
}

export function makeUAL(options: UALOptions): UALInstance {
  const { integrations } = options;
  const selectedIntegration = integrations[0];

  // Note: The EOS instance is per-integration
  // (would be created upon user selecting one)
  const eosInstance = Eos({
    httpEndpoint: options.httpEndpoint,
    chainId: options.chainId,
    expireInSeconds: options.expireInSeconds || 60,
    signProvider: selectedIntegration.signProvider
  });

  return {
    getAccount(accountName: string) {
      return eosInstance.getAccount(accountName);
    },

    transfer(from: string, to: string, amount: number, memo?: string) {
      return transfer(eosInstance, from, to, amount, memo);
    }
  };
}
