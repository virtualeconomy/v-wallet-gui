"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_1 = require("../libs/bignumber");
var base58_1 = require("../libs/base58");
var convert_1 = require("../utils/convert");
var concat_1 = require("../utils/concat");
// var constants = require("../constants");
// ABSTRACT PARENT
export var ByteProcessor = /** @class */ (function () {
    function ByteProcessor(name) {
        this.name = name;
    }
    return ByteProcessor;
}());
// SIMPLE
export var Base58 = /** @class */ (function (_super) {
    __extends(Base58, _super);
    function Base58() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Base58.prototype.process = function (value) {
        var bytes = base58_1.default.decode(value);
        return bytes;
    };
    return Base58;
}(ByteProcessor));
export var Short = /** @class */ (function (_super) {
    __extends(Short, _super);
    function Short() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Short.prototype.process = function (value) {
        var bytes = convert_1.default.shortToByteArray(value);
        return Uint8Array.from(bytes);
    };
    return Short;
}(ByteProcessor));
export var Long = /** @class */ (function (_super) {
    __extends(Long, _super);
    function Long() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Long.prototype.process = function (value) {
        value = new bignumber_1.default(value);
        var bytes = convert_1.default.bigNumberToByteArray(value);
        return Uint8Array.from(bytes);
    };
    return Long;
}(ByteProcessor));
// COMPLEX
export var AssetId = /** @class */ (function (_super) {
    __extends(AssetId, _super);
    function AssetId() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AssetId.prototype.process = function (value) {
        var bytes = Uint8Array.from([0]);
        return bytes;
    };
    return AssetId;
}(ByteProcessor));
export var Attachment = /** @class */ (function (_super) {
    __extends(Attachment, _super);
    function Attachment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Attachment.prototype.process = function (value) {
        if (typeof value === 'string') {
            value = Uint8Array.from(convert_1.default.stringToByteArray(value));
        }
        // if (value.length > constants.TRANSFER_ATTACHMENT_BYTE_LIMIT) {
        //     throw new Error('Maximum attachment length is exceeded');
        // }
        var valueWithLength = convert_1.default.bytesToByteArrayWithSize(value);
        return Uint8Array.from(valueWithLength);
    };
    return Attachment;
}(ByteProcessor));
export var Recipient = /** @class */ (function (_super) {
    __extends(Recipient, _super);
    function Recipient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Recipient.prototype.process = function (value) {
        var addressBytes = base58_1.default.decode(value);
        return Uint8Array.from(addressBytes);
    };
    return Recipient;
}(ByteProcessor));
//# sourceMappingURL=ByteProcessor.js.map
