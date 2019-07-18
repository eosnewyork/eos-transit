import { Wallet } from 'eos-transit';

// TODO: Consider moving to WAL in a generic and convenient way

	  
export function vote(wallet: Wallet) {
	const { auth } = wallet;
	if (!auth) {
		return Promise.reject('No auth information has been passed with transaction');
	}

	const { accountName: senderName, permission } = auth;

	// if user has ever voted, refresh their last vote
	// if (this.voting)
	// 	data = {voter: this.state.auth.accountName, proxy:this.state.accountInfo.voter_info.proxy, producers:this.state.accountInfo.voter_info.producers};

	// if user has never voted, allow voting for TITAN proxy
	const data = {voter: senderName, proxy:'eostitanvote', producers:[]};
	
	return wallet.eosApi.transact({
		actions: [{
		  account: 'eosio',
 		  name: 'voteproducer',
		  authorization: [{
			actor: senderName,
			permission: 'active',
		  }],
		  data
		}],
	  }, {blocksBehind: 3, expireSeconds: 60});
}	  

export function claim(wallet: Wallet) {
	const { auth } = wallet;
	if (!auth) {
		return Promise.reject('No auth information has been passed with transaction');
	}

	const { accountName: senderName, permission } = auth;

	return wallet.eosApi.transact({
		actions: [{
				account: 'efxstakepool',
				name: 'claim',
				authorization: [{
				actor: senderName,
				permission: 'active',
			}],
				data: {
				owner: senderName
			},
		},
		{
			account: 'efxstakepool',
			name: 'claim',
			authorization: [{
			  actor: senderName,
			  permission: 'active',
			}],
			data: {
			  owner: senderName
			},
		  }		
		],
	  }, {blocksBehind: 3, expireSeconds: 60});
}


export function stake(wallet: Wallet) {
	const { auth } = wallet;
	if (!auth) {
		return Promise.reject('No auth information has been passed with transaction');
	}

	const { accountName: senderName, permission } = auth;

	return wallet.eosApi.transact({
		actions: [
			{
			  account: 'efxstakepool',
			  name: 'open',
			  authorization: [{
				actor: senderName,
				permission: 'active',
			  }],
			  data: {
				owner: senderName,
				ram_payer: senderName,
			  },
			},
			{
			  account: 'effecttokens',
			  name: 'open',
			  authorization: [{
				actor: senderName,
				permission: 'active',
			  }],
			  data: {
				owner: senderName,
				symbol: `4,NFX`,
				ram_payer: senderName,
			  },
			},
		  
		  {
			account: 'effecttokens',
			name: 'transfer',
			authorization: [{
			  actor: senderName,
			  permission: 'active',
			}],
			data: {
			  from: senderName,
			  to: 'efxstakepool',
			  quantity: '1.0000 EFX',
			  memo: 'stake',
			},
		  }
		],
	  }, {blocksBehind: 3, expireSeconds: 60});
}

export function transfer(wallet: Wallet, receiverName: string, amount: number, memo: string = '', txnCount: number = 2) {
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

	const txnBuilder = [];

	console.log(`Build ${txnCount} transactions`);

	for (let index = 0; index < txnCount; index++) {
		txnBuilder.push(
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
					memo: `Test Txn ${index}`
				}
			}
		);
		
	}

	return wallet.eosApi
		.transact(
			{
				actions: txnBuilder
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
