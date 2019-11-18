"use strict";
// make sure to add official token svg in src/assets/imgs/icons/token with 'tokenName.svg' format
var certifiedTokensList = {
    Mainnet: {
        'TWZZfKFqcaNVe5TrphLRNEm5DQFnBRJMjDDByqv84': { name: 'IPX', support_split: false, unity: 1000000000 }
    },
    Testnet: {
        'TWscu6rbRF2PEsnY1bRky4aKxxKTzn69WMFLFdLxK': { name: 'DM', support_split: true, unity: 1000 },
        'TWuyTczrVc4KeDUBpksxY8bpcogKfKqoVGE7cwcs3': { name: 'VTEST', support_split: true, unity: 100000 },
        'TWtSxBEx7rmsQ34MyWzwBCYYwRJh4K9xsL9zPkMK8': { name: 'DLL', support_split: false, unity: 100000000 }
    },
}
import Blockchain from '@/js-v-sdk/src/blockchain'
import { NETWORK_BYTE, NODE_IP } from '@/network'
var certifiedTokens;
var chain = new Blockchain(NODE_IP, NETWORK_BYTE);
if (String.fromCharCode(NETWORK_BYTE) === 'T') {
    certifiedTokens = certifiedTokensList['Testnet']
} else {
    certifiedTokens = certifiedTokensList['Mainnet']
}
for (let token in certifiedTokens) {
    if (certifiedTokens[token].support_split) {
        chain.getTokenInfo(token).then(response => {
            certifiedTokens[token].unity = response.unity
        })
    }
}
export default {
    isCertified(tokenId) {
        return tokenId in certifiedTokens
    },
    officialName(tokenId) {
        if (certifiedTokens[tokenId]) {
            return certifiedTokens[tokenId].name
        } else {
            return tokenId
        }
    },
    getUnity(tokenId) {
        return certifiedTokens[tokenId].unity
    },
    updateUnity(tokenId, unity) {
        certifiedTokens[tokenId].unity = unity
    },
    getTokenId(name) {
        let upperName = name.toUpperCase()
        let index = upperName.indexOf('TOKEN')
        if (index !==-1) {
            upperName = upperName.slice(0,index)
        }
        for (let tokenId in certifiedTokens) {
            if (certifiedTokens[tokenId].name === upperName) return tokenId
        }
        return null
    }
}
