import { Api, ApiInterfaces, RpcInterfaces, JsonRpc } from 'eosjs';
import { WalletProvider, NetworkConfig, WalletAuth } from 'eos-transit';
import * as EosLedger from "./EosLedger";
import Transport from "@ledgerhq/hw-transport-u2f";
import $ from "jquery";
import LedgerDataManager from './LedgerDataManager'
import "babel-polyfill"; 
import * as ecc from "eosjs-ecc";
import * as  bigi from "bigi"
// https://github.com/LedgerHQ/ledgerjs/issues/266
// https://github.com/JoinColony/purser/issues/184


class history_get_key_accounts_result {
  account_names: string[];
}

class LedgerProxy {

  async getPathKeys(keyPositions : number[]) : Promise<string[]>{
    let transport = await Transport.create();
    const eos = new EosLedger.default(transport);
    let keys: string[] = [''];

    for(let num of keyPositions) {
      let result = await eos.getAddress('44\'/194\'/0\'/0/'+num);
      keys[num] = result.address;
    }

    return keys;
  }

  async sign(toSign : Buffer) : Promise<string>{
    let transport = await Transport.create();
    const eos = new EosLedger.default(transport);
    let signatures: string[] = [''];

    let toSignHex = toSign.toString('hex');   
    let signedTxn = await eos.signTransaction("44'/194'/0'/0/0",toSignHex);
    
    var si = new ecc.Signature( bigi.fromHex(signedTxn.r), bigi.fromHex(signedTxn.s), bigi.fromHex(signedTxn.v));

    return si.toString();
  }

}


export interface ledgerWalletProviderOptions {
  id: string;
  name: string;
  shortName: string;
  description?: string;
  errorTimeout?: number;
}

export function ledgerWalletProvider({
  id,
  name,
  shortName,
  description,
  errorTimeout
}: ledgerWalletProviderOptions) {
  return function makeWalletProvider(network: NetworkConfig): WalletProvider {

    let keys: string[];

    function connect(appName: string) {
      return new Promise((resolve, reject) => {
        let ledger = new LedgerProxy();
        //We're only getting the key at index 0
        ledger.getPathKeys([0]).then(keysResult => {
          keys = keysResult;
          resolve(); 
        });
      });
    }

    function disconnect(): Promise<any> {
      return Promise.resolve();
    }

    // Authentication

    async function login(accountName?: string): Promise<WalletAuth> {
      return new Promise<WalletAuth>((resolve, reject) => {
        let keyObj = {
          public_key: keys[0]
        }

        const rpc = new JsonRpc(network.protocol + '://' + network.host + ':' + network.port);
        rpc.history_get_key_accounts(keys[0]).then(data => {
          if(data.account_names.length>0) {
            resolve({
              accountName: data.account_names[0],
              permission: "active",
              publicKey: keys[0]
            });
          } else {
            //Need to clean this up. Just wanted a dummy account so that I could tell nothing was found. 
            resolve({
              accountName: "badlookupsss",
              permission: "active",
              publicKey: "aEOS89EDpYUcbrZauAcvAN78EbMzK4kfC7shhuTH4Dr2A3ZYanyCax"
            });              
          }
        });

      });
    }

    function logout(accountName?: string): Promise<boolean> {
      return Promise.resolve(true);
    }

    function makeSignatureProvider() {
      return {
    
        async getAvailableKeys() {
          console.log('get available keys called');
          // Really we should not have to do this again becasue we already got the keys we care about when connect was called. Create a cache. 
          let ledger = new LedgerProxy();
          //We're only getting the key at index 0
          let keys = await ledger.getPathKeys([0]);
          console.log(keys);
          return [keys[0]];
        },
        
        async sign(signatureProviderArgs: ApiInterfaces.SignatureProviderArgs): Promise<RpcInterfaces.PushTransactionArgs> 
        {
    
          const rpc = new JsonRpc(network.protocol + '://' + network.host + ':' + network.port);
          var args = {
            rpc: rpc,
            authorityProvider: undefined,
            abiProvider: undefined,
            signatureProvider: this,
            chainId: undefined,
            textEncoder: undefined,
            textDecoder: undefined
          }; 
          const api = new Api(args);
          var _txn = await api.deserializeTransactionWithActions(signatureProviderArgs.serializedTransaction);
    
          var ledgerManager = new LedgerDataManager();
          const ledgerBuffer = await ledgerManager.serialize(signatureProviderArgs.chainId, _txn, api.abiTypes, api);
    
          let ledger = new LedgerProxy();
          let signature = await ledger.sign(ledgerBuffer);
    
          var signatureArray = [signature];
          
          var respone : RpcInterfaces.PushTransactionArgs =  {
            signatures : signatureArray,
            serializedTransaction : signatureProviderArgs.serializedTransaction
          };
          
          return respone;
        }
      };
    }

    const walletProvider: WalletProvider = {
      id,
      meta: {
        name,
        shortName,
        description
      },
      signatureProvider: makeSignatureProvider(),
      connect,
      disconnect,
      login,
      logout
    };

    return walletProvider;
  };
}

export default ledgerWalletProvider;
