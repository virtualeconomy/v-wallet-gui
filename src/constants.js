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

export const INITIAL_SESSION_TIMEOUT = 5*60*1000
export const MAINNET_BYTE = 'W'.charCodeAt(0);
export const TESTNET_BYTE = 'T'.charCodeAt(0);
export const INITIAL_NONCE = 0;
export const ADDRESS_VERSION = 1;
export const TRANSFER_TX = 4;
export const TRANSFER_TX_NAME = 'transfer';
export const PRIVATE_KEY_BYTE_LENGTH = 32;
export const PUBLIC_KEY_BYTE_LENGTH = 32;
export const PUBLIC_KEY_LENGTH = 44;
export const PRIVATE_KEY_LENGTH = 44;
export const MINIMUM_FEE = 100000;
export const TRANSFER_ATTACHMENT_BYTE_LIMIT = 140;
export const DEFAULT_MIN_SEED_LENGTH = 25;
export const DEFAULT_ORDER_EXPIRATION_DAYS = 20;
export const TRX_RECORD_LIMIT = 30;
export const DEFAULT_BASIC_CONFIG = {
    requestOffset: 0,
    requestLimit: 100,
    logLevel: 'warning',
    timeDiff: 0
};
export const MAINNET_NODE = 'http://54.152.46.6:6869'
export const MAINNET_API = 'http://54.152.46.6:6869'

//for test
// export const TESTNET_NODE = 'https://nodes.wavesnodes.com'
export const TESTNET_NODE = 'http://34.229.136.59:6869'
export const TESTNET_API = 'http://34.229.136.59:6869'

export const ADDRESS_LENGTH = 35;


