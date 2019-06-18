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
        return !(/[eE]/.test(amount.toString()) || (/^[0+]/.test(amount.toString()) && !/^0\./.test(amount.toString()))|| BigNumber(amount).isNaN())
    }
}
