import React, { Component } from 'react';
import { Subscribe } from 'unstated';
import styled from 'react-emotion';
import WAL, { Wallet } from 'wal-eos';
import { TransactionAddonMenuItem } from './TransactionAddonMenuItem';

// Visual components

const TransactionAddonMenuRoot = styled('div')({
  minWidth: 250,
  width: 330,
  padding: '8px'
});

const TransactionAddonMenuHeader = styled('header')({
  padding: '5px 0',
  fontSize: 11,
  fontWeight: 300,
  color: 'white',
  textTransform: 'uppercase',
  marginBottom: 5
});

// Exported component

export interface TransactionAddonMenuProps {
  onWalletSelect?: (selectedWallet: Wallet) => void;
}

export class TransactionAddonMenu extends Component<TransactionAddonMenuProps> {
  handleItemSelect = (wallet: Wallet) => {
    const { onWalletSelect } = this.props;
    if (typeof onWalletSelect === 'function') {
      onWalletSelect(wallet);
    }
  };

  getActiveWallets = () => {
    return WAL.accessContext.getActiveWallets();
  };

  render() {
    const { getActiveWallets, handleItemSelect } = this;
    const activeWallets = getActiveWallets();

    return (
      <TransactionAddonMenuRoot>
        <TransactionAddonMenuHeader>
          Run with wallet:
        </TransactionAddonMenuHeader>
        {activeWallets.map(wallet => (
          <TransactionAddonMenuItem
            key={wallet.provider.id}
            wallet={wallet}
            onSelect={handleItemSelect}
          />
        ))}
      </TransactionAddonMenuRoot>
    );
  }
}

// TODO: Subscribe to WAL instead
// export function TransactionAddonMenuConnected(
//   props: TransactionAddonMenuProps
// ) {
//   return (
//     <Subscribe to={[SessionStateContainer]}>
//       {(sessionStateContainer: SessionStateContainer) => (
//         <TransactionAddonMenu
//           sessionStateContainer={sessionStateContainer}
//           {...props}
//         />
//       )}
//     </Subscribe>
//   );
// }

// export default TransactionAddonMenuConnected;

export default TransactionAddonMenu;
