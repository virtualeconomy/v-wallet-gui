"use strict";
export default {
    getLength(str) {
        var len = encodeURIComponent(str).replace(/%[A-F\d]{2}/g, 'U').length;
        return len
    }
}
