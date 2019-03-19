// @flow
const fcbuffer = require('fcbuffer');
const assert = require('assert');
const asn1 = require('asn1-ber');
// const { TextEncoder, TextDecoder } = require('text-encoding');

import { Serialize } from 'eosjs';

export default class LedgerDataManager {
	async serialize(chainId: any, transaction: any, types?: any, api?: any): Promise<Buffer> {
		// in this process we're doing two things:
		// 1. We're going to be appending to a BER writer .. this is what's going to be sent to the ledger to sign.
		// 2. We're going to strip the BER ending from the pieces and reconstruct the serialized transaction (see fcbufferMatch string that is built) that was built by eosjs. What the ledger is signing should match what eosjs is going to send to the server side.
		// We continue to send the serialized transaction that eosjs generated to the server (NOT the one we're building here). It's better to have a transaction fail due to a mismatch rather than execute a transaction that didn't match the users intention.
		let fcbufferMatch = '';

		const writer = new asn1.BerWriter();
		const action = transaction.actions[0];
		var contract = await api.getContract(action.account);

		var sertype = 'checksum256';
		encode(writer, sertype, chainId, types, 'chainId');

		//encode(writer, fcbuffer.toBuffer(types.time(), transaction.expiration));
		var sertype = 'time_point_sec';
		fcbufferMatch =
			fcbufferMatch + encode(writer, sertype, transaction.expiration, types, 'transaction.expiration (0404)');

		//encode(writer, fcbuffer.toBuffer(types.uint16(), transaction.ref_block_num));
		var sertype = 'uint16';
		fcbufferMatch =
			fcbufferMatch +
			encode(writer, sertype, transaction.ref_block_num, types, 'transaction.ref_block_num (0402)');

		//encode(writer,fcbuffer.toBuffer(types.uint32(), transaction.ref_block_prefix));
		var sertype = 'uint32';
		fcbufferMatch =
			fcbufferMatch +
			encode(writer, sertype, transaction.ref_block_prefix, types, 'transaction.ref_block_prefix (0404)');

		//encode(writer,fcbuffer.toBuffer(types.unsigned_int(), 0)); //transaction.net_usage_words
		var sertype = 'uint8';
		fcbufferMatch =
			fcbufferMatch + encode(writer, sertype, 0, types, 'transaction.net_usage_words (hard coded to 0) (0401)');

		//encode(writer,fcbuffer.toBuffer(types.uint8(), transaction.max_cpu_usage_ms));
		var sertype = 'uint8';
		fcbufferMatch =
			fcbufferMatch +
			encode(writer, sertype, transaction.max_cpu_usage_ms, types, 'transaction.max_cpu_usage_ms  (0401)');

		//encode(writer,fcbuffer.toBuffer(types.unsigned_int(), transaction.delay_sec));
		var sertype = 'uint8';
		fcbufferMatch =
			fcbufferMatch + encode(writer, sertype, transaction.delay_sec, types, 'transaction.delay_sec (0401)');

		assert(transaction.context_free_actions.length === 0);
		//encode(writer, fcbuffer.toBuffer(types.unsigned_int(), 0));
		var sertype = 'uint8';
		fcbufferMatch =
			fcbufferMatch +
			encode(writer, sertype, 0, types, 'Not sure what the heck this is (Hard Coded to 0) (0401)');

		assert(transaction.actions.length === 1);
		//encode(writer, fcbuffer.toBuffer(types.unsigned_int(), 1));
		var sertype = 'uint8';
		fcbufferMatch =
			fcbufferMatch +
			encode(writer, sertype, 1, types, 'Not sure what the heck this is (Hard Coded to 1) (0401)');

		//encode(writer, fcbuffer.toBuffer(types.account_name(), action.account));
		var sertype = 'name';
		fcbufferMatch = fcbufferMatch + encode(writer, sertype, action.account, types, 'action.account (0408)');

		//encode(writer, fcbuffer.toBuffer(types.action_name(), action.name));
		var sertype = 'name';
		fcbufferMatch = fcbufferMatch + encode(writer, sertype, action.name, types, 'action.name (0408)');

		//encode(writer,fcbuffer.toBuffer(types.unsigned_int(), action.authorization.length));
		var sertype = 'uint8';
		fcbufferMatch =
			fcbufferMatch + encode(writer, sertype, action.authorization.length, types, 'action.authorization.length');

		for (let i = 0; i < action.authorization.length; i += 1) {
			const authorization = action.authorization[i];

			//encode(writer,fcbuffer.toBuffer(types.account_name(), authorization.actor));
			var sertype = 'name';
			fcbufferMatch =
				fcbufferMatch +
				encode(writer, sertype, authorization.actor, types, 'authorization.actor (was account_name)');

			//encode(writer,fcbuffer.toBuffer(types.permission_name(), authorization.permission));
			var sertype = 'name';
			fcbufferMatch =
				fcbufferMatch +
				encode(
					writer,
					sertype,
					authorization.permission,
					types,
					'authorization.permission (was permission_name)'
				);
		}

		//serializeActionData(contract: Contract, account: string, name: string, data: any, textEncoder: TextEncoder, textDecoder: TextDecoder)
		// @ts-ignore - we don't seem to really need TextEncoder or TextDecoder and it adds a large overhead to the package.
		var b = Serialize.serializeActionData(contract, action.account, action.name, action.data, null, null);
		const data = Buffer.from(b, 'hex');

		//encode(writer, fcbuffer.toBuffer(types.unsigned_int(), data.length));
		var sertype = 'varuint32';
		fcbufferMatch =
			fcbufferMatch +
			encode(
				writer,
				sertype,
				data.length,
				types,
				'data.length (IMPORTANT, this is a varuint32 - the byte length varies depending on the data size)'
			);

		fcbufferMatch = fcbufferMatch + encodeRaw(writer, data, data.length, 'raw data not serialized');

		assert(writer, transaction.transaction_extensions.length === 0);
		//encode(writer, fcbuffer.toBuffer(types.unsigned_int(), 0));
		var sertype = 'uint8';
		var servalue = 0;
		fcbufferMatch = fcbufferMatch + encode(writer, sertype, servalue, types, 'Hard Coded to 0');

		//encode(writer, fcbuffer.toBuffer(types.checksum256(), Buffer.alloc(32, 0)));
		var sertype = 'checksum256';
		encode(writer, sertype, Buffer.alloc(32, 0).toString('hex'), types, "Buffer.alloc(32, 0).toString('hex')");

		// This can be used as a sanity check against the transaction that was generated by
		// console.log('fcbufferMatch:');
		// console.log(fcbufferMatch);

		return writer.buffer;
	}
}

function encodeRaw(writter: any, rawvalue: any, rawvalueLength: any, fieldDescription: String) {
	// var debugBuffer = new Buffer(rawvalue);
	// console.log("rawvalue that we're being asked to DER encode: ");
	// console.log(debugBuffer.toString('hex'));

	var buffer = new Buffer(rawvalue);
	writter.writeBuffer(buffer, asn1.Ber.OctetString);
	var tmpwriter = new asn1.BerWriter();
	tmpwriter.writeBuffer(buffer, asn1.Ber.OctetString);
	// console.log(fieldDescription + ' -> ' + 'rawdata' + ' -> ' + rawvalue + '-> ' + tmpwriter.buffer.toString('hex'));

	// This is a veriable length prefix so we need to calculate how much to truncate off the front.
	let length = tmpwriter.buffer.toString('hex').length;
	let rawvalueHexLength = rawvalueLength * 2;
	let lenthDiff = length - rawvalueHexLength;

	return tmpwriter.buffer.toString('hex').slice(lenthDiff);
}

function encode(writter: any, sertype: any, rawvalue: any, types: any, fieldDescription: String) {
	var buf = new Serialize.SerialBuffer();
	types.get(sertype).serialize(buf, rawvalue);
	var buffer = new Buffer(buf.asUint8Array());

	writter.writeBuffer(buffer, asn1.Ber.OctetString);
	var tmpwriter = new asn1.BerWriter();
	tmpwriter.writeBuffer(buffer, asn1.Ber.OctetString);
	// console.log(fieldDescription + ' -> ' + sertype + ' -> ' + rawvalue + '-> ' + tmpwriter.buffer.toString('hex'));

	return tmpwriter.buffer.toString('hex').slice(4);
}
