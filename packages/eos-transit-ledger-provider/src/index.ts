import { ApiInterfaces, RpcInterfaces, JsonRpc } from 'eosjs';
import { WalletProvider, NetworkConfig, WalletAuth } from 'eos-transit';
import * as EosLedger from "./EosLedger";
import Transport from "@ledgerhq/hw-transport-u2f";
import $ from "jquery";
import serialize from './serialize'

class history_get_key_accounts_result {
  account_names: string[];
}

class LedgerProxy {

  async getPathKeys(keyPositions : number[]) : Promise<string[]>{
    let transport = await Transport.create();
    const eth = new EosLedger.default(transport);
    let keys: string[] = [''];

    for(let num of keyPositions) {
      let result = await eth.getAddress('44\'/194\'/0\'/0/'+num);
      keys[num] = result.address;
    }

    return keys;
  }

  async sign(toSign : Buffer) : Promise<string[]>{
    //return respone;

    let transport = await Transport.create();
    const eth = new EosLedger.default(transport);
    let signatures: string[] = [''];

    let toSignHex = toSign.toString('hex');   
    console.log('toSignHex');
    console.log(toSignHex);
    
    let signedTxn = await eth.signTransaction("44'/194'/0'/0/0",toSignHex);
    console.log(signedTxn);
    signatures[0] = "SomeBadSignature";


    return signatures;
  }


  connectToLedger(path: string) {
    let transport;

    const getEosAddress = async (path: string) => {
      console.log("Fetch key stored at Ledger path: "+path);
      transport = await Transport.create();
      
      const eth = new EosLedger.default(transport);
      const result = await eth.getAddress(path);

      //console.log(result);     
      return result.address;
    };

    getEosAddress(path).then(publicKey => {
      console.log('Public Key: ' + publicKey);
      this.convertKeyToAccount(publicKey);
    });
  }

  convertKeyToAccount(publicKey: string) {
    console.log('Fetch Accounts linked to ' + publicKey);
    
    
    /*
    //const rpc = new JsonRpc('https://api.eosnewyork.io');

    rpc.history_get_key_accounts(publicKey).then(result => {
      console.log(result.account_names.length + ' Account was linked to this public key');

      (result as history_get_key_accounts_result).account_names.forEach(accountName => {
        console.log(accountName);
      });
    }).catch(e => console.log('Error: ' + e));
    */
  }
}

export function makeSignatureProvider() {
  return {

    async getAvailableKeys() {
      console.log('get available keys called');
      return ["EOS5TYtUXsbRJrz61gsQWQho6AYyCcRFgbFm4TPfrEbzb43x8Ewfq"];
    },
    

    async sign(signatureProviderArgs: ApiInterfaces.SignatureProviderArgs): Promise<RpcInterfaces.PushTransactionArgs> 
    {
      console.log('sign requested');
      console.log('signatureProviderArgs.chainId: '+ signatureProviderArgs.chainId);
      console.log('signatureProviderArgs.serializedTransaction: '+ signatureProviderArgs.serializedTransaction);
      const signBuf = Buffer.concat([
        new Buffer(signatureProviderArgs.chainId, "hex"), new Buffer(signatureProviderArgs.serializedTransaction), new Buffer(new Uint8Array(32)),
        //new Buffer(signatureProviderArgs.chainId, "hex"), new Buffer("01af2f5c195d58dcd101000000000100a6823403ea3055000000572d3ccdcd01405d76789a9b315500000000a8ed323221405d76789a9b31553044286488e0af91102700000000000004454f53000000000000", "hex"), new Buffer(new Uint8Array(32)),
      ]);

      
      //Let's hard code a transaction that came from LSV1
      const signBufTmp = new Buffer("0420cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4ffe7d315c4df0edcc935e000000000100a6823403ea3055000000572d3ccdcd01405d76789a9b315500000000a8ed323221405d76789a9b31553044286488e0af91102700000000000004454f530000000000000000000000000000000000000000000000000000000000000000000000000000", "hex");
      //const signBufTmp = new Buffer("0420aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e90604049d75315c0402c85c0404ca6f261d040100040100040100040100040101040800a6823403ea30550408000000572d3ccdcd04010104081082f99f72f33fe5040800000000a8ed323204012604261082f99f72f33fe52082f99f72f33fe50a0000000000000004454f530000000005546573743104010004200000000000000000000000000000000000000000000000000000000000000000", "hex");
     
      // This is where I would like to get the transaction object as it's an input for the serialize method. 
      // signatureProviderArgs.serializedTransaction is available as input but I need the unserialized version.
      // The only way I know to do that is to call deserializeTransactionWithActions(signatureProviderArgs.serializedTransaction), the the minute I create a new JsonRpc object, things break. 
      // Example deserialize: https://github.com/GetScatter/ScatterDesktop/blob/master/src/plugins/defaults/eos.js#L797-L834

      // Simply adding this line, causes "Error: only one instance of babel-polyfill is allowed" when you go to the site. 
      const rpc = new JsonRpc('https://proxy.eosnode.tools');

      var txn = {};
      const ledgerBuffer = serialize(signatureProviderArgs.chainId, txn);

      let ledger = new LedgerProxy();
      let signatures = await ledger.sign(signBufTmp);


      var signatureArray = [""];
      var txn2 = new Uint8Array(10); 
      
      var respone : RpcInterfaces.PushTransactionArgs =  {
        signatures : signatureArray,
        serializedTransaction : txn2
      };

      
      return respone;
    }
  };
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
      console.log('connect function called.')
      return new Promise((resolve, reject) => {
        let ledger = new LedgerProxy();
        //We're only getting the key at index 0
        ledger.getPathKeys([0]).then(keysResult => {
          keys = keysResult;
          console.log('primise returned from connect.');
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
        console.log('login function called.' + keys);

        let keyObj = {
          public_key: keys[0]
        }

        $.ajax({
          url:  network.protocol + '://' + network.host + ':' + network.port + '/v1/history/get_key_accounts',
          type: 'POST',
          data: JSON.stringify(keyObj),
          success : function(data) {
            console.log(data);
            if(data.account_names.length>0) {
              console.log(data.account_names[0]);
              resolve({
                accountName: data.account_names[0],
                permission: "active",
                publicKey: keys[0]
              });
            } else {
              resolve({
                accountName: "badlookupsss",
                permission: "active",
                publicKey: "aEOS89EDpYUcbrZauAcvAN78EbMzK4kfC7shhuTH4Dr2A3ZYanyCax"
              });              
            }

          },
          error: function(request, status, error) {
            console.log(error);
          }
        });




      });
    }

    function logout(accountName?: string): Promise<boolean> {
      return Promise.resolve(true);
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
