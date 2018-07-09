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
var storedFields = { senderPublicKey: new ByteProcessor_1.Base58('senderPublicKey'),
                    assetId: new ByteProcessor_1.AssetId('assetId'),
                    feeAssetId: new ByteProcessor_1.AssetId('feeAssetId'),
                    timestamp: new ByteProcessor_1.Long('timestamp'),
                    amount: new ByteProcessor_1.Long('amount'),
                    fee: new ByteProcessor_1.Long('fee'),
                    recipient: new ByteProcessor_1.Recipient('recipient'),
                    attachment: new ByteProcessor_1.Attachment('attachment')
}


function makeByteProviders() {
    var byteProviders = [];
    byteProviders.push(Uint8Array.from([constants.TRANSFER_TX]));
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

function getBytes(transferData) {
    var byteProviders = makeByteProviders();
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

function getSignature(transferData, keyPair) {
    return crypto_1.default.buildTransactionSignature(getBytes(__assign({}, transferData, { senderPublicKey: keyPair.publicKey })), keyPair.privateKey);
}

function transformAttachment() {
    return base58_1.default.encode(Uint8Array.from(Array.prototype.slice.call(getExactBytes('attachment'), 2)));
}

function transformRecipient() {
    return remap_1.addRecipientPrefix(userData['recipient']);
}

function castToAPISchema(data) {
    return __assign(data, { attachment: transformAttachment(), recipient: transformRecipient()});
}

export default {
    prepareForAPI: function(transferData, keyPair) {
        var signature = getSignature(transferData, keyPair);
        return  __assign({}, {transactionType: constants.TRANSFER_TX_NAME}, castToAPISchema(userData), {signature: signature});
    },
    isValidSignature: function(data, signature) {
        return crypto_1.default.isValidTransactionSignature(getBytes(data), signature, data.publicKey)
    },
    prepareColdForAPI: function(transferData, signature, timestamp) {
        getData(transferData);
        return __assign({}, {transactionType: constants.TRANSFER_TX_NAME}, castToAPISchema(userData), {signature:signature}, {timestamp: timestamp})
    }
};

