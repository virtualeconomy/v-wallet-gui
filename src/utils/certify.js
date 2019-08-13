"use strict";
// make sure to add official token svg in src/assets/imgs/icons/wallet with 'tokenName.svg' format
var certifiedTokensList = {
    Mainnet: {},
    Testnet: {'TWuyTczrVc4KeDUBpksxY8bpcogKfKqoVGE7cwcs3': 'VTEST'},
}
import {NETWORK_BYTE} from '@/constants.js'
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
