/********************************************************************************
 *   Ledger Node JS API
 *   (c) 2016-2017 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/


// FIXME drop:
import { splitPath, foreach } from "./EosUtils";
// import Transport from "@ledgerhq/hw-transport-u2f";
//import Transport from "@ledgerhq/hw-transport";

const CLA = 0xD4;
const INS_GET_PUBLIC_KEY = 0x02;
const INS_SIGN = 0x04;
const INS_GET_APP_CONFIGURATION = 0x06;
const P1_CONFIRM = 0x01;
const P1_NON_CONFIRM = 0x00;
const P2_NO_CHAINCODE = 0x00;
const P2_CHAINCODE = 0x01;
const P1_FIRST = 0x00;
const P1_MORE = 0x80;


class Result1 {
  public publicKey: any;
  public address: any;
  public chainCode: any;
}
class Result2 {
  public arbitraryDataEnabled: any;
  public version: any;
}


/**
 * EOS API
 *
 * @example
 * import EOS from "@ledgerhq/hw-app-eth";
 * const eos = new EOS(transport)
 */
export default class EOS {

  transport: any;

  constructor(transport: any, exchangeTimeout = 5000, scrambleKey = "e0s") {
    this.transport = transport;
    transport.decorateAppAPIMethods(this, ["getAddress", "signTransaction", "signPersonalMessage", "getAppConfiguration"], scrambleKey);
  }


  /**
   * get EOS address for a given BIP 32 path.
   * @param path a path in BIP 32 format
   * @option boolDisplay optionally enable or not the display
   * @option boolChaincode optionally enable or not the chaincode request
   * @return an object with a publicKey, address and (optionally) chainCode
   * @example
   * eos.getAddress("44'/60'/0'/0/0").then(o => o.address)
   */
  getAddress(path: any, boolDisplay?: any, boolChaincode?: any) {
    let paths = splitPath(path);
    let buffer = new Buffer(1 + paths.length * 4);
    buffer[0] = paths.length;
    paths.forEach((element: any, index: any) => {
      buffer.writeUInt32BE(element, 1 + 4 * index);
    });
    return this.transport.send(CLA, INS_GET_PUBLIC_KEY, P1_NON_CONFIRM, P1_NON_CONFIRM, buffer).then((response:any) => {
      let result: Result1 = new Result1();
      let publicKeyLength = response[0];
      let addressLength = response[1 + publicKeyLength];
      result.publicKey = response.slice(1, 1 + publicKeyLength).toString("hex");
      result.address = response.slice(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength).toString("ascii");
      if (boolChaincode) {
        result.chainCode = response.slice(1 + publicKeyLength + 1 + addressLength, 1 + publicKeyLength + 1 + addressLength + 32).toString("hex");
      }
      return result;
    });
  }


  /**
   * You can sign a transaction and retrieve v, r, s given the raw transaction and the BIP 32 path of the account to sign
   * @example
   eos.signTransaction("44'/60'/0'/0/0", "e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080").then(result => ...)
   */
  signTransaction(path: any, rawTxHex: any) {
    let paths = splitPath(path);
    let offset = 0;
    let rawTx = new Buffer(rawTxHex, "hex");
    let toSend: any[] = [];
    let response: any;
    while (offset !== rawTx.length) {
      let maxChunkSize = offset === 0 ? 150 - 1 - paths.length * 4 : 150;
      let chunkSize = offset + maxChunkSize > rawTx.length ? rawTx.length - offset : maxChunkSize;
      let buffer = new Buffer(offset === 0 ? 1 + paths.length * 4 + chunkSize : chunkSize);
      if (offset === 0) {
        buffer[0] = paths.length;
        paths.forEach((element: any, index: any) => {
          buffer.writeUInt32BE(element, 1 + 4 * index);
        });
        rawTx.copy(buffer, 1 + 4 * paths.length, offset, offset + chunkSize);
      } else {
        rawTx.copy(buffer, 0, offset, offset + chunkSize);
      }
      toSend.push(buffer);
      offset += chunkSize;
    }
    return foreach(toSend, (data: any, i: any) => this.transport.send(CLA, INS_SIGN, i === 0 ? P1_FIRST : P1_MORE, P1_NON_CONFIRM, data).then((apduResponse: any) => {
      response = apduResponse;
    })).then(() => {
      const v = response.slice(0, 1).toString("hex");
      const r = response.slice(1, 1 + 32).toString("hex");
      const s = response.slice(1 + 32, 1 + 32 + 32).toString("hex");
      return { v, r, s };
    });
  }

  /**
   */
  getAppConfiguration() {
    return this.transport.send(CLA, INS_GET_APP_CONFIGURATION, P1_FIRST, P1_FIRST).then((response : any) => {
      let result: Result2 = new Result2();
      result.arbitraryDataEnabled = response[0] & 0x01;
      result.version = "" + response[1] + "." + response[2] + "." + response[3];
      return result;
    });
  }

  /**
  * You can sign a message according to eos_sign RPC call and retrieve v, r, s given the message and the BIP 32 path of the account to sign.
  * @example
  eos.signPersonalMessage("44'/60'/0'/0/0", Buffer.from("test").toString("hex")).then(result => {
  var v = result['v'] - 27;
  v = v.toString(16);
  if (v.length < 2) {
    v = "0" + v;
  }
  console.log("Signature 0x" + result['r'] + result['s'] + v);
  })
   */
  signPersonalMessage(path: any, messageHex: any) {
    let paths = splitPath(path);
    let offset = 0;
    let message = new Buffer(messageHex, "hex");
    let toSend: any[] = [];
    let response: any;
    while (offset !== message.length) {
      let maxChunkSize = offset === 0 ? 150 - 1 - paths.length * 4 - 4 : 150;
      let chunkSize = offset + maxChunkSize > message.length ? message.length - offset : maxChunkSize;
      let buffer = new Buffer(offset === 0 ? 1 + paths.length * 4 + 4 + chunkSize : chunkSize);
      if (offset === 0) {
        buffer[0] = paths.length;
        paths.forEach((element: any, index: any) => {
          buffer.writeUInt32BE(element, 1 + 4 * index);
        });
        buffer.writeUInt32BE(message.length, 1 + 4 * paths.length);
        message.copy(buffer, 1 + 4 * paths.length + 4, offset, offset + chunkSize);
      } else {
        message.copy(buffer, 0, offset, offset + chunkSize);
      }
      toSend.push(buffer);
      offset += chunkSize;
    }
    return foreach(toSend, (data: any, i: any) => this.transport.send(CLA, INS_GET_PUBLIC_KEY, i === 0 ? P1_FIRST : P1_MORE, P1_NON_CONFIRM, data).then((apduResponse : any)=> {
      response = apduResponse;
    })).then(() => {
      const v = response[0];
      const r = response.slice(1, 1 + 32).toString("hex");
      const s = response.slice(1 + 32, 1 + 32 + 32).toString("hex");
      return { v, r, s };
    });
  }
}