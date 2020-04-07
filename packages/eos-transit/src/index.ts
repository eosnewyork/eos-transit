import { WalletAccessContext, WalletAccessContextOptions } from './types';
import { initAccessContext } from './walletAccessContext';
import { initWallet } from './wallet';

export * from './types';
export { initWallet } from './wallet';
export { initAccessContext };

export let defaultAccessContext: WalletAccessContext;

export function initDefaultAccessContext(
  options: WalletAccessContextOptions
): WalletAccessContext {
  defaultAccessContext = initAccessContext(options);
  return defaultAccessContext;
}

const WAL = {
  initDefaultAccessContext,

  get accessContext() {
    if (!defaultAccessContext) {
      throw new Error(`
        No default WalletAccessContext is configured. 
        Make sure to first run 'initDefaultAccessContext' to set it up.
      `);
    }

    return defaultAccessContext;
  },

  initWallet
};

export default WAL;

// force rebuild