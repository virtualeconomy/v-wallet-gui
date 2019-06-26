"use strict";
var certifiedTokens = {
    'TWunH4kHKyvV9vigJSJ9FjLqPEAaHXSwr8PmxHzNp': 'VTEST'
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
