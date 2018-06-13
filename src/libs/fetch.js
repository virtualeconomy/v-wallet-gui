"use strict";
// Derived from waves-api
//
Object.defineProperty(exports, "__esModule", { value: true });
var fetchSubstitute = (function () {
    if (typeof window !== 'undefined') {
        return window.fetch.bind(window);
    }
    else if (typeof exports === 'object' && typeof module !== 'undefined') {
        return require('node-fetch');
    }
    else if (typeof self !== 'undefined') {
        return self.fetch.bind(self);
    }
    else {
        throw new Error('Your environment is not defined');
    }
})();
exports.default = fetchSubstitute;
//# sourceMappingURL=fetch.js.map