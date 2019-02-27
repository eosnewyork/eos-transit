import React from 'react';
import WAL, { DiscoveryAccount, DiscoveryData } from 'eos-transit';
import { NoContent } from '../shared/NoContent';
import { WalletList } from '../shared/wallets/WalletList';

const { accessContext } = WAL;

export interface AvailableWalletListProps {
	onItemSelect?: () => void;
}

export function AvailableWalletList({ onItemSelect }: AvailableWalletListProps) {
	const addedWallets = accessContext.getWallets();
	const availableWalletProviders = accessContext.getWalletProviders();
	// d.filter((walletProvider) => !addedWallets.some((w) => w.provider.id === walletProvider.id));

	if (!availableWalletProviders.length) {
		return <NoContent message="No available wallet providers" />;
	}

	return (
		<WalletList
			walletProviders={availableWalletProviders}
			onItemSelect={(walletProvider) => {
				// TODO: Implement in a cleaner way
				if (typeof onItemSelect === 'function') {
					onItemSelect();
				}
				const wallet = accessContext.initWallet(walletProvider);
				wallet.connect().then(() => {
					wallet.discover().then((discoveryData: DiscoveryData) => {
						console.log(discoveryData);

						if (discoveryData.keyToAccountMap.length > 0) {
							// console.log(discoveryData.keyToAccountMap.length + ' keys returned, pick one');
							const index = 3;
							const keyObj = discoveryData.keyToAccountMap[index];

							const accountName = keyObj.accounts[0].account;
							const authorization = keyObj.accounts[0].authorization;
							const keyIndex = keyObj.index;
							const key = keyObj.key;

							wallet.login(accountName, authorization, keyIndex, key);
						} else {
							// 0 keys returned, we need to user to select an account
							wallet.login();
						}
					});
				});
			}}
		/>
	);
}

export default AvailableWalletList;
