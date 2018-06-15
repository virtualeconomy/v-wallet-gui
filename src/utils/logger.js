"use strict";
// Derived from waves-api
//
Object.defineProperty(exports, "__esModule", { value: true });
var LOG_LEVELS = {
    none: 0,
    error: 1,
    warning: 2,
    info: 3
};
var DEFAULT_LOG_LEVEL = 'warning';
exports.default = {
    log: function (message, data) {
        if (LOG_LEVELS[DEFAULT_LOG_LEVEL] >= LOG_LEVELS.info) {
            console.log(message, data);
        }
    },
    warn: function (message, data) {
        if (LOG_LEVELS[DEFAULT_LOG_LEVEL] >= LOG_LEVELS.warning) {
            console.warn(message, data);
        }
    },
    error: function (message, data) {
        if (LOG_LEVELS[DEFAULT_LOG_LEVEL] >= LOG_LEVELS.error) {
            console.error(message, data);
        }
    }
};
//# sourceMappingURL=logger.js.map