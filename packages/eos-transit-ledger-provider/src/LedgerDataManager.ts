// @flow
const fcbuffer = require('fcbuffer');
const assert = require('assert');
const asn1 = require('asn1-ber');

import { Serialize } from 'eosjs';
import { builtinModules } from 'module';


export default class LedgerDataManager {
  async serialize(chainId: any, transaction: any, types?: any, api?: any) : Promise<Buffer>{
    const writer = new asn1.BerWriter();
    const action = transaction.actions[0];
    var contract = await api.getContract(action.account);


    //We may as well start by getting the contract. Without this we won't know anything about the fields. 
    console.log("contract");
    console.log(contract);

    var sertype = "checksum256";
    var servalue = chainId;
    encode(writer, sertype, servalue, types, "chainId");
  
    //encode(writer, fcbuffer.toBuffer(types.time(), transaction.expiration));
    var sertype = "time_point_sec";
    var servalue = transaction.expiration;
    encode(writer, sertype, servalue, types, "transaction.expiration (0404)");
  
    //encode(writer, fcbuffer.toBuffer(types.uint16(), transaction.ref_block_num));
    var sertype = "uint16";
    var servalue = transaction.ref_block_num;
    encode(writer, sertype, servalue, types, "transaction.ref_block_num (0402)");
  
    //encode(writer,fcbuffer.toBuffer(types.uint32(), transaction.ref_block_prefix));
    var sertype = "uint32";
    var servalue = transaction.ref_block_prefix;
    encode(writer, sertype, servalue, types, "transaction.ref_block_prefix (0404)");
  
    //encode(writer,fcbuffer.toBuffer(types.unsigned_int(), 0)); //transaction.net_usage_words
    var sertype = "uint8";
    var servalue = 0;
    encode(writer, sertype, servalue, types, "transaction.net_usage_words (hard coded to 0) (0401)");
  
    //encode(writer,fcbuffer.toBuffer(types.uint8(), transaction.max_cpu_usage_ms));
    var sertype = "uint8";
    var servalue = transaction.max_cpu_usage_ms;
    encode(writer, sertype, servalue, types, "transaction.max_cpu_usage_ms  (0401)");
  
    //encode(writer,fcbuffer.toBuffer(types.unsigned_int(), transaction.delay_sec));
    var sertype = "uint8";
    var servalue = transaction.delay_sec;
    encode(writer, sertype, servalue, types, "transaction.delay_sec (0401)");
  
    assert(transaction.context_free_actions.length === 0);
    //encode(writer, fcbuffer.toBuffer(types.unsigned_int(), 0));
    var sertype = "uint8";
    var servalue = 0;
    encode(writer, sertype, servalue, types, "Not sure what the heck this is (Hard Coded to 0) (0401)");
  
    assert(transaction.actions.length === 1);
    //encode(writer, fcbuffer.toBuffer(types.unsigned_int(), 1));
    var sertype = "uint8";
    var servalue = 1;
    encode(writer, sertype, servalue, types, "Not sure what the heck this is (Hard Coded to 1) (0401)");
  
    
  
    //encode(writer, fcbuffer.toBuffer(types.account_name(), action.account));
    var sertype = "name";
    var servalue = action.account;
    encode(writer, sertype, servalue, types, "action.account (0408)");
  
    //encode(writer, fcbuffer.toBuffer(types.action_name(), action.name));
    var sertype = "name";
    var servalue = action.name;
    encode(writer, sertype, servalue, types, "action.name (0408)");
  
    //encode(writer,fcbuffer.toBuffer(types.unsigned_int(), action.authorization.length));
    var sertype = "uint8";
    var servalue = action.authorization.length;
    encode(writer, sertype, servalue, types, "action.authorization.length");
  
  
    for (let i = 0; i < action.authorization.length; i += 1) {
      const authorization = action.authorization[i];
  
      //encode(writer,fcbuffer.toBuffer(types.account_name(), authorization.actor));
      var sertype = "name";
      var servalue = authorization.actor;
      encode(writer, sertype, servalue, types, "authorization.actor (was account_name)");
  
      //encode(writer,fcbuffer.toBuffer(types.permission_name(), authorization.permission));
      var sertype = "name";
      var servalue = authorization.permission;
      encode(writer, sertype, servalue, types, "authorization.permission (was permission_name)");
    }
  
    console.log('serializeActionData');

    //serializeActionData(contract: Contract, account: string, name: string, data: any, textEncoder: TextEncoder, textDecoder: TextDecoder)
    var b = Serialize.serializeActionData(contract, action.account, action.name, action.data);

    console.log(b);
  
    console.log(transaction);
    //const data = Buffer.from(action.data, 'hex');
  
    //var dataStr = JSON.stringify(action.data);
    //var dataStrHex = new Buffer(dataStr).toString('hex');
    const data = Buffer.from(b, 'hex');
  
    //encode(writer, fcbuffer.toBuffer(types.unsigned_int(), data.length));
    var sertype = "uint8";
    var servalue = data.length;
    encode(writer, sertype, servalue, types, "data.length");
  
    encodeRaw(writer, data, "raw data not serialized");
  
    assert(writer, transaction.transaction_extensions.length === 0);
    //encode(writer, fcbuffer.toBuffer(types.unsigned_int(), 0));
    var sertype = "uint8";
    var servalue = 0;
    encode(writer, sertype, servalue, types, "Hard Coded to 0");
  
    //encode(writer, fcbuffer.toBuffer(types.checksum256(), Buffer.alloc(32, 0)));
    var sertype = "checksum256";
    var servalue = Buffer.alloc(32, 0).toString('hex');
    encode(writer, sertype, servalue, types, "Buffer.alloc(32, 0).toString('hex')");     

    
    return writer.buffer;

  }
}


function encodeRaw(writter: any, rawvalue: any, fieldDescription: String) {

  var buffer = new Buffer(rawvalue);
  writter.writeBuffer(buffer, asn1.Ber.OctetString);
  var tmpwriter = new asn1.BerWriter();
  tmpwriter.writeBuffer(buffer, asn1.Ber.OctetString);
  console.log(fieldDescription + " -> " + "rawdata" + " -> " + rawvalue + "-> " + tmpwriter.buffer.toString('hex'));
}

function encode(writter: any, sertype: any, rawvalue: any, types: any, fieldDescription: String) {

  var buf = new Serialize.SerialBuffer();
  types.get(sertype).serialize(buf,rawvalue);
  var buffer = new Buffer(buf.asUint8Array());

  writter.writeBuffer(buffer, asn1.Ber.OctetString);
  var tmpwriter = new asn1.BerWriter();
  tmpwriter.writeBuffer(buffer, asn1.Ber.OctetString);
  console.log(fieldDescription + " -> " + sertype + " -> " + rawvalue + "-> " + tmpwriter.buffer.toString('hex'));
}


