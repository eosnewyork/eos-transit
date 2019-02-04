// @flow
const fcbuffer = require('fcbuffer');
const assert = require('assert');
const asn1 = require('asn1-ber');

import { Serialize } from 'eosjs';


export default class LedgerDataManager {
  async serialize(chainId: any, transaction: any, types?: any, api?: any) : Promise<Buffer>{
    const writer = new asn1.BerWriter();
    const action = transaction.actions[0];
    var contract = await api.getContract(action.account);

    var sertype = "checksum256";
    encode(writer, sertype, chainId, types, "chainId");
  
    //encode(writer, fcbuffer.toBuffer(types.time(), transaction.expiration));
    var sertype = "time_point_sec";
    encode(writer, sertype, transaction.expiration, types, "transaction.expiration (0404)");
  
    //encode(writer, fcbuffer.toBuffer(types.uint16(), transaction.ref_block_num));
    var sertype = "uint16";
    encode(writer, sertype, transaction.ref_block_num, types, "transaction.ref_block_num (0402)");
  
    //encode(writer,fcbuffer.toBuffer(types.uint32(), transaction.ref_block_prefix));
    var sertype = "uint32";
    encode(writer, sertype, transaction.ref_block_prefix, types, "transaction.ref_block_prefix (0404)");
  
    //encode(writer,fcbuffer.toBuffer(types.unsigned_int(), 0)); //transaction.net_usage_words
    var sertype = "uint8";
    encode(writer, sertype, 0, types, "transaction.net_usage_words (hard coded to 0) (0401)");
  
    //encode(writer,fcbuffer.toBuffer(types.uint8(), transaction.max_cpu_usage_ms));
    var sertype = "uint8";
    encode(writer, sertype, transaction.max_cpu_usage_ms, types, "transaction.max_cpu_usage_ms  (0401)");
  
    //encode(writer,fcbuffer.toBuffer(types.unsigned_int(), transaction.delay_sec));
    var sertype = "uint8";
    encode(writer, sertype, transaction.delay_sec, types, "transaction.delay_sec (0401)");
  
    assert(transaction.context_free_actions.length === 0);
    //encode(writer, fcbuffer.toBuffer(types.unsigned_int(), 0));
    var sertype = "uint8";
    encode(writer, sertype, 0, types, "Not sure what the heck this is (Hard Coded to 0) (0401)");
  
    assert(transaction.actions.length === 1);
    //encode(writer, fcbuffer.toBuffer(types.unsigned_int(), 1));
    var sertype = "uint8";
    encode(writer, sertype, 1, types, "Not sure what the heck this is (Hard Coded to 1) (0401)");
  
    
  
    //encode(writer, fcbuffer.toBuffer(types.account_name(), action.account));
    var sertype = "name";
    encode(writer, sertype, action.account, types, "action.account (0408)");
  
    //encode(writer, fcbuffer.toBuffer(types.action_name(), action.name));
    var sertype = "name";
    encode(writer, sertype, action.name, types, "action.name (0408)");
  
    //encode(writer,fcbuffer.toBuffer(types.unsigned_int(), action.authorization.length));
    var sertype = "uint8";
    encode(writer, sertype, action.authorization.length, types, "action.authorization.length");
  
  
    for (let i = 0; i < action.authorization.length; i += 1) {
      const authorization = action.authorization[i];
  
      //encode(writer,fcbuffer.toBuffer(types.account_name(), authorization.actor));
      var sertype = "name";
      encode(writer, sertype, authorization.actor, types, "authorization.actor (was account_name)");
  
      //encode(writer,fcbuffer.toBuffer(types.permission_name(), authorization.permission));
      var sertype = "name";
      encode(writer, sertype, authorization.permission, types, "authorization.permission (was permission_name)");
    }
  
    //serializeActionData(contract: Contract, account: string, name: string, data: any, textEncoder: TextEncoder, textDecoder: TextDecoder)
    var b = Serialize.serializeActionData(contract, action.account, action.name, action.data);

    const data = Buffer.from(b, 'hex');
  
    //encode(writer, fcbuffer.toBuffer(types.unsigned_int(), data.length));
    var sertype = "uint8";
    encode(writer, sertype, data.length, types, "data.length");
  
    encodeRaw(writer, data, "raw data not serialized");
  
    assert(writer, transaction.transaction_extensions.length === 0);
    //encode(writer, fcbuffer.toBuffer(types.unsigned_int(), 0));
    var sertype = "uint8";
    var servalue = 0;
    encode(writer, sertype, servalue, types, "Hard Coded to 0");
  
    //encode(writer, fcbuffer.toBuffer(types.checksum256(), Buffer.alloc(32, 0)));
    var sertype = "checksum256";
    encode(writer, sertype, Buffer.alloc(32, 0).toString('hex'), types, "Buffer.alloc(32, 0).toString('hex')");     
    
    return writer.buffer;

  }
}


function encodeRaw(writter: any, rawvalue: any, fieldDescription: String) {

  var buffer = new Buffer(rawvalue);
  writter.writeBuffer(buffer, asn1.Ber.OctetString);
  var tmpwriter = new asn1.BerWriter();
  tmpwriter.writeBuffer(buffer, asn1.Ber.OctetString);
  //console.log(fieldDescription + " -> " + "rawdata" + " -> " + rawvalue + "-> " + tmpwriter.buffer.toString('hex'));
}

function encode(writter: any, sertype: any, rawvalue: any, types: any, fieldDescription: String) {

  var buf = new Serialize.SerialBuffer();
  types.get(sertype).serialize(buf,rawvalue);
  var buffer = new Buffer(buf.asUint8Array());

  writter.writeBuffer(buffer, asn1.Ber.OctetString);
  var tmpwriter = new asn1.BerWriter();
  tmpwriter.writeBuffer(buffer, asn1.Ber.OctetString);
  //console.log(fieldDescription + " -> " + sertype + " -> " + rawvalue + "-> " + tmpwriter.buffer.toString('hex'));
}


