import { Wallet } from 'eos-transit';

// TODO: Consider moving to WAL in a generic and convenient way

export function transfer(wallet: Wallet, receiverName: string, amount: number, memo: string = '') {
	const { auth } = wallet;
	if (!auth) {
		return Promise.reject('No auth information has been passed with transaction');
	}

	const { accountName: senderName, permission } = auth;

	if (!senderName) {
		return Promise.reject(new Error('Sender account name is not available in a provided wallet auth metadata!'));
	}

	if (!receiverName) {
		return Promise.reject(new Error('Receiver account name is not provided!'));
	}

	if (!amount) return Promise.reject(new Error('Amount not specified'));

	return wallet.eosApi
		.transact(
			{
				actions: [
					{
						account: 'eosio.token',
						name: 'transfer',
						authorization: [
							{
								actor: senderName,
								permission
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
			},
			{
				broadcast: true,
				blocksBehind: 3,
				expireSeconds: 60
			}
		)
		.then((result: any) => {
			console.log('[txn][success]', result);
			return result;
		})
		.catch((error: any) => {
			console.error('[txn][error]', error);
			throw error;
		});
}
