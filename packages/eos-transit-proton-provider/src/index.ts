import { NetworkConfig, WalletAuth, WalletProvider, DiscoveryOptions } from 'eos-transit';
import { ApiInterfaces } from 'eosjs';
import { Link, LinkOptions, LinkSession } from '@protonprotocol/proton-link';
import { BrowserTransportOptions } from '@protonprotocol/proton-browser-transport';
import { ConnectProton } from '@protonprotocol/proton-web-sdk'

class ProtonProvider implements WalletProvider {
  id = 'proton';
  meta = {
    name: 'Proton Web SDK',
    shortName: 'Proton Web SDK',
    description:
      'Use Proton Wallet to sign transactions'
  };

  link: Link;
  sessionId: string;

  session?: LinkSession;
  sessionProvider?: ApiInterfaces.SignatureProvider;
  signatureProvider = {
    getAvailableKeys: () => {
      if (!this.sessionProvider) {
        throw new Error('Not logged in');
      }
      return this.sessionProvider.getAvailableKeys();
    },
    sign: (args: ApiInterfaces.SignatureProviderArgs) => {
      if (!this.sessionProvider) {
        throw new Error('Not logged in');
      }
      return this.sessionProvider.sign(args);
    }
  };

  constructor(link: Link, sessionId: string) {
    this.link = link;
    this.sessionId = sessionId;
  }

  async connect() {}
  async disconnect() {}
  async discover(discoveryOptions: DiscoveryOptions) {
    return {
        keys: [],
        note: 'protonlink does not support discovery'
      };
  }

  async signArbitrary(): Promise<string> {
    throw new Error('signArbitrary not supported');
  }

  async login(
    accountName?: string,
    authorization?: string,
    index?: number,
    key?: string
  ): Promise<WalletAuth> {
    let session: LinkSession;
    let auth = undefined;
    let existing
    if (accountName && authorization) {
      auth = {
        actor: accountName,
        permission: authorization,
      }
      existing = await this.link.restoreSession(
        this.sessionId,
        auth
      );
    }
    if (existing) {
      session = existing;
    } else {
      const loginResult = await this.link.login(this.sessionId);
      session = loginResult.session;
    }
    this.session = session;
    this.sessionProvider = session.makeSignatureProvider();
    const walletAuth: WalletAuth = {
      accountName: session.auth.actor,
      permission: session.auth.permission,
      publicKey: session.publicKey
    };
    return walletAuth;
  }

  async logout(accountName?: string, permission?: string) {
    if (accountName && permission) {
      await this.link.removeSession(this.sessionId, { actor: accountName, permission });
    }
  }
}

type ProviderOptions = Partial<LinkOptions> &
  Partial<BrowserTransportOptions> & Partial<{ endpoints: string [] }>;

export default function makeProvider(
  sessionId: string,
  options: ProviderOptions = {}
) {
  return function(network: NetworkConfig): WalletProvider {
    // Add endpoints if needed
    if (!options.rpc && !options.endpoints) {
      options.endpoints = [network.protocol + '://' + network.host + ':' + network.port]
    }

    // Create link
    const link = ConnectProton({
      ...options,
      chainId: network.chainId,
      scheme: network.chainId === '384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0' ? 'proton' : 'proton-dev'
    }, {
      ...options,
      // Optional: Disable the browser transport success/failure messages to serve your own
      requestStatus: false
    })

    // Return provider
    return new ProtonProvider(link, sessionId);
  };
}

// force rebuild 2
