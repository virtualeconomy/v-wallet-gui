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

var convert_1 = require("../utils/convert");


// Fields of the original data object
var paymentField = {
    timestamp: new ByteProcessor_1.Long('timestamp'),
    amount: new ByteProcessor_1.Long('amount'),
    fee: new ByteProcessor_1.Long('fee'),
    feeScale: new ByteProcessor_1.Short('feeScale'),
    recipient: new ByteProcessor_1.Recipient('recipient'),
    attachment: new ByteProcessor_1.Attachment('attachment')
}
var leaseField = {
    recipient: new ByteProcessor_1.Recipient('recipient'),
    amount: new ByteProcessor_1.Long('amount'),
    fee: new ByteProcessor_1.Long('fee'),
    feeScale: new ByteProcessor_1.Short('feeScale'),
    timestamp: new ByteProcessor_1.Long('timestamp')
}
var cancelLeasingField = {
    fee: new ByteProcessor_1.Long('fee'),
    feeScale: new ByteProcessor_1.Short('feeScale'),
    timestamp: new ByteProcessor_1.Long('timestamp'),
    txId: new ByteProcessor_1.Base58('transactionId')
}
var issueTokenField = {
    amount: new ByteProcessor_1.Long('amount'),
    attachment: new ByteProcessor_1.Attachment('attachment')
}
var storedFields = {};



function getFields(type) {
    switch (type) {
        case constants.PAYMENT_TX:
            storedFields = paymentField;
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
    return crypto_1.default.buildTransactionSignature(getBytes(__assign({}, transferData), tx_type), keyPair.privateKey);
}

function transformAttachment() {
    return base58_1.default.encode(Uint8Array.from(Array.prototype.slice.call(getExactBytes('attachment'), 2)));
}

function transformRecipient() {
    return remap_1.addRecipientPrefix(userData['recipient']);
}

function castToAPISchema(data, tx_type) {
    var apiSchema = data

    if (tx_type === constants.PAYMENT_TX) {
        __assign(apiSchema, {attachment: transformAttachment()})
    }
    __assign(apiSchema, { recipient : transformRecipient() })
    return apiSchema
}
function transferInt() {
    var oldBytes = convert_1.default.stringToByteArray('40004');
    var newBytes = oldBytes
    for (var key in newBytes) {
        newBytes[key] = (oldBytes[key]-48).toString(16)
    }
    return newBytes
}
function transferAmount(amountData) {
    var oldBytes = convert_1.default.longToByteArray(amountData)
    var newBytes = oldBytes
    var typeArr = []

    typeArr[0] = (3).toString(16)

    for (var key in newBytes) {
        newBytes[key] = (oldBytes[key]).toString(16)
    }
    return typeArr.concat(newBytes)
}
function transferShortTxt(description) {
    var oldBytes = convert_1.default.stringToByteArray(description)
    var newBytes = oldBytes
    for (var key in newBytes) {
        newBytes[key] = (oldBytes[key]).toString(16)
    }

    var typeArr = []
    typeArr[0] = (5).toString(16)

    var length = oldBytes.length
    var lengthArr = convert_1.default.lengthToByteArray(length)
    var newlengthArr = lengthArr
    for (var key in newlengthArr) {
        newlengthArr[key] = (lengthArr[key]).toString(16)
    }

    return typeArr.concat(newlengthArr.concat(newBytes))
}
function transferAccount(account) {
    var accountArr = base58_1.default.decode(account)
    var newArr = []
    for (var key in accountArr) {
        newArr[key] = (accountArr[key]).toString(16)
    }

    var typeArr = []
    typeArr[0] = (7).toString(16)

    return typeArr.concat(newArr)
}
export default {
    prepareForAPI: function(transferData, keyPair, tx_type) {
        getFields(tx_type)
        var signature = getSignature(transferData, keyPair, tx_type);
        return  __assign({}, (tx_type ? {transactionType: tx_type} : {}), {senderPublicKey: keyPair.publicKey}, castToAPISchema(userData, tx_type), {signature: signature});
    },
    isValidSignature: function(data, signature, publicKey, tx_type) {
        getFields(tx_type)
        return crypto_1.default.isValidTransactionSignature(getBytes(data, tx_type), signature, publicKey)
    },
    prepareColdForAPI: function(transferData, signature, publicKey, tx_type) {
        getFields(tx_type)
        getData(transferData);
        return __assign({}, (tx_type ? {transactionType: tx_type} : {}), {senderPublicKey: publicKey}, castToAPISchema(userData, tx_type), {signature:signature})
    },
    prepareIssueAndBurn: function(amountData) {
        var tokenIdx = transferInt()
        var amountArr = transferAmount(amountData)
        var encodeArr = amountArr.concat(tokenIdx)
        return base58_1.default.encode(encodeArr);
    },
    prepareCreate: function(max, unity, tokenDescription) {
        var maxArr = transferAmount(max)
        var unityArr = transferAmount(unity)
        var desArr = transferShortTxt(tokenDescription)
        var encodeArr = maxArr.concat(unityArr.concat(desArr))
        return base58_1.default.encode(encodeArr);
    },
    prepareSend: function(recipient, amount) {
        var accountArr = transferAccount(recipient)
        var tokenIdx = transferInt()
        var amountArr = transferAmount(amount)
        var encodeArr = accountArr.concat(amountArr.concat(tokenIdx))
        return base58_1.default.encode(encodeArr)
    }
};

