import { WalletAccessSession } from 'eos-ual';

// TODO: Consider moving to WAL in a generic and convenient way

export function transfer(
  walletSession: WalletAccessSession,
  receiverName: string,
  amount: number,
  memo: string = ''
) {
  const { accountInfo } = walletSession.state;
  if (!accountInfo) {
    return Promise.reject(
      'No account information has been passed with transaction'
    );
  }

  const { name: senderName } = accountInfo;

  if (!senderName) {
    return Promise.reject(
      new Error(
        'Sender account name is not available in provided wallet session!'
      )
    );
  }

  if (!receiverName) {
    return Promise.reject(new Error('Receiver account name is not provided!'));
  }

  if (!amount) return Promise.reject(new Error('Amount not specified'));

  return walletSession.eosApi.transact({
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
  });
}
