import { WalletAccessContext, WalletAccessContextOptions } from './types';
import { initAccessContext } from './walletAccessContext';

export * from './types';
export { initAccessSession } from './walletAccessSession';
export { initAccessContext };

export let defaultAccessContext: WalletAccessContext | undefined = void 0;

export function initDefaultAccessContext(
  options: WalletAccessContextOptions
): WalletAccessContext {
  defaultAccessContext = initAccessContext(options);
  return defaultAccessContext;
}

export default defaultAccessContext;
