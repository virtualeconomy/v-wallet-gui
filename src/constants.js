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
export const NETWORK_BYTE = 'M'.charCodeAt(0);
export const INITIAL_NONCE = 0;
export const ADDRESS_VERSION = 5;
export const PAYMENT_TX = 2;
export const LEASE_TX = 3;
export const CONTRACT_CREATE_TX = 8;
export const CONTRACT_EXEC_TX =9;
export const CANCEL_LEASE_TX = 4;
export const INT_TYPE = 4;
export const ACCOUNT_ADDR_TYPE = 2;
export const CONTRACT_TYPE = 6;
export const SHORTTEXT_TYPE = 5;
export const AMOUNT_TYPE = 3;
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

export const NODE_IP = '/api'
export const ADDRESS_LENGTH = 35;
export const TX_TEST_EXPLORER = 'https://testexplorer.v.systems/transactions/'
export const TX_EXPLORER = 'https://explorer.v.systems/transactions/'
export const VSYS_PRECISION = 1e8
export const TOKEN_FEE = 100
export const TX_FEE = 0.1
export const FEE_SCALE = 100
export const PROTOCOL = 'v.systems'
export const CONTRACT_EXEC_FEE = 0.3
export const ISSUE_FUNCIDX = 1
export const BURN_FUNCIDX = 2
export const SUPERSEDE_FUNCIDX = 0
export const SPLIT_FUNCIDX = 3
export const WITHDRAW_FUNCIDX = 6
export const WITHDRAW_FUNCIDX_SPLIT = 7
export const DEPOSIT_FUNCIDX = 5
export const DEPOSIT_FUNCIDX_SPLIT = 6
export const SEND_FUNCIDX = 3
export const SEND_FUNCIDX_SPLIT = 4
export const API_VERSION = 3
export const OPC_TRANSACTION = 'transaction'
export const OPC_FUNCTION = 'function'
export const OPC_ACCOUNT = 'account'
export const OPC_SIGNATURE = 'signature'
export const OPC_SEED = 'seed'
export const OPC_CONTRACT = 'contract'
export const SHOW_UNSUPPORTED_FUNCTION = false
export const SUPERNODES = ['ARMRp9R6RiFe771WPxEh8RMzNnhYssxZSKE', 'AR86RMV3YiVoMDH6JdqgQWzPVu4Rdpjo7B4', 'ARFW9By8BkDuNdnC1M4AbRN1DV4u6AMWWSw', 'ARE4NmwpsFYb1gkUnzATHQqwB6GoG4mmYS5', 'AR2qU3zyWx3TAd97W2LvRgBVmB2Hmz5285R', 'ARAyzTJewPDkTy2SgoS4GAUc6Y6ugKpL5uu', 'ARA8eM6VzLiF2PYtEbzDukB2JM6yDiA2yhj', 'ARPpk1ocPfRETUrAxqUPo5XYt6UBs9ct5in', 'AR7ns4xQ22fbTqxn9nTG4ijYPyiVWcKwuar', 'ARCXQ8R4a4B84cdcf6BrM4fXJ8SjhEM5hZG', 'ARCVpcq2i6rQ7kkzNeJ1jsMec6TLmC7RNHn', 'ARQNgdvu82J5hMF2UiKKoygxcH8p3KbRPm7', 'ARH7qKfAfqCwFsBC34exzBGa2iTZNKrFbhy', 'ARBQTCYws5FZAVtA1ZFLsGhBtPymr4Hp5CX', 'ARKWVGHcJGLaqTDqTq2zfmHWbc9EwRyBVB5', 'ARCsMvz24s2rtV3M5ARkJVkVgjHbY8GEPtG', 'AR85PjmwmJqK69VKWcXofyjSZgahsptZfMS', 'AR8mi8btwebYd73G3Kwv4ACYyZBfDMJvedx', 'ARB7u11TLc95q3T5ZD6EcMZADsDnSqGA1un', 'ARHyd2kRgqkRQsGkCBBzW6oF2fhYChpdN88', 'AR9QS36E61GCE1MHBhLXxNcgmD2ZftALGhf', 'ARMbfef7FWYQ1ebnYpVNZzfK5FKJ44eS3u5', 'ARB9MqZJ1aLGbEQDd5ZfhUmjggcS6tKwTPK', 'ARDeXgTQW1i87Gq6wGvkUP3qt3JhzDHUEtr', 'ARRGpkqC2is1kvCMNvRftZtSMbx2PrttRoC', 'AR4Exapc1LnZ5nYkGwPvmpD7QZtEsdRQoGk', 'ARHvo4EEJjbupPBYFgf3EVrsR9aMYYRKf9G', 'ARLfqnrjuBzHRU2AwpVtY9hfEU54LUC5BYd', 'ARF51tsoLsTQ8PMyf6jyWnJChdDR3RYkR2J', 'ARGuxwy6sEHVhR2eu68gsbZ7VE98tQb7TjN', 'ARCug95rfqzbSRuYhREudLNVdhu9i2X97cH']
