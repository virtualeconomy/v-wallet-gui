"use strict";
// make sure to add official token svg in src/assets/imgs/icons/token with 'tokenName.svg' format
var certifiedTokensList = {
    Mainnet: {
        'TWZ3nPYyCJAJJmfJBzxcqe8ZfpYJMQK4dpiQ1m6v4': { name: 'GoldZip', contractType: 'TokenContractWithSplit', iconUrl: require('@/assets/imgs/icons/token/GoldZip.jpg'), maker: 'AR4fEgfZpQcjbqtnEYs5XAw8AgXx8c98AY5', unity: '1000' },
        'TWZC7k5ahbBFZpRxpKP37596WjafGmL3ZQh8qmsWV': { name: 'ECHELON', contractType: 'TokenContract', iconUrl: require('@/assets/imgs/icons/token/ECHELON.jpg'), maker: 'ARDMhaoCNeRbDVQd3uJSDDieQsS6zW2Y5As', unity: '100000000' },
        'TWZZfKFqcaNVe5TrphLRNEm5DQFnBRJMjDDByqv84': { name: 'IPX', contractType: 'TokenContract', iconUrl: require('@/assets/imgs/icons/token/IPX.svg'), maker: 'ARDjj5VXwXDtK4FpJcnR14rPffGwawgPrtf', unity: '1000000000' },
        'TWZgYwK7SqzAfD8affZMQgiwwgid6Qfh6M9s52AGf': { name: 'LongMen', contractType: 'TokenContract', iconUrl: require('@/assets/imgs/icons/token/LongMen.jpeg'), maker: 'ARQ12n8iiXnc99fq6hzRN4Q8TXd6KYhY2Hy', unity: '10000000000' },
        'TWaN4DqnRMdUS5d1ohCn9Vh9VdGWDLm9Um1jHbQiF': { name: 'BlockDesk', contractType: 'TokenContract', iconUrl: require('@/assets/imgs/icons/token/BlockDesk.png'), maker: 'ARNxREqVbkoctT5aV5MnsMXeqP1rEuPySSq', unity: '100000000' },
        'TWar6LKVSYRwxkEZ3Viqa1QAZeq25w93WmHAbppbf': { name: 'OCT', contractType: 'TokenContract', iconUrl: require('@/assets/imgs/icons/token/OCT.jpg'), maker: 'AR4oTsXJA1rVePF7eYWSZCosgtrDpd4tiMp', unity: '100000000' },
        'TWayhKjbWyPUNNBkPZymLL2LUehSdQiZNxLWYfNBt': { name: 'Vgan', contractType: 'TokenContract', iconUrl: require('@/assets/imgs/icons/token/Vgan.png'), maker: 'ARDEepsHirjZF4LgXDG3XQexcmP15Rkv99r', unity: '1' },
        'TWaSLbyVdxTX1C4jPcy56E6iSeRQUkivabcgvPQQU': { name: 'XGO', contractType: 'TokenContract', iconUrl: require('@/assets/imgs/icons/token/XGO.png'),maker: 'AR32ncj1LUcFHGYJZ1R8s7LeMb5CLmAnRPi', unity: '100000000' }
    },
    Testnet: {
        'TWscu6rbRF2PEsnY1bRky4aKxxKTzn69WMFLFdLxK': { name: 'DM', contractType: 'TokenContractWithSplit', iconUrl: require('@/assets/imgs/icons/token/DM.svg'), maker: 'AU7nJLcT1mThXGTT1KDkoAtfPzc82Sgay1V', unity: '1000' },
        'TWuyTczrVc4KeDUBpksxY8bpcogKfKqoVGE7cwcs3': { name: 'VTest', contractType: 'TokenContractWithSplit', iconUrl: require('@/assets/imgs/icons/token/VTEST.svg'), maker: 'AUAztxsft2v6rmjRRb72nLea6BNyRHHWpUR', unity: '1000000' },
        'TWtSxBEx7rmsQ34MyWzwBCYYwRJh4K9xsL9zPkMK8': { name: 'DLL', contractType: 'TokenContract', iconUrl: require('@/assets/imgs/icons/token/DLL.svg'), maker: 'AU3rAtDrCnh2dLqxpoyUKswsYbx3CdAzbQC', unity: '100000000' }
    },
}
import Blockchain from '@/js-v-sdk/src/blockchain'
import { NETWORK_BYTE, MAINNET_IP, TESTNET_IP } from '@/network'
var certifiedTokens;
var chain = String.fromCharCode(NETWORK_BYTE) === 'M' ? new Blockchain(MAINNET_IP, NETWORK_BYTE) : new Blockchain(TESTNET_IP, NETWORK_BYTE);
if (String.fromCharCode(NETWORK_BYTE) === 'T') {
    certifiedTokens = certifiedTokensList['Testnet']
} else {
    certifiedTokens = certifiedTokensList['Mainnet']
}
for (let token in certifiedTokens) {
    if (certifiedTokens[token].contractType === 'TokenContractWithSplit') {
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
    getContractType(tokenId) {
        return certifiedTokens[tokenId].contractType
    },
    updateUnity(tokenId, unity) {
        certifiedTokens[tokenId].unity = unity
    },
    getTokenId(name) {
        let upperName = name.toUpperCase().trim()
        let len = upperName.length
        let endName = len > 6 ? upperName.substring(len - 6, len) : ''
        if (endName === ' TOKEN') {
            upperName = upperName.substring(0, len - 6).trim()
        }
        for (let tokenId in certifiedTokens) {
            if (certifiedTokens[tokenId].name === upperName) return tokenId
        }
        return null
    },
    getCertifiedTokens() {
        return certifiedTokens
    }
}
