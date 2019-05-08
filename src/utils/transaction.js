"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var axlsign_1 = require("../libs/axlsign");
var ByteProcessor_1 = require("./byteProcessor");
var crypto_1 = require("./crypto");
var concat_1 = require("./concat");
var base58_1 = require("../libs/base58");
var remap_1 = require("./remap");
var secure_random_1 = require("../libs/secure-random");
var convert_1 = require("../utils/convert");

var constants = require("../constants");
var INT_TYPE = constants.INT_TYPE
var ACCOUNT_TYPE = constants.ACCOUNT_ADDR_TYPE
var AMOUNT_TYPE = constants.AMOUNT_TYPE
var SHORTTEXT_TYPE = constants.SHORTTEXT_TYPE
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
function transferInt(tokenIdx) {
    var byteArr = convert_1.default.idxToByteArray(tokenIdx)

    var newBytes = []
    newBytes[0] = INT_TYPE
    return newBytes.concat(byteArr)
}
function transferAmount(amountData) {
    var byteArr = convert_1.default.bigNumberToByteArray(amountData)
    var typeArr = new Array(1);
    typeArr[0] = AMOUNT_TYPE;
    var dataArr = typeArr.concat(byteArr);
    return dataArr
}
function transferAccount(account) {
    var accountArr = base58_1.default.decode(account)

    var typeArr = [ACCOUNT_TYPE]
    for(let j=0; j<accountArr.length; ++j) {
        typeArr.push(accountArr[j])
    }
    return typeArr
}
function transferShortTxt(description) {
    var byteArr = convert_1.default.stringToByteArray(description)

    var typeArr = new Array(1);
    typeArr[0] = SHORTTEXT_TYPE ;

    var length = byteArr.length
    var lengthArr = convert_1.default.shortToByteArray(length)

    return typeArr.concat(lengthArr.concat(byteArr))
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

        var amountArr = transferAmount(amountData)

        var parametersNum = convert_1.default.shortToByteArray(1)

        var encodeArr = parametersNum.concat(amountArr)
        return base58_1.default.encode(Uint8Array.from(encodeArr));
    },
    prepareSend: function(recipient, amount) {
        var accountArr = transferAccount(recipient)
        var amountArr = transferAmount(amount)

        var parametersNum = convert_1.default.shortToByteArray(2)


        var encodeArr = parametersNum.concat(accountArr.concat(amountArr))
        return base58_1.default.encode(Uint8Array.from(encodeArr))
    },
    prepareSendAttachment: function(description) {
        return base58_1.default.encode(convert_1.default.stringToByteArray(description))
    },
    prepareCreate: function(max, unity, tokenDescription) {
        var maxArr = transferAmount(max)
        var unityArr = transferAmount(unity)
        var desArr = transferShortTxt(tokenDescription)

        var parametersNum = convert_1.default.shortToByteArray(3)

        var encodeArr = parametersNum.concat(maxArr.concat(unityArr.concat(desArr)))
        return [encodeArr, base58_1.default.encode(encodeArr)]
    },
    prepareRegContractSignature: function(contract, data, description, fee, feeScale, time, privateKey) {
        var bytess = []
        bytess[0] = 8 & (255)
        var contractBytes = convert_1.default.bytesToByteArrayWithSize(base58_1.default.decode(contract))
        var dataBytes = convert_1.default.bytesToByteArrayWithSize(data[0])
        var desBytes = convert_1.default.bytesToByteArrayWithSize(convert_1.default.stringToByteArray(description))
        var feeBytes = convert_1.default.bigNumberToByteArray(fee)
        var feeScaleBytes = convert_1.default.shortToByteArray(feeScale)
        var timeBytes = convert_1.default.bigNumberToByteArray(time)
        var signBytes = bytess.concat(contractBytes.concat(dataBytes.concat(desBytes.concat(feeBytes.concat(feeScaleBytes.concat(timeBytes))))))
        var privateKeyBytes = base58_1.default.decode(privateKey);
        var signature = axlsign_1.default.sign(privateKeyBytes, Uint8Array.from(signBytes), secure_random_1.default.randomUint8Array(64));
        return base58_1.default.encode(signature)

    },
    prepareExecContractSignature: function(contractId, funIdx, data, description, fee, feeScale, time, privateKey) {
        var bytess = []
        bytess[0] = 9 & (255)
        var contractIdBytes = base58_1.default.decode(contractId)
        var temBytes = []
        for (var len = 0 ; len < contractIdBytes.length; ++len) {
            temBytes [len] = contractIdBytes[len]
        }
        var funIdxBytes = convert_1.default.shortToByteArray(funIdx)
        var databyte = base58_1.default.decode(data)
        var dataBytes = convert_1.default.bytesToByteArrayWithSize(databyte)
        var desBytes = convert_1.default.bytesToByteArrayWithSize(convert_1.default.stringToByteArray(description))
        var feeBytes = convert_1.default.bigNumberToByteArray(fee)
        var feeScaleBytes = convert_1.default.shortToByteArray(feeScale)
        var timeBytes = convert_1.default.bigNumberToByteArray(time)
        var signBytes = bytess.concat(temBytes.concat(funIdxBytes.concat(dataBytes.concat(desBytes.concat(feeBytes.concat(feeScaleBytes.concat(timeBytes)))))))
        var privateKeyBytes = base58_1.default.decode(privateKey);
        var signature = axlsign_1.default.sign(privateKeyBytes, Uint8Array.from(signBytes), secure_random_1.default.randomUint8Array(64));
        return base58_1.default.encode(signature)

    },
    contractIDToTokenID(contraId) {

            var conId = base58_1.default.decode(contraId)
            var firstArr = [132]
            firstArr[0] = 132
            var secondArr = []
            for (var i = 1; i<conId.length-4; i++) {
                secondArr[i-1] = conId[i]
            }
            var thirdArr = convert_1.default.idxToByteArray(0)

            var encodeArr = firstArr.concat(secondArr.concat(thirdArr))
            var hashArr = crypto_1.default.hashChain(Uint8Array.from(encodeArr))
            var checkArr = hashArr.slice(0, 4)
            var tokenArr = encodeArr.concat(checkArr)
            var string = base58_1.default.encode(tokenArr)
            return string
    },
    tokenIDToContractID(tokenID) {
        let testde = base58_1.default.decode(tokenID)
        let tmpa = []
        for (var j = 0; j < testde.length - 4; j++) {
            tmpa.push(testde[j])
        }
        return base58_1.default.encode(tmpa)
    }
};
