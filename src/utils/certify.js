"use strict";
// make sure to add official token svg in src/assets/imgs/icons/token with 'tokenName.svg' format
var certifiedTokensList = {
    Mainnet: {
        'TWZZfKFqcaNVe5TrphLRNEm5DQFnBRJMjDDByqv84': 'IPX'
    },
    Testnet: {
        'TWuyTczrVc4KeDUBpksxY8bpcogKfKqoVGE7cwcs3': 'VTEST',
        'TWtSxBEx7rmsQ34MyWzwBCYYwRJh4K9xsL9zPkMK8': 'DLL'
    },
}

import { NETWORK_BYTE } from '@/network'
var certifiedTokens;
if (String.fromCharCode(NETWORK_BYTE) === 'T') {
    certifiedTokens = certifiedTokensList['Testnet']
} else {
    certifiedTokens = certifiedTokensList['Mainnet']
}
export default {
    isCertified(tokenId) {
        if (tokenId in certifiedTokens) {
            return true
        } else return false
    },
    officialName(tokenId) {
        if (certifiedTokens[tokenId]) {
            return certifiedTokens[tokenId]
        } else {
            return tokenId
        }
    }
}