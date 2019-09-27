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
export const WALLET_VERSION = '0.2.1'
export const INITIAL_SESSION_TIMEOUT = 5
export const INITIAL_NONCE = 0;
export const TRANSFER_ATTACHMENT_BYTE_LIMIT = 140;
export const TX_TEST_EXPLORER = 'https://testexplorer.v.systems/transactions/'
export const TX_EXPLORER = 'https://explorer.v.systems/transactions/'
export const SHOW_UNSUPPORTED_FUNCTION = false
