import { WalletAccessContext, WalletAccessContextOptions } from './types';
import { initAccessContext } from './walletAccessContext';

export * from './types';
export { initAccessSession } from './walletAccessSession';
export { initAccessContext };

export let defaultAccessContext: WalletAccessContext;

export function initDefaultAccessContext(
  options: WalletAccessContextOptions
): WalletAccessContext {
  defaultAccessContext = initAccessContext(options);
  return defaultAccessContext;
}

export default {
  get accessContext() {
    if (!defaultAccessContext) {
      throw new Error(`
        No default WalletAccessContext is configured. 
        Make sure to first run 'initDefaultAccessContext' to set it up.
      `);
    }

    return defaultAccessContext;
  }
};
