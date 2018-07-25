"use strict";
export default {
    isMobile() {
        return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
    },
}
