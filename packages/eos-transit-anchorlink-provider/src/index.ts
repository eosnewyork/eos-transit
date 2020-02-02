import { Link, LinkOptions, LinkSession, LinkTransport } from 'anchor-link';
import { NetworkConfig, WalletAuth, WalletProvider } from 'eos-transit';
import { ApiInterfaces } from 'eosjs';
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
  storage: SessionStorage;

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

  constructor(link: Link, sessionId: string, storage: SessionStorage) {
    this.link = link;
    this.sessionId = sessionId;
    this.storage = storage;
  }

  async connect() {}
  async disconnect() {}
  async discover() {}

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
    const existing = await this.storage.restore(
      this.link,
      this.sessionId,
      accountName
    );
    if (existing) {
      session = existing;
    } else {
      const loginResult = await this.link.login(this.sessionId);
      session = loginResult.session;
      await this.storage.store(session, this.sessionId, accountName);
    }
    this.session = session;
    this.sessionProvider = session.makeSignatureProvider();
    const auth: WalletAuth = {
      accountName: session.auth.actor,
      permission: session.auth.permission,
      publicKey: session.publicKey
    };
    return auth;
  }

  async logout(accountName?: string) {
    await this.storage.remove(this.sessionId, accountName);
    this.session = undefined;
    this.sessionProvider = undefined;
  }
}

interface SessionStorage {
  store(session: LinkSession, id: string, accountName?: string): Promise<void>;
  restore(
    link: Link,
    id: string,
    accountName?: string
  ): Promise<LinkSession | null>;
  remove(id: string, accountName?: string): Promise<void>;
}

class LocalSessionStorage implements SessionStorage {
  constructor(readonly keyPrefix: string = 'anchorlink') {}

  private sessionKey(id: string, accountName?: string) {
    return [this.keyPrefix, id, accountName]
      .filter(v => typeof v === 'string' && v.length > 0)
      .join('-');
  }

  async store(session: LinkSession, id: string, accountName?: string) {
    const key = this.sessionKey(id, accountName);
    const data = session.serialize();
    localStorage.setItem(key, JSON.stringify(data));
  }

  async restore(link: Link, id: string, accountName?: string) {
    const key = this.sessionKey(id, accountName);
    const data = JSON.parse(localStorage.getItem(key) || 'null');
    if (data) {
      return LinkSession.restore(link, data);
    }
    return null;
  }

  async remove(id: string, accountName?: string) {
    localStorage.removeItem(this.sessionKey(id, accountName));
  }
}

type ProviderOptions = Partial<LinkOptions> &
  Partial<BrowserTransportOptions> & {
    sessionStorage?: SessionStorage;
  };

export default function makeProvider(
  sessionId: string,
  options: ProviderOptions = {}
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
    const link = new Link({
      ...resolvedOptions,
      chainId: network.chainId,
      rpc: network.protocol + '://' + network.host + ':' + network.port
    });
    const storage = options.sessionStorage || new LocalSessionStorage();
    return new AnchorLinkProvider(link, sessionId, storage);
  };
}
