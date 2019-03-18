import React, { Component } from 'react';
import WAL, { WalletProvider, Wallet, DiscoveryAccount, DiscoveryData } from 'eos-transit';
const { getWallets, getWalletProviders } = WAL.accessContext;
import { TestButton } from './ui/TestButton';
import { DebugButton } from './ui/DebugButton';
import { Toggle } from './ui/Toggle';

export interface LoginScreenState {
	showLoginOptions: boolean;
}

export class TestScreen extends Component<any, LoginScreenState> {
	accountName: string;
	permission: string;
	publicKey: string;
	private wallet: Wallet;

	constructor(props: any) {
		super(props);
		this.takeOverConsole();
	}

	async connect() {
		this.wallet = WAL.accessContext.initWallet(getWalletProviders()[0]);

		try {
			if (this.wallet) {
				this.logIfDebugEnabled('Calling Connect()');
				this.wallet.connect().then(() => {
					this.logIfDebugEnabled('Calling Discover()');
					this.wallet.discover({ pathIndexList: [ 0, 1, 2 ] }).then((discoveryData: DiscoveryData) => {
						// Normally we'd check the discovery data here.
						this.logIfDebugEnabled('Calling login()');
						this.logIfDebugEnabled('Transit will try to fetch account info for this account');
						this.wallet.login().then(() => {
							const auth = this.wallet;

							this.logIfDebugEnabled('Login Completed. The account info fetched from chain was:');
							// @ts-ignore: TypeScript doesn't have the full definition for accountInfo so ignore for now
							this.accountName = this.wallet.auth.accountName;
							this.logIfDebugEnabled('-- account_name: ' + this.accountName);
							// @ts-ignore:
							this.permission = this.wallet.auth.permission;
							this.logIfDebugEnabled('-- permission: ' + this.permission);
							// @ts-ignore:
							this.publicKey = this.wallet.auth.publicKey;
							this.logIfDebugEnabled('-- publicKey: ' + this.publicKey);
						});
					});
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	async runTxn() {
		this.logIfDebugEnabled('Run Transaction');

		const eosAmount: number = 0.0001;
		// const eosAmount: number = 1;
		const recipient: string = 'wozzawozza55';

		this.wallet.eosApi
			.transact(
				{
					actions: [
						{
							account: 'eosio.token',
							name: 'transfer',
							authorization: [
								{
									actor: this.accountName,
									permission: this.permission
								}
							],
							data: {
								from: this.accountName,
								to: `${recipient}`,
								quantity: `${eosAmount.toFixed(4)} EOS`,
								memo: 'A Test Transaction'
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
			.then((result) => {
				this.logIfDebugEnabled('Transaction success!');
				this.logIfDebugEnabled(JSON.stringify(result));
				return result;
			})
			.catch((error) => {
				console.error('Transaction error :(');
				console.error(JSON.stringify(error));
				throw error;
			});
	}

	render() {
		return (
			<div>
				<Toggle>XXX</Toggle>
				<br />
				<TestButton onClick={() => this.connect()}>Connect, Discover and Login</TestButton>
				<br />
				<TestButton onClick={() => this.runTxn()}>Run Transaction</TestButton>
				<br />
				<br />
				<br />
				<div id="logMessages">
					-------------- DEBUG ---------------
					<br />
					<br />
				</div>
			</div>
		);
	}

	async log(msg: string) {
		const content = document.getElementById('logMessages');
		if (content) {
			content.appendChild(document.createTextNode(msg));
			content.appendChild(document.createElement('br'));
		}
	}

	takeOverConsole() {
		const logfunc = this.log;
		const console = window.console;
		if (!console) return;
		// @ts-ignore:
		function intercept(method: any) {
			const original = console[method];
			console[method] = (...args: any) => {
				// We're going to log these console log messages to screen as well as log them to the console.
				logfunc(args[0]);
				if (original.apply) {
					// Do this for normal browsers
					original.apply(console, args);
				} else {
					// Do this for IE
					const message = Array.prototype.slice.apply(args).join(' ');
					original(message);
				}
			};
		}
		const methods = [ 'log', 'warn', 'error' ];
		methods.forEach((element) => {
			intercept(element);
		});
	}

	logIfDebugEnabled(msg: string) {
		const debug = localStorage.getItem('DEBUG');
		if (debug === 'true') {
			console.log(msg);
		}
	}
}
