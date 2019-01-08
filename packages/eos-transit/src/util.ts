import { NetworkConfig } from './types';

export function getNetworkUrl({ protocol, host, port }: NetworkConfig) {
  return `${protocol ? protocol : 'http'}://${host}${port ? `:${port}` : ''}`;
}

export function getErrorMessage(
  error: Error | string,
  fallbackMessage: string = 'Error'
) {
  if (error) {
    return typeof error === 'string' ? error : error.message || fallbackMessage;
  }
  return fallbackMessage;
}
