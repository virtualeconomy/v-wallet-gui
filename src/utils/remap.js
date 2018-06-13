"use strict";
// Derived from waves-api
//
Object.defineProperty(exports, "__esModule", { value: true });
var constants = require("../constants");
var config_1 = require("../config");
function normalizeAssetId(original) {
    if (!original || original === constants.WAVES) {
        return '';
    }
    else {
        return original;
    }
}
exports.normalizeAssetId = normalizeAssetId;
function denormalizeAssetId(original) {
    if (!original) {
        return constants.WAVES;
    }
    else {
        return original;
    }
}
exports.denormalizeAssetId = denormalizeAssetId;
function removeRecipientPrefix(original) {
    if (original.slice(0, 8) === 'address:') {
        return original.slice(8);
    }
    else {
        return original;
    }
}
exports.removeRecipientPrefix = removeRecipientPrefix;
function removeAliasPrefix(original) {
    if (original.slice(0, 6) === 'alias:') {
        return original.slice(8); // Mind the network byte characters
    }
    else {
        return original;
    }
}
exports.removeAliasPrefix = removeAliasPrefix;
function addRecipientPrefix(raw) {
    if (raw.length > 30) {
        return "address:" + raw;
    }
    else {
        var networkCharacter = String.fromCharCode(config_1.default.getNetworkByte());
        return "alias:" + networkCharacter + ":" + raw;
    }
}
exports.addRecipientPrefix = addRecipientPrefix;
// Adjusts user time to UTC
// Should be used for creating transactions and requests only
function getTimestamp(timestamp) {
    return (timestamp || Date.now()) + config_1.default.getTimeDiff();
}
exports.getTimestamp = getTimestamp;
function precisionCheck(precision) {
    return (precision >= 0 && precision <= 8);
}
exports.precisionCheck = precisionCheck;
function createRemapper(rules) {
    return function (data) {
        return Object.keys(data).reduce(function (result, key) {
            var rule = rules[key];
            if (typeof rule === 'function') {
                // Process with a function
                result[key] = rule(data[key]);
            }
            else if (typeof rule === 'string') {
                // Rename a field
                result[rule] = data[key];
            }
            else if (rule !== null) {
                // Leave as is
                result[key] = data[key];
            }
            return result;
        }, {});
    };
}
exports.createRemapper = createRemapper;
//# sourceMappingURL=remap.js.map