"use strict";
import BigNumber from 'bignumber.js'
export default {
    isMobile() {
        return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
    },
    numberFormatter(num) {
        num = Number(num)
        if (!(num % 1)) {
            return num.toFixed(2)
        } else {
            let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
            return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
        }
    },
    bigNumberFormatter(num) {
        num = BigNumber(num)
        if (!(num.modulo(1).toNumber())) {
            return num.toFixed(2)
        } else {
            let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
            return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
        }
    },
    getLength(str) {
        var n = str.length,s
        var len=0
        for(var i=0; i <n;i++){
            s=str.charCodeAt(i);
            while( s > 0 ){
                len++;
                s = s >> 8;
            }
        }
        return len;
    }
}
