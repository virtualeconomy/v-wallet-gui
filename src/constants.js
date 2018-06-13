"use strict";
// Derived from waves-api
//
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAINNET_BYTE = 'W'.charCodeAt(0);
exports.TESTNET_BYTE = 'T'.charCodeAt(0);
exports.INITIAL_NONCE = 0;
exports.ADDRESS_VERSION = 1;
exports.ALIAS_VERSION = 2;
exports.ISSUE_TX = 3;
exports.TRANSFER_TX = 4;
exports.REISSUE_TX = 5;
exports.BURN_TX = 6;
exports.EXCHANGE_TX = 7;
exports.LEASE_TX = 8;
exports.CANCEL_LEASING_TX = 9;
exports.CREATE_ALIAS_TX = 10;
exports.MASS_TRANSFER_TX = 11;
exports.MASS_TRANSFER_TX_VERSION = 1;
exports.ISSUE_TX_NAME = 'issue';
exports.TRANSFER_TX_NAME = 'transfer';
exports.REISSUE_TX_NAME = 'reissue';
exports.BURN_TX_NAME = 'burn';
exports.EXCHANGE_TX_NAME = 'exchange';
exports.LEASE_TX_NAME = 'lease';
exports.CANCEL_LEASING_TX_NAME = 'cancelLeasing';
exports.CREATE_ALIAS_TX_NAME = 'createAlias';
exports.PRIVATE_KEY_LENGTH = 32;
exports.PUBLIC_KEY_LENGTH = 32;
exports.MINIMUM_FEE = 100000;
exports.TRANSFER_ATTACHMENT_BYTE_LIMIT = 140;
exports.DEFAULT_MIN_SEED_LENGTH = 25;
exports.DEFAULT_ORDER_EXPIRATION_DAYS = 20;
exports.DEFAULT_BASIC_CONFIG = {
    minimumSeedLength: exports.DEFAULT_MIN_SEED_LENGTH,
    requestOffset: 0,
    requestLimit: 100,
    logLevel: 'warning',
    timeDiff: 0
};