"use strict";
// Derived from waves-api
//
// Object.defineProperty(exports, "__esModule", { value: true });
import Base58 from 'base-58';
import crypto_1 from '@/js-v-sdk/src/utils/crypto'
var logger_1 = require("../utils/logger");
var seedDictionary_1 = require("./seedDictionary");
var wallet_constant = require('../constants')
import Account from '@/js-v-sdk/src/account'
var network = require('../network')
function generateNewSeed(length) {
    let random = crypto_1.generateRandomUint32Array(length);
    let wordCount = seedDictionary_1.default.length;
    let phrase = [];
    for (let i = 0; i < length; i++) {
        let wordIndex = random[i] % wordCount;
        phrase.push(seedDictionary_1.default[wordIndex]);
    }
    random.set(new Uint8Array(random.length));
    return phrase.join(' ');
}
function encryptSeedPhrase(seedPhrase, password, encryptionRounds) {
    if (encryptionRounds === void 0) { encryptionRounds = 5000; }
    if (password && password.length < 8) {
        logger_1.default.warn('Your password may be too weak');
    }
    if (encryptionRounds < 1000) {
        logger_1.default.warn('Encryption rounds may be too few');
    }
    return crypto_1.encryptSeed(seedPhrase, password, encryptionRounds);
}
function decryptSeedPhrase(encryptedSeedPhrase, password, encryptionRounds) {
    if (encryptionRounds === void 0) { encryptionRounds = 5000; }
    let wrongPasswordMessage = 'The password is wrong';
    let phrase;
    try {
        phrase = crypto_1.decryptSeed(encryptedSeedPhrase, password, encryptionRounds);
    }
    catch (e) {
        throw new Error(wrongPasswordMessage);
    }
    return phrase;
}
var Seed = /** @class */ (function () {
    function Seed(phrase, nonce) {
        this.phrase = phrase;
        this.nonce = nonce || wallet_constant.INITIAL_NONCE;
        let keys = crypto_1.buildKeyPair(phrase, this.nonce)
        let account = new Account()
        this.address = account.convertPublicKeyToAddress(keys.public_key, network.NETWORK_BYTE)
        this.keyPair = {
            privateKey: Base58.encode(keys.private_key),
            publicKey: Base58.encode(keys.public_key)
        };
        Object.freeze(this);
        Object.freeze(this.keyPair);
    }
    Seed.prototype.encrypt = function (password, encryptionRounds) {
        return encryptSeedPhrase(this.phrase, password, encryptionRounds);
    };
    return Seed;
}());
export default {
    create: function (words, nonce) {
        if (words === void 0 || typeof words === 'number') { words = 15; }
        let phrase = generateNewSeed(words);
        return new Seed(phrase, nonce);
    },
    fromExistingPhrase: function (phrase) {
        return new Seed(phrase);
    },
    fromExistingPhrasesWithIndex: function (phrase, nonce) {
        return new Seed(phrase, nonce)
    },
    isSystemPhrase: function (wordList) {
        for (let word in wordList) {
            if (seedDictionary_1.default.indexOf(wordList[word]) == -1) {
                return Number(word)
            }
        }
        return true
    },
    encryptSeedPhrase: encryptSeedPhrase,
    decryptSeedPhrase: decryptSeedPhrase
};
//# sourceMappingURL=Seed.js.map
