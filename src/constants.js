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
export const WALLET_VERSION = '0.1.0'
export const INITIAL_SESSION_TIMEOUT = 5
export const NETWORK_BYTE = 'T'.charCodeAt(0);
export const INITIAL_NONCE = 0;
export const ADDRESS_VERSION = 5;
export const PAYMENT_TX = 2;
export const LEASE_TX = 3;
export const CANCEL_LEASE_TX = 4;
export const TRANSFER_TX = 12;
export const MINT_TX = 5;
export const PAYMENT_TX_NAME = 'payment';
export const TRANSFER_TX_NAME = 'transfer';
export const LEASE_TX_NAME = 'lease';
export const CANCEL_LEASE_TX_NAME = 'cancelLeasing';
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
//http://localhost:19922/
export const TESTNET_NODE = 'http://wallettestnet.vee.tech:9922'

export const ADDRESS_LENGTH = 35;

export const VEE_PRECISION = 1e8
export const TX_FEE = 0.1
export const FEE_SCALE = 100

export const API_VERSION = 1

