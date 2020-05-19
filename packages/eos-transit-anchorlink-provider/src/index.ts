import { Link, LinkOptions, LinkSession, LinkTransport } from 'anchor-link';
import { NetworkConfig, WalletAuth, WalletProvider, DiscoveryOptions } from 'eos-transit';
import { ApiInterfaces, JsonRpc } from 'eosjs';
import BrowserTransport, {
  BrowserTransportOptions
} from 'anchor-link-browser-transport';

class AnchorLinkProvider implements WalletProvider {
  id = 'anchor-link';
  meta = {
    name: 'Anchor Link',
    shortName: 'Anchor Link',
    description:
      'Use Anchor (or any other ESR compatible wallet) to sign transactions'
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
        note: 'anchorlink does not support discovery'
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
    await this.link.removeSession(this.sessionId, { actor: accountName, permission });
  }
}

type ProviderOptions = Partial<LinkOptions> &
  Partial<BrowserTransportOptions>;

export default function makeProvider(
  sessionId: string,
  options: ProviderOptions = {
    transport: new BrowserTransport()
  }
) {
  return function(network: NetworkConfig): WalletProvider {
    let resolvedOptions: LinkOptions;
    if (!options.transport) {
      resolvedOptions = {
        ...(options as any),
        transport: new BrowserTransport(options)
      };
    } else {
      resolvedOptions = options as LinkOptions;
    }
    let rpc:string | JsonRpc = network.protocol + '://' + network.host + ':' + network.port
    if (options.rpc) {
      rpc = options.rpc
    }
    const link = new Link({
      ...resolvedOptions,
      chainId: network.chainId,
      rpc,
    });
    return new AnchorLinkProvider(link, sessionId);
  };
}

// force rebuild 2
