import { DiscoveryOptions, NetworkConfig, WalletAuth, WalletProvider } from "eos-transit";
import { ApiInterfaces, RpcInterfaces } from "eosjs";

let accountPublickey: string;
const localApiURL: string = "http://127.0.0.1:47888/";

function logIfDebugEnabled(msg: string) {
  const debug = localStorage.getItem("DEBUG");
  if (debug === "true") {
    console.log("IN WALLET: " + msg);
  }
}

function makeSignatureProvider(network: NetworkConfig) {
  return {
    async getAvailableKeys() {
      logIfDebugEnabled("In getAvailableKeys");
      logIfDebugEnabled("Return Key: " + accountPublickey);
      const resp = await fetch(localApiURL + "getPublicKeys");
      const arr: string[] = await resp.json();
      return arr;
    },
    async sign(
      signatureProviderArgs: ApiInterfaces.SignatureProviderArgs
    ): Promise<RpcInterfaces.PushTransactionArgs> {
      logIfDebugEnabled("In Sign");
      const hexTrx = Buffer.from(signatureProviderArgs.serializedTransaction).toString("hex");
      const results = await fetch(localApiURL + "sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hex_data: hexTrx
        })
      });
      const jsonData = await results.json();
      const signatureArray = jsonData.sigs;
      const response: RpcInterfaces.PushTransactionArgs = {
        signatures: signatureArray,
        serializedTransaction: signatureProviderArgs.serializedTransaction
      };
      return response;
    }
  };
}

function signArbitrary(data: string, userMessage: string): Promise<string> {
  return new Promise((resolve, reject) => {
    reject("not implemented");
  });
}

export function myWalletProvider() {
  return function makeWalletProvider(network: NetworkConfig): WalletProvider {
    // Connection

    function connect(appName: string): Promise<any> {
      logIfDebugEnabled("The connect method of myWallet was called");
      const res = async function m2(): Promise<any> {
        try {
          const _r = await fetch(`${localApiURL}connect?appName=${appName}&chainId=${network.chainId}`);
          return await _r.json();
        } catch (e) {
          window.location.href = "simpleos://" + network.chainId;
          return false;
        }
      };
      return res();
    }

    function discover(discoveryOptions: DiscoveryOptions) {
      logIfDebugEnabled("The discover() method of myWallet was called");
      // You probably do not need to implement this method.
      return new Promise((resolve, reject) => {
        const discoveryInfo = {
          keys: [],
          note: "Wallet does not support discovery"
        };
        resolve(discoveryInfo);
      });
    }

    function disconnect(): Promise<any> {
      return Promise.resolve(true);
    }

    // Authentication
    async function login(accountName?: string): Promise<WalletAuth> {
      logIfDebugEnabled("The login method of myWallet was called");
      let url: string = localApiURL + "login";
      if (accountName) {
        url += (`?account=${accountName}`);
      }
	  const resp: any = await fetch(url);
	  console.log("resp");
	  console.log(resp);
      const results = await resp.json();
      accountPublickey = results.publicKey;
      return {
        accountName: results.accountName,
        permission: results.permission,
        publicKey: accountPublickey
      };
    }

    function logout(accountName?: string): Promise<any> {
      const res = async function m2(): Promise<any> {
        return true;
      };
      return res();
    }

    const walletProvider: WalletProvider = {
      id: "simpleos",
      meta: {
        name: "simplEOS",
        shortName: "simplEOS Wallet",
        description: "EOSIO Blockchain Interface & Wallet"
      },
      signatureProvider: makeSignatureProvider(network),
      connect,
      discover,
      disconnect,
      login,
      logout,
      signArbitrary
    };

    return walletProvider;
  };
}

export default myWalletProvider;
