"use strict";
import BigNumber from 'bignumber.js'
export default {
    getLength(str) {
        var len = encodeURIComponent(str).replace(/%[A-F\d]{2}/g, 'U').length;
        return len
    },
    checkPrecision(amount, unity) {
        // return false if check failed
        return !(BigNumber(amount).toString().split('.')[1] && BigNumber(amount).toString().split('.')[1].length > unity)
    },
    isNumFormatValid(amount) {
        if (BigNumber(amount).isLessThan(0)) {
            return 'negative'
        } else if (BigNumber(amount).isNaN()) {
            return 'nan'
        } else if (/[eE]/.test(amount.toString()) || /^0/.test(amount)) {
            return 'format'
        } else {
            return 'valid'
        }

    }
}
