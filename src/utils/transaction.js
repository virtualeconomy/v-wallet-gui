"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var ByteProcessor_1 = require("./byteProcessor");
var crypto_1 = require("./crypto");
var concat_1 = require("./concat");
var base58_1 = require("../libs/base58");
var remap_1 = require("./remap");
var constants = require("../constants");

// Fields of the original data object
var transferField = {
    senderPublicKey: new ByteProcessor_1.Base58('senderPublicKey'),
    assetId: new ByteProcessor_1.AssetId('assetId'),
    feeAssetId: new ByteProcessor_1.AssetId('feeAssetId'),
    timestamp: new ByteProcessor_1.Long('timestamp'),
    amount: new ByteProcessor_1.Long('amount'),
    fee: new ByteProcessor_1.Long('fee'),
    recipient: new ByteProcessor_1.Recipient('recipient'),
    attachment: new ByteProcessor_1.Attachment('attachment')
}
var leaseField = {
    senderPublicKey: new ByteProcessor_1.Base58('senderPublicKey'),
    recipient: new ByteProcessor_1.Recipient('recipient'),
    amount: new ByteProcessor_1.Long('amount'),
    fee: new ByteProcessor_1.Long('fee'),
    timestamp: new ByteProcessor_1.Long('timestamp'),
}
var cancelLeasingField = {
    senderPublicKey: new ByteProcessor_1.Base58('senderPublicKey'),
    fee: new ByteProcessor_1.Long('fee'),
    timestamp: new ByteProcessor_1.Long('timestamp'),
    txId: new ByteProcessor_1.Base58('transactionId')
}

var storedFields = {};

function getFields(type) {
    switch (type) {
        case constants.TRANSFER_TX:
            storedFields = transferField;
            break;
        case constants.LEASE_TX:
            storedFields = leaseField;
            break;
        case constants.CANCEL_LEASE_TX:
            storedFields = cancelLeasingField;
            break;
    }
}

function makeByteProviders(tx_type) {
    var byteProviders = [];
    byteProviders.push(Uint8Array.from([tx_type]));
    for(let name in storedFields) {
        if (storedFields[name] instanceof ByteProcessor_1.ByteProcessor) {
            // All user data must be represented as bytes
            byteProviders.push(function (data) { return storedFields[name].process(data[name]); });
        }
        else {
            throw new Error('Invalid field is passed to the createTransactionClass function');
        }
    }
    return byteProviders;
}

var userData;
// Save all needed values from user data
function getData(transferData) {
    userData = {}
    userData = Object.keys(storedFields).reduce(function (store, key) {
        store[key] = transferData[key];
        return store;
    }, {});
}

function getBytes(transferData, tx_type) {
    console.log(transferData)
    var byteProviders = makeByteProviders(tx_type);
    if (transferData === void 0) { transferData = {}; }
    // Save all needed values from user data
    getData(transferData);
    var _dataHolders = byteProviders.map(function (provider) {
        if (typeof provider === 'function') {
            return provider(userData);
        }
        else {
            return provider;
        }
    });
    return concat_1.concatUint8Arrays.apply(void 0, _dataHolders);
}

function getExactBytes(fieldName) {
    if (!(fieldName in storedFields)) {
         throw new Error("There is no field '" + fieldName + "' in transfer transaction");
    }
    return storedFields[fieldName].process(userData[fieldName]);
}

function getSignature(transferData, keyPair, tx_type) {
    return crypto_1.default.buildTransactionSignature(getBytes(__assign({}, transferData, { senderPublicKey: keyPair.publicKey }), tx_type), keyPair.privateKey);
}

function transformAttachment() {
    return base58_1.default.encode(Uint8Array.from(Array.prototype.slice.call(getExactBytes('attachment'), 2)));
}

function transformRecipient() {
    return remap_1.addRecipientPrefix(userData['recipient']);
}

function castToAPISchema(data, tx_type) {
    var apiSchema = data

    if (tx_type === constants.TRANSFER_TX) {
        __assign(apiSchema, {attachment: transformAttachment()})
    }
    __assign(apiSchema, { recipient : transformRecipient() })
    return apiSchema
}

export default {
    prepareForAPI: function(transferData, keyPair, tx_type) {
        getFields(tx_type)
        var signature = getSignature(transferData, keyPair, tx_type);
        return  __assign({}, (tx_type ? {transactionType: tx_type} : {}), castToAPISchema(userData, tx_type), {signature: signature});
    },
    isValidSignature: function(data, signature) {
        return crypto_1.default.isValidTransactionSignature(getBytes(data), signature, data.publicKey)
    },
    prepareColdForAPI: function(transferData, signature, timestamp, tx_type) {
        getFields(tx_type)
        getData(transferData);
        return __assign({}, (tx_type ? {transactionType: tx_type} : {}), castToAPISchema(userData, tx_type), {signature:signature}, {timestamp: timestamp})
    }
};

