"use strict";
export default {
    isMobile() {
        return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
    },
    numberFormatter(num) {
        if (!num.toString().includes('.')) {
            return num.toFixed(2)
        } else {
            return num
        }
    }
}
