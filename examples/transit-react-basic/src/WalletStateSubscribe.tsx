import React, { Component, ReactNode } from 'react';
import { StateUnsubscribeFn, Wallet, WalletState } from 'eos-transit';

export interface WalletStateSubscribeProps {
  wallet: Wallet;
  children?: (walletState: WalletState) => ReactNode;
}

export class WalletStateSubscribe extends Component<WalletStateSubscribeProps> {
  unsubscribe?: StateUnsubscribeFn;
  unmounted?: boolean;

  handleWalletStateUpdate = () => {
    if (!this.unmounted) this.forceUpdate();
  };

  componentDidMount() {
    const { wallet } = this.props;
    this.unsubscribe = wallet.subscribe(this.handleWalletStateUpdate);
  }

  componentWillUnmount() {
    this.unmounted = true;
    const { unsubscribe } = this;
    if (typeof unsubscribe === 'function') unsubscribe();
  }

  render() {
    const { children, wallet } = this.props;
    if (typeof children !== 'function') return null;
    return children(wallet.state);
  }
}

export default WalletStateSubscribe;
