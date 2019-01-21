"use strict";
export default {
    isMobile() {
        return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
    },
    numberFormatter(num) {
        if (!(num % 1)) {
            return num.toFixed(2)
        } else {
            let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
            return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
        }
    }
}
