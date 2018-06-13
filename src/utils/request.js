"use strict";
// Derived from waves-api
//
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var create = require("parse-json-bignumber");
var WavesRequestError_1 = require("../errors/WavesRequestError");
var fetch_1 = require("../libs/fetch");
var config_1 = require("../config");
var SAFE_JSON_PARSE = create();
exports.POST_TEMPLATE = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
    }
};
var key = function (product, version) {
    return product + "/" + version;
};
var hostResolvers = (_a = {},
    _a[key(0 /* NODE */, 0 /* V1 */)] = function () { return config_1.default.getNodeAddress(); },
    _a[key(1 /* MATCHER */, 0 /* V1 */)] = function () { return config_1.default.getMatcherAddress(); },
    _a);
function normalizeHost(host) {
    return host.replace(/\/+$/, '');
}
exports.normalizeHost = normalizeHost;
function normalizePath(path) {
    return ("/" + path).replace(/\/+/g, '/').replace(/\/$/, '');
}
exports.normalizePath = normalizePath;
function processJSON(res) {
    if (res.ok) {
        return res.text().then(SAFE_JSON_PARSE);
    }
    else {
        return res.json().then(Promise.reject.bind(Promise));
    }
}
exports.processJSON = processJSON;
function handleError(url, data) {
    throw new WavesRequestError_1.default(url, data);
}
function createFetchWrapper(product, version, pipe) {
    var resolveHost = hostResolvers[key(product, version)];
    return function (path, options) {
        var url = resolveHost() + normalizePath(path);
        var request = fetch_1.default(url, options);
        if (pipe) {
            return request.then(pipe).catch(function (data) { return handleError(url, data); });
        }
        else {
            return request.catch(function (data) { return handleError(url, data); });
        }
    };
}
exports.createFetchWrapper = createFetchWrapper;
function wrapTransactionRequest(TransactionConstructor, preRemapAsync, postRemap, callback) {
    return function (data, keyPair) {
        return preRemapAsync(__assign({}, data, { senderPublicKey: keyPair.publicKey })).then(function (validatedData) {
            var transaction = new TransactionConstructor(validatedData);
            return transaction.prepareForAPI(keyPair.privateKey)
                .then(postRemap)
                .then(function (tx) {
                return callback(__assign({}, exports.POST_TEMPLATE, { body: JSON.stringify(tx) }));
            });
        });
    };
}
exports.wrapTransactionRequest = wrapTransactionRequest;
var _a;
//# sourceMappingURL=request.js.map