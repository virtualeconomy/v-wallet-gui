"use strict";
import BigNumber from 'bignumber.js'
export default {
    isMobile() {
        return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
    },
    bigNumberFormatter(num) {
        num = BigNumber(num)
        if (num.isNaN()) {
            return ''
        }
        if (!(num.modulo(1).toNumber())) {
            return num.toFixed(2)
        } else {
            let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
            return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
        }
    }
}
