(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["TrezorConnect"] = factory();
	else
		root["TrezorConnect"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(22);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/defineProperty.js
var defineProperty = __webpack_require__(2);
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(0);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: ./node_modules/events/events.js
var events = __webpack_require__(9);
var events_default = /*#__PURE__*/__webpack_require__.n(events);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/assertThisInitialized.js
var assertThisInitialized = __webpack_require__(7);
var assertThisInitialized_default = /*#__PURE__*/__webpack_require__.n(assertThisInitialized);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/inheritsLoose.js
var inheritsLoose = __webpack_require__(10);
var inheritsLoose_default = /*#__PURE__*/__webpack_require__.n(inheritsLoose);

// EXTERNAL MODULE: ./src/js/constants/popup.js
var popup = __webpack_require__(3);

// EXTERNAL MODULE: ./src/js/constants/iframe.js
var iframe = __webpack_require__(6);

// EXTERNAL MODULE: ./src/js/constants/ui.js
var ui = __webpack_require__(4);

// CONCATENATED MODULE: ./src/js/popup/showPopupRequest.js
var layerID = 'TrezorConnectInteractionLayer';
var layerInnerHtml = "\n    <div class=\"trezorconnect-container\" id=\"" + layerID + "\">\n        <div class=\"trezorconnect-window\">\n            <div class=\"trezorconnect-head\">\n                <svg class=\"trezorconnect-logo\" x=\"0px\" y=\"0px\" viewBox=\"0 0 163.7 41.9\" width=\"78px\" height=\"20px\" preserveAspectRatio=\"xMinYMin meet\">\n                    <polygon points=\"101.1,12.8 118.2,12.8 118.2,17.3 108.9,29.9 118.2,29.9 118.2,35.2 101.1,35.2 101.1,30.7 110.4,18.1 101.1,18.1\"/>\n                    <path d=\"M158.8,26.9c2.1-0.8,4.3-2.9,4.3-6.6c0-4.5-3.1-7.4-7.7-7.4h-10.5v22.3h5.8v-7.5h2.2l4.1,7.5h6.7L158.8,26.9z M154.7,22.5 h-4V18h4c1.5,0,2.5,0.9,2.5,2.2C157.2,21.6,156.2,22.5,154.7,22.5z\"/>\n                    <path d=\"M130.8,12.5c-6.8,0-11.6,4.9-11.6,11.5s4.9,11.5,11.6,11.5s11.7-4.9,11.7-11.5S137.6,12.5,130.8,12.5z M130.8,30.3 c-3.4,0-5.7-2.6-5.7-6.3c0-3.8,2.3-6.3,5.7-6.3c3.4,0,5.8,2.6,5.8,6.3C136.6,27.7,134.2,30.3,130.8,30.3z\"/>\n                    <polygon points=\"82.1,12.8 98.3,12.8 98.3,18 87.9,18 87.9,21.3 98,21.3 98,26.4 87.9,26.4 87.9,30 98.3,30 98.3,35.2 82.1,35.2 \"/>\n                    <path d=\"M24.6,9.7C24.6,4.4,20,0,14.4,0S4.2,4.4,4.2,9.7v3.1H0v22.3h0l14.4,6.7l14.4-6.7h0V12.9h-4.2V9.7z M9.4,9.7 c0-2.5,2.2-4.5,5-4.5s5,2,5,4.5v3.1H9.4V9.7z M23,31.5l-8.6,4l-8.6-4V18.1H23V31.5z\"/>\n                    <path d=\"M79.4,20.3c0-4.5-3.1-7.4-7.7-7.4H61.2v22.3H67v-7.5h2.2l4.1,7.5H80l-4.9-8.3C77.2,26.1,79.4,24,79.4,20.3z M71,22.5h-4V18 h4c1.5,0,2.5,0.9,2.5,2.2C73.5,21.6,72.5,22.5,71,22.5z\"/>\n                    <polygon points=\"40.5,12.8 58.6,12.8 58.6,18.1 52.4,18.1 52.4,35.2 46.6,35.2 46.6,18.1 40.5,18.1 \"/>\n                </svg>\n                <div class=\"trezorconnect-close\">\n                    <svg x=\"0px\" y=\"0px\" viewBox=\"24 24 60 60\" width=\"24px\" height=\"24px\" preserveAspectRatio=\"xMinYMin meet\">\n                        <polygon class=\"st0\" points=\"40,67.9 42.1,70 55,57.1 67.9,70 70,67.9 57.1,55 70,42.1 67.9,40 55,52.9 42.1,40 40,42.1 52.9,55 \"/>\n                    </svg>\n                </div>\n            </div>\n            <div class=\"trezorconnect-body\">\n                <h3>Popup was blocked</h3>\n                <p>Please click to \u201CContinue\u201D to open popup manually</p>\n                <button class=\"trezorconnect-open\">Continue</button>\n            </div>\n        </div>\n    </div>\n";
var showPopupRequest = function showPopupRequest(open, cancel) {
  if (document.getElementById(layerID)) {
    return;
  }

  var div = document.createElement('div');
  div.id = layerID;
  div.className = 'trezorconnect-container';
  div.innerHTML = layerInnerHtml;

  if (document.body) {
    document.body.appendChild(div);
  }

  var button = div.getElementsByClassName('trezorconnect-open')[0];

  button.onclick = function () {
    open();

    if (document.body) {
      document.body.removeChild(div);
    }
  };

  var close = div.getElementsByClassName('trezorconnect-close')[0];

  close.onclick = function () {
    cancel();

    if (document.body) {
      document.body.removeChild(div);
    }
  };
};
// CONCATENATED MODULE: ./node_modules/whatwg-fetch/fetch.js
var support = {
  searchParams: 'URLSearchParams' in self,
  iterable: 'Symbol' in self && 'iterator' in Symbol,
  blob:
    'FileReader' in self &&
    'Blob' in self &&
    (function() {
      try {
        new Blob()
        return true
      } catch (e) {
        return false
      }
    })(),
  formData: 'FormData' in self,
  arrayBuffer: 'ArrayBuffer' in self
}

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj)
}

if (support.arrayBuffer) {
  var viewClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]'
  ]

  var isArrayBufferView =
    ArrayBuffer.isView ||
    function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name)
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
    throw new TypeError('Invalid character in header field name')
  }
  return name.toLowerCase()
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
  var iterator = {
    next: function() {
      var value = items.shift()
      return {done: value === undefined, value: value}
    }
  }

  if (support.iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator
    }
  }

  return iterator
}

function Headers(headers) {
  this.map = {}

  if (headers instanceof Headers) {
    headers.forEach(function(value, name) {
      this.append(name, value)
    }, this)
  } else if (Array.isArray(headers)) {
    headers.forEach(function(header) {
      this.append(header[0], header[1])
    }, this)
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function(name) {
      this.append(name, headers[name])
    }, this)
  }
}

Headers.prototype.append = function(name, value) {
  name = normalizeName(name)
  value = normalizeValue(value)
  var oldValue = this.map[name]
  this.map[name] = oldValue ? oldValue + ', ' + value : value
}

Headers.prototype['delete'] = function(name) {
  delete this.map[normalizeName(name)]
}

Headers.prototype.get = function(name) {
  name = normalizeName(name)
  return this.has(name) ? this.map[name] : null
}

Headers.prototype.has = function(name) {
  return this.map.hasOwnProperty(normalizeName(name))
}

Headers.prototype.set = function(name, value) {
  this.map[normalizeName(name)] = normalizeValue(value)
}

Headers.prototype.forEach = function(callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this)
    }
  }
}

Headers.prototype.keys = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push(name)
  })
  return iteratorFor(items)
}

Headers.prototype.values = function() {
  var items = []
  this.forEach(function(value) {
    items.push(value)
  })
  return iteratorFor(items)
}

Headers.prototype.entries = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push([name, value])
  })
  return iteratorFor(items)
}

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true
}

function fileReaderReady(reader) {
  return new Promise(function(resolve, reject) {
    reader.onload = function() {
      resolve(reader.result)
    }
    reader.onerror = function() {
      reject(reader.error)
    }
  })
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsArrayBuffer(blob)
  return promise
}

function readBlobAsText(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsText(blob)
  return promise
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf)
  var chars = new Array(view.length)

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i])
  }
  return chars.join('')
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0)
  } else {
    var view = new Uint8Array(buf.byteLength)
    view.set(new Uint8Array(buf))
    return view.buffer
  }
}

function Body() {
  this.bodyUsed = false

  this._initBody = function(body) {
    this._bodyInit = body
    if (!body) {
      this._bodyText = ''
    } else if (typeof body === 'string') {
      this._bodyText = body
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString()
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer)
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer])
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body)
    } else {
      this._bodyText = body = Object.prototype.toString.call(body)
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8')
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type)
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
      }
    }
  }

  if (support.blob) {
    this.blob = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob')
      } else {
        return Promise.resolve(new Blob([this._bodyText]))
      }
    }

    this.arrayBuffer = function() {
      if (this._bodyArrayBuffer) {
        return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
      } else {
        return this.blob().then(readBlobAsArrayBuffer)
      }
    }
  }

  this.text = function() {
    var rejected = consumed(this)
    if (rejected) {
      return rejected
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob)
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text')
    } else {
      return Promise.resolve(this._bodyText)
    }
  }

  if (support.formData) {
    this.formData = function() {
      return this.text().then(decode)
    }
  }

  this.json = function() {
    return this.text().then(JSON.parse)
  }

  return this
}

// HTTP methods whose capitalization should be normalized
var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

function normalizeMethod(method) {
  var upcased = method.toUpperCase()
  return methods.indexOf(upcased) > -1 ? upcased : method
}

function Request(input, options) {
  options = options || {}
  var body = options.body

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read')
    }
    this.url = input.url
    this.credentials = input.credentials
    if (!options.headers) {
      this.headers = new Headers(input.headers)
    }
    this.method = input.method
    this.mode = input.mode
    this.signal = input.signal
    if (!body && input._bodyInit != null) {
      body = input._bodyInit
      input.bodyUsed = true
    }
  } else {
    this.url = String(input)
  }

  this.credentials = options.credentials || this.credentials || 'same-origin'
  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers)
  }
  this.method = normalizeMethod(options.method || this.method || 'GET')
  this.mode = options.mode || this.mode || null
  this.signal = options.signal || this.signal
  this.referrer = null

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests')
  }
  this._initBody(body)
}

Request.prototype.clone = function() {
  return new Request(this, {body: this._bodyInit})
}

function decode(body) {
  var form = new FormData()
  body
    .trim()
    .split('&')
    .forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
  return form
}

function parseHeaders(rawHeaders) {
  var headers = new Headers()
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
  preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
    var parts = line.split(':')
    var key = parts.shift().trim()
    if (key) {
      var value = parts.join(':').trim()
      headers.append(key, value)
    }
  })
  return headers
}

Body.call(Request.prototype)

function Response(bodyInit, options) {
  if (!options) {
    options = {}
  }

  this.type = 'default'
  this.status = options.status === undefined ? 200 : options.status
  this.ok = this.status >= 200 && this.status < 300
  this.statusText = 'statusText' in options ? options.statusText : 'OK'
  this.headers = new Headers(options.headers)
  this.url = options.url || ''
  this._initBody(bodyInit)
}

Body.call(Response.prototype)

Response.prototype.clone = function() {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  })
}

Response.error = function() {
  var response = new Response(null, {status: 0, statusText: ''})
  response.type = 'error'
  return response
}

var redirectStatuses = [301, 302, 303, 307, 308]

Response.redirect = function(url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code')
  }

  return new Response(null, {status: status, headers: {location: url}})
}

var DOMException = self.DOMException
try {
  new DOMException()
} catch (err) {
  DOMException = function(message, name) {
    this.message = message
    this.name = name
    var error = Error(message)
    this.stack = error.stack
  }
  DOMException.prototype = Object.create(Error.prototype)
  DOMException.prototype.constructor = DOMException
}

function fetch_fetch(input, init) {
  return new Promise(function(resolve, reject) {
    var request = new Request(input, init)

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    var xhr = new XMLHttpRequest()

    function abortXhr() {
      xhr.abort()
    }

    xhr.onload = function() {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      }
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
      var body = 'response' in xhr ? xhr.response : xhr.responseText
      resolve(new Response(body, options))
    }

    xhr.onerror = function() {
      reject(new TypeError('Network request failed'))
    }

    xhr.ontimeout = function() {
      reject(new TypeError('Network request failed'))
    }

    xhr.onabort = function() {
      reject(new DOMException('Aborted', 'AbortError'))
    }

    xhr.open(request.method, request.url, true)

    if (request.credentials === 'include') {
      xhr.withCredentials = true
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false
    }

    if ('responseType' in xhr && support.blob) {
      xhr.responseType = 'blob'
    }

    request.headers.forEach(function(value, name) {
      xhr.setRequestHeader(name, value)
    })

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr)

      xhr.onreadystatechange = function() {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr)
        }
      }
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
  })
}

fetch_fetch.polyfill = true

if (!self.fetch) {
  self.fetch = fetch_fetch
  self.Headers = Headers
  self.Request = Request
  self.Response = Response
}

// CONCATENATED MODULE: ./src/js/env/browser/networkUtils.js


var networkUtils_httpRequest = function httpRequest(url, type) {
  var response, txt;
  return regenerator_default.a.async(function httpRequest$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (type === void 0) {
            type = 'text';
          }

          _context.next = 3;
          return regenerator_default.a.awrap(fetch(url, {
            credentials: 'same-origin'
          }));

        case 3:
          response = _context.sent;

          if (!response.ok) {
            _context.next = 23;
            break;
          }

          if (!(type === 'json')) {
            _context.next = 12;
            break;
          }

          _context.next = 8;
          return regenerator_default.a.awrap(response.text());

        case 8:
          txt = _context.sent;
          return _context.abrupt("return", JSON.parse(txt));

        case 12:
          if (!(type === 'binary')) {
            _context.next = 18;
            break;
          }

          _context.next = 15;
          return regenerator_default.a.awrap(response.arrayBuffer());

        case 15:
          return _context.abrupt("return", _context.sent);

        case 18:
          _context.next = 20;
          return regenerator_default.a.awrap(response.text());

        case 20:
          return _context.abrupt("return", _context.sent);

        case 21:
          _context.next = 24;
          break;

        case 23:
          throw new Error("httpRequest error: " + url + " " + response.statusText);

        case 24:
        case "end":
          return _context.stop();
      }
    }
  });
};
var getOrigin = function getOrigin(url) {
  if (url.indexOf('file://') === 0) return 'file://'; // eslint-disable-next-line no-irregular-whitespace, no-useless-escape

  var parts = url.match(/^.+\:\/\/[^\/]+/);
  return Array.isArray(parts) && parts.length > 0 ? parts[0] : 'unknown';
};
// CONCATENATED MODULE: ./src/js/utils/deferred.js

function create(arg, device) {
  var localResolve = function localResolve(t) {};

  var localReject = function localReject(e) {};

  var id; // eslint-disable-next-line no-async-promise-executor

  var promise = new Promise(function _callee(resolve, reject) {
    return regenerator_default.a.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            localResolve = resolve;
            localReject = reject;

            if (!(typeof arg === 'function')) {
              _context.next = 11;
              break;
            }

            _context.prev = 3;
            _context.next = 6;
            return regenerator_default.a.awrap(arg());

          case 6:
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](3);
            reject(_context.t0);

          case 11:
            if (typeof arg === 'string') id = arg;

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[3, 8]]);
  });
  return {
    id: id,
    device: device,
    resolve: localResolve,
    reject: localReject,
    promise: promise
  };
}
function createAsync(innerFn) {
  var localResolve = function localResolve(t) {};

  var localReject = function localReject(e) {};

  var promise = new Promise(function (resolve, reject) {
    localResolve = resolve;
    localReject = reject;
  });

  var inner = function inner() {
    return regenerator_default.a.async(function inner$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regenerator_default.a.awrap(innerFn());

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    });
  };

  return {
    resolve: localResolve,
    reject: localReject,
    promise: promise,
    run: function run() {
      inner();
      return promise;
    }
  };
}
function resolveTimeoutPromise(delay, result) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(result);
    }, delay);
  });
}
function rejectTimeoutPromise(delay, error) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(error);
    }, delay);
  });
}
// CONCATENATED MODULE: ./src/js/popup/PopupManager.js









 // const POPUP_REQUEST_TIMEOUT: number = 602;

var POPUP_REQUEST_TIMEOUT = 850;
var POPUP_CLOSE_INTERVAL = 500;
var POPUP_OPEN_TIMEOUT = 2000;

var PopupManager_PopupManager =
/*#__PURE__*/
function (_EventEmitter) {
  inheritsLoose_default()(PopupManager, _EventEmitter);

  // Window
  function PopupManager(settings) {
    var _this;

    _this = _EventEmitter.call(this) || this;

    defineProperty_default()(assertThisInitialized_default()(_this), "requestTimeout", 0);

    defineProperty_default()(assertThisInitialized_default()(_this), "closeInterval", 0);

    defineProperty_default()(assertThisInitialized_default()(_this), "extensionTabId", 0);

    _this.settings = settings;
    _this.origin = getOrigin(settings.popupSrc);
    _this.handleMessage = _this.handleMessage.bind(assertThisInitialized_default()(_this));
    _this.iframeHandshake = create(iframe["LOADED"]);

    if (_this.settings.env === 'webextension') {
      _this.handleExtensionConnect = _this.handleExtensionConnect.bind(assertThisInitialized_default()(_this));
      _this.handleExtensionMessage = _this.handleExtensionMessage.bind(assertThisInitialized_default()(_this)); // $FlowIssue chrome not declared outside

      chrome.runtime.onConnect.addListener(_this.handleExtensionConnect);
    }

    window.addEventListener('message', _this.handleMessage, false);
    return _this;
  }

  var _proto = PopupManager.prototype;

  _proto.request = function request(lazyLoad) {
    var _this2 = this;

    if (lazyLoad === void 0) {
      lazyLoad = false;
    }

    // popup request
    // TODO: ie - open immediately and hide it but post handshake after timeout
    // bring popup window to front
    if (this.locked) {
      if (this._window) {
        if (this.settings.env === 'webextension') {
          // $FlowIssue chrome not declared outside
          chrome.tabs.update(this._window.id, {
            active: true
          });
        } else {
          this._window.focus();
        }
      }

      return;
    }

    var openFn = this.open.bind(this);
    this.locked = true;

    if (!this.settings.supportedBrowser) {
      openFn();
    } else {
      var timeout = lazyLoad || this.settings.env === 'webextension' ? 1 : POPUP_REQUEST_TIMEOUT;
      this.requestTimeout = window.setTimeout(function () {
        _this2.requestTimeout = 0;
        openFn(lazyLoad);
      }, timeout);
    }
  };

  _proto.cancel = function cancel() {
    this.close();
  };

  _proto.unlock = function unlock() {
    this.locked = false;
  };

  _proto.open = function open(lazyLoad) {
    var _this3 = this;

    var src = this.settings.popupSrc;

    if (!this.settings.supportedBrowser) {
      this.openWrapper(src + "#unsupported");
      return;
    }

    this.openWrapper(lazyLoad ? src + "#loading" : src);
    this.closeInterval = window.setInterval(function () {
      if (!_this3._window) return;

      if (_this3.settings.env === 'webextension') {
        // $FlowIssue chrome not declared outside
        chrome.tabs.get(_this3._window.id, function (tab) {
          if (!tab) {
            _this3.close();

            _this3.emit(popup["c" /* CLOSED */]);
          }
        });
      } else if (_this3._window.closed) {
        _this3.close();

        _this3.emit(popup["c" /* CLOSED */]);
      }
    }, POPUP_CLOSE_INTERVAL); // open timeout will be cancelled by POPUP.BOOTSTRAP message

    this.openTimeout = window.setTimeout(function () {
      _this3.close();

      showPopupRequest(_this3.open.bind(_this3), function () {
        _this3.emit(popup["c" /* CLOSED */]);
      });
    }, POPUP_OPEN_TIMEOUT);
  };

  _proto.openWrapper = function openWrapper(url) {
    var _this4 = this;

    if (this.settings.env === 'webextension') {
      // $FlowIssue chrome not declared outside
      chrome.windows.getCurrent(null, function (currentWindow) {
        // Request coming from extension popup,
        // create new window above instead of opening new tab
        if (currentWindow.type !== 'normal') {
          // $FlowIssue chrome not declared outside
          chrome.windows.create({
            url: url
          }, function (newWindow) {
            // $FlowIssue chrome not declared outside
            chrome.tabs.query({
              windowId: newWindow.id,
              active: true
            }, function (tabs) {
              _this4._window = tabs[0];
            });
          });
        } else {
          // $FlowIssue chrome not declared outside
          chrome.tabs.query({
            currentWindow: true,
            active: true
          }, function (tabs) {
            _this4.extensionTabId = tabs[0].id; // $FlowIssue chrome not declared outside

            chrome.tabs.create({
              url: url,
              index: tabs[0].index + 1
            }, function (tab) {
              _this4._window = tab;
            });
          });
        }
      });
    } else if (this.settings.env === 'electron') {
      this._window = window.open(url, 'modal');
    } else {
      this._window = window.open('', '_blank');

      if (this._window) {
        this._window.location.href = url; // otherwise android/chrome loose window.opener reference
      }
    }
  };

  _proto.handleExtensionConnect = function handleExtensionConnect(port) {
    if (port.name !== 'trezor-connect') return;

    if (!this._window || this._window && this._window.id !== port.sender.tab.id) {
      port.disconnect();
      return;
    } // since POPUP.BOOTSTRAP will not be handled by "handleMessage" we need to threat "content-script" connection as the same event
    // popup is opened properly, now wait for POPUP.LOADED message (in this case handled by "handleExtensionMessage")


    window.clearTimeout(this.openTimeout);
    this.extensionPort = port; // $FlowIssue need to update ChromePort definition

    this.extensionPort.onMessage.addListener(this.handleExtensionMessage);
  };

  _proto.handleExtensionMessage = function handleExtensionMessage(message) {
    var _this5 = this;

    if (!this.extensionPort) return;
    var data = message.data;
    if (!data || typeof data !== 'object') return;

    if (data.type === popup["e" /* ERROR */]) {
      // handle popup error
      var errorMessage = data.payload && typeof data.payload.error === 'string' ? data.payload.error : null;
      this.emit(popup["c" /* CLOSED */], errorMessage ? "Popup error: " + errorMessage : null);
      this.close();
    } else if (data.type === popup["h" /* LOADED */]) {
      this.iframeHandshake.promise.then(function (resolve) {
        _this5.extensionPort.postMessage({
          type: popup["g" /* INIT */],
          payload: {
            settings: _this5.settings
          }
        });
      });
    } else if (data.type === popup["f" /* EXTENSION_USB_PERMISSIONS */]) {
      // $FlowIssue chrome not declared outside
      chrome.tabs.query({
        currentWindow: true,
        active: true
      }, function (tabs) {
        // $FlowIssue chrome not declared outside
        chrome.tabs.create({
          url: 'trezor-usb-permissions.html',
          index: tabs[0].index + 1
        }, function (tab) {// do nothing
        });
      });
    } else if (data.type === popup["d" /* CLOSE_WINDOW */]) {
      this.emit(popup["c" /* CLOSED */]);
      this.close();
    }
  };

  _proto.handleMessage = function handleMessage(message) {
    var _this6 = this;

    // ignore messages from domain other then popup origin and without data
    var data = message.data;
    if (getOrigin(message.origin) !== this.origin || !data || typeof data !== 'object') return;

    if (data.type === iframe["LOADED"]) {
      this.iframeHandshake.resolve(true);
    } else if (data.type === popup["a" /* BOOTSTRAP */]) {
      // popup is opened properly, now wait for POPUP.LOADED message
      window.clearTimeout(this.openTimeout);
    } else if (data.type === popup["e" /* ERROR */] && this._window) {
      var errorMessage = data.payload && typeof data.payload.error === 'string' ? data.payload.error : null;
      this.emit(popup["c" /* CLOSED */], errorMessage ? "Popup error: " + errorMessage : null);
      this.close();
    } else if (data.type === popup["h" /* LOADED */]) {
      // popup is successfully loaded
      this.iframeHandshake.promise.then(function (resolve) {
        _this6._window.postMessage({
          type: popup["g" /* INIT */],
          payload: {
            settings: _this6.settings
          }
        }, _this6.origin);
      }); // send ConnectSettings to popup
      // note this settings and iframe.ConnectSettings could be different (especially: origin, popup, webusb, debug)
      // now popup is able to load assets
    } else if (data.type === popup["b" /* CANCEL_POPUP_REQUEST */] || data.type === ui["CLOSE_UI_WINDOW"]) {
      this.close();
    }
  };

  _proto.close = function close() {
    this.locked = false;

    if (this.requestTimeout) {
      window.clearTimeout(this.requestTimeout);
      this.requestTimeout = 0;
    }

    if (this.openTimeout) {
      window.clearTimeout(this.openTimeout);
      this.openTimeout = 0;
    }

    if (this.closeInterval) {
      window.clearInterval(this.closeInterval);
      this.closeInterval = 0;
    }

    if (this.extensionPort) {
      this.extensionPort.disconnect();
      this.extensionPort = null;
    } // switch to previously focused tab


    if (this.extensionTabId) {
      // $FlowIssue chrome not declared outside
      chrome.tabs.update(this.extensionTabId, {
        active: true
      });
      this.extensionTabId = 0;
    }

    if (this._window) {
      if (this.settings.env === 'webextension') {
        // eslint-disable-next-line no-unused-vars
        var _e; // $FlowIssue chrome not declared outside


        chrome.tabs.remove(this._window.id, function () {
          _e = chrome.runtime.lastError;
        });
        _e = chrome.runtime.lastError;
      } else {
        this._window.close();
      }

      this._window = null;
    }
  };

  _proto.postMessage = function postMessage(message) {
    var _this7 = this;

    // post message before popup request finalized
    if (this.requestTimeout) {
      return;
    } // device needs interaction but there is no popup/ui
    // maybe popup request wasn't handled
    // ignore "ui_request_window" type


    if (!this._window && message.type !== ui["REQUEST_UI_WINDOW"] && this.openTimeout) {
      this.close();
      showPopupRequest(this.open.bind(this), function () {
        _this7.emit(popup["c" /* CLOSED */]);
      });
      return;
    } // post message to popup window


    if (this._window) {
      this._window.postMessage(message, this.origin);
    }
  };

  _proto.onBeforeUnload = function onBeforeUnload() {
    this.close();
  };

  return PopupManager;
}(events_default.a);


// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/wrapNativeSuper.js
var wrapNativeSuper = __webpack_require__(19);
var wrapNativeSuper_default = /*#__PURE__*/__webpack_require__.n(wrapNativeSuper);

// CONCATENATED MODULE: ./src/js/constants/errors.js


var errors_TrezorError =
/*#__PURE__*/
function (_Error) {
  inheritsLoose_default()(TrezorError, _Error);

  function TrezorError(code, message) {
    var _this;

    _this = _Error.call(this, message) || this;
    _this.code = code;
    _this.message = message;
    return _this;
  }

  return TrezorError;
}(wrapNativeSuper_default()(Error));
var invalidParameter = function invalidParameter(message) {
  return new errors_TrezorError('Connect_InvalidParameter', message);
}; // level 100 error during initialization

var NO_IFRAME = new errors_TrezorError(100, 'TrezorConnect not yet initialized');
var IFRAME_BLOCKED = new errors_TrezorError('iframe_blocked', 'TrezorConnect iframe was blocked');
var IFRAME_INITIALIZED = new errors_TrezorError(101, 'TrezorConnect has been already initialized');
var IFRAME_TIMEOUT = new errors_TrezorError(102, 'Iframe timeout');
var POPUP_TIMEOUT = new errors_TrezorError(103, 'Popup timeout');
var BROWSER_NOT_SUPPORTED = new errors_TrezorError(104, 'Browser not supported');
var MANIFEST_NOT_SET = new errors_TrezorError(105, 'Manifest not set. Read more at https://github.com/trezor/connect/blob/develop/docs/index.md');
var MANAGEMENT_NOT_ALLOWED = new errors_TrezorError(105, 'Management method not allowed for this configuration');
var NO_TRANSPORT = new errors_TrezorError(500, 'Transport is missing');
var WRONG_TRANSPORT_CONFIG = new errors_TrezorError(5002, 'Wrong config response'); // config_signed

var DEVICE_NOT_FOUND = new errors_TrezorError(501, 'Device not found'); // export const DEVICE_CALL_IN_PROGRESS: TrezorError = new TrezorError(502, "Device call in progress.");

var DEVICE_CALL_IN_PROGRESS = new errors_TrezorError(503, 'Device call in progress');
var INVALID_PARAMETERS = new errors_TrezorError(504, 'Invalid parameters');
var POPUP_CLOSED = new Error('Popup closed');
var PERMISSIONS_NOT_GRANTED = new errors_TrezorError(403, 'Permissions not granted');
var DEVICE_USED_ELSEWHERE = new errors_TrezorError(700, 'Device is used in another window');
var INITIALIZATION_FAILED = new errors_TrezorError('Failure_Initialize', 'Initialization failed');
var CALL_OVERRIDE = new errors_TrezorError('Failure_ActionOverride', 'override');
var INVALID_STATE = new errors_TrezorError('Failure_PassphraseState', 'Passphrase is incorrect'); // a slight hack
// this error string is hard-coded
// in both bridge and extension

var WRONG_PREVIOUS_SESSION_ERROR_MESSAGE = 'wrong previous session';
var INVALID_PIN_ERROR_MESSAGE = 'PIN invalid';
var WEBUSB_ERROR_MESSAGE = 'NetworkError: Unable to claim interface.'; // BlockBook

var backendNotSupported = function backendNotSupported(coinName) {
  return new errors_TrezorError('backend_error', "BlockchainLink support not found for " + coinName);
};
var BACKEND_NO_URL = new errors_TrezorError('Backend_init', 'Url not found');
var NO_COIN_INFO = invalidParameter('Coin not found.');
// CONCATENATED MODULE: ./src/js/iframe/inline-styles.js
var css = '.trezorconnect-container{position:fixed!important;display:-webkit-box!important;display:-webkit-flex!important;display:-ms-flexbox!important;display:flex!important;-webkit-box-orient:vertical!important;-webkit-box-direction:normal!important;-webkit-flex-direction:column!important;-ms-flex-direction:column!important;flex-direction:column!important;-webkit-box-align:center!important;-webkit-align-items:center!important;-ms-flex-align:center!important;align-items:center!important;z-index:10000!important;width:100%!important;height:100%!important;top:0!important;left:0!important;background:rgba(0,0,0,.35)!important;overflow:auto!important;padding:20px!important;margin:0!important}.trezorconnect-container .trezorconnect-window{position:relative!important;display:block!important;width:370px!important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif!important;margin:auto!important;border-radius:3px!important;background-color:#fff!important;text-align:center!important;overflow:hidden!important}.trezorconnect-container .trezorconnect-window .trezorconnect-head{text-align:left;padding:12px 24px!important;display:-webkit-box!important;display:-webkit-flex!important;display:-ms-flexbox!important;display:flex!important;-webkit-box-align:center!important;-webkit-align-items:center!important;-ms-flex-align:center!important;align-items:center!important}.trezorconnect-container .trezorconnect-window .trezorconnect-head .trezorconnect-logo{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.trezorconnect-container .trezorconnect-window .trezorconnect-head .trezorconnect-close{cursor:pointer!important;height:24px!important}.trezorconnect-container .trezorconnect-window .trezorconnect-head .trezorconnect-close svg{fill:#757575;-webkit-transition:fill .3s ease-in-out!important;transition:fill .3s ease-in-out!important}.trezorconnect-container .trezorconnect-window .trezorconnect-head .trezorconnect-close:hover svg{fill:#494949}.trezorconnect-container .trezorconnect-window .trezorconnect-body{padding:24px 24px 32px!important;background:#FBFBFB!important;border-top:1px solid #EBEBEB}.trezorconnect-container .trezorconnect-window .trezorconnect-body h3{color:#505050!important;font-size:16px!important;font-weight:500!important}.trezorconnect-container .trezorconnect-window .trezorconnect-body p{margin:8px 0 24px!important;font-weight:400!important;color:#A9A9A9!important;font-size:12px!important}.trezorconnect-container .trezorconnect-window .trezorconnect-body button{width:100%!important;padding:12px 24px!important;margin:0!important;border-radius:3px!important;font-size:14px!important;font-weight:300!important;cursor:pointer!important;background:#01B757!important;color:#fff!important;border:0!important;-webkit-transition:background-color .3s ease-in-out!important;transition:background-color .3s ease-in-out!important}.trezorconnect-container .trezorconnect-window .trezorconnect-body button:hover{background-color:#00AB51!important}.trezorconnect-container .trezorconnect-window .trezorconnect-body button:active{background-color:#009546!important}/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlucHV0IiwiJHN0ZGluIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWNBLHlCQUNJLFNBQUEsZ0JBQ0EsUUFBQSxzQkFDQSxRQUFBLHVCQUNBLFFBQUEsc0JBRUEsUUFBQSxlQUNBLG1CQUFBLG1CQUNBLHNCQUFBLGlCQUNBLHVCQUFBLGlCQUNBLG1CQUFBLGlCQUNBLGVBQUEsaUJBRUEsa0JBQUEsaUJBQ0Esb0JBQUEsaUJBQ0EsZUFBQSxpQkNmTSxZQUFhLGlCREFyQixRQUFTLGdCQWtCSCxNQUFBLGVBQ0EsT0FBQSxlQUNBLElBQUEsWUFDQSxLQUFBLFlBQ0EsV0FBQSwwQkFDQSxTQUFBLGVBQ0EsUUFBQSxlQUNBLE9BQUEsWUNkUiwrQ0RYRSxTQUFVLG1CQTZCQSxRQUFBLGdCQUNBLE1BQUEsZ0JBQ0EsWUFBQSxjQUFBLG1CQUFBLFdBQUEsT0FBQSxpQkFBQSxNQUFBLHFCQUNBLE9BQUEsZUNmVixjQUFlLGNEakJmLGlCQWlCRSxlQWtCWSxXQUFBLGlCQ2ZkLFNBQVUsaUJEbUJJLG1FQUNBLFdBQUEsS0NoQmQsUUFBUyxLQUFLLGVEeEJkLFFBQVMsc0JBMENTLFFBQUEsdUJBQ0EsUUFBQSxzQkNmbEIsUUFBUyxlRGlCSyxrQkE1QlosaUJBOEJvQixvQkFBQSxpQkNoQmxCLGVBQWdCLGlCRC9CWixZQWlCTixpQkFzQ1EsdUZBQ0EsaUJBQUEsRUNwQlYsYUFBYyxFRHBDVixTQUFVLEVBMkRBLEtBQUEsRUFFQSx3RkNwQmQsT0FBUSxrQkR6Q1IsT0FBUSxlQWlFTSw0RkFDQSxLQUFBLFFBQ0EsbUJBQUEsS0FBQSxJQUFBLHNCQ3BCZCxXQUFZLEtBQUssSUFBSyxzQkR3QlIsa0dBQ0EsS0FBQSxRQUVBLG1FQUNBLFFBQUEsS0FBQSxLQUFBLGVBQ0EsV0FBQSxrQkFDQSxXQUFBLElBQUEsTUFBQSxRQUVBLHNFQUNBLE1BQUEsa0JBQ0EsVUFBQSxlQ3JCZCxZQUFhLGNEd0JLLHFFQ3JCbEIsT0FBUSxJQUFJLEVBQUksZUR3QkYsWUFBQSxjQUNJLE1BQUEsa0JDdEJsQixVQUFXLGVBRWIsMEVBQ0UsTUFBTyxlQUNQLFFBQVMsS0FBSyxlQUNkLE9BQVEsWUFDUixjQUFlLGNBQ2YsVUFBVyxlQUNYLFlBQWEsY0FDYixPQUFRLGtCQUNSLFdBQVksa0JBQ1osTUFBTyxlQUNQLE9BQVEsWUFDUixtQkFBb0IsaUJBQWlCLElBQUssc0JBQzFDLFdBQVksaUJBQWlCLElBQUssc0JBRXBDLGdGQUNFLGlCQUFrQixrQkFFcEIsaUZBQ0UsaUJBQWtCIn0= */';
/* harmony default export */ var inline_styles = (css);
// CONCATENATED MODULE: ./src/js/iframe/builder.js






var instance;
var origin;
var initPromise = create();
var timeout = 0;
var builder_error;
var _messageID = 0; // every postMessage to iframe has its own promise to resolve

var messagePromises = {};
var builder_init = function init(settings) {
  var existedFrame, src, manifestString, manifest, onLoad;
  return regenerator_default.a.async(function init$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          initPromise = create();
          existedFrame = document.getElementById('trezorconnect');

          if (existedFrame) {
            instance = existedFrame;
          } else {
            instance = document.createElement('iframe');
            instance.frameBorder = '0';
            instance.width = '0px';
            instance.height = '0px';
            instance.style.position = 'absolute';
            instance.style.display = 'none';
            instance.style.border = '0px';
            instance.style.width = '0px';
            instance.style.height = '0px';
            instance.id = 'trezorconnect';
          }

          if (settings.env === 'web') {
            manifestString = settings.manifest ? JSON.stringify(settings.manifest) : 'undefined'; // note: btoa(undefined) === btoa('undefined') === "dW5kZWZpbmVk"

            manifest = "&version=" + settings.version + "&manifest=" + encodeURIComponent(btoa(JSON.stringify(manifestString)));
            src = settings.iframeSrc + "?" + Date.now() + manifest;
          } else {
            src = settings.iframeSrc;
          }

          instance.setAttribute('src', src);

          if (settings.webusb) {
            instance.setAttribute('allow', 'usb');
          }

          origin = getOrigin(instance.src);
          timeout = window.setTimeout(function () {
            initPromise.reject(IFRAME_TIMEOUT);
          }, 10000);

          onLoad = function onLoad() {
            if (!instance) {
              initPromise.reject(IFRAME_BLOCKED);
              return;
            }

            try {
              // if hosting page is able to access cross-origin location it means that the iframe is not loaded
              var iframeOrigin = instance.contentWindow.location.origin;

              if (!iframeOrigin || iframeOrigin === 'null') {
                // eslint-disable-next-line no-use-before-define
                builder_handleIframeBlocked();
                return;
              }
            } catch (e) {// empty
            }

            var extension; // $FlowIssue chrome is not declared outside

            if (typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.onConnect !== 'undefined') {
              chrome.runtime.onConnect.addListener(function () {});
              extension = chrome.runtime.id;
            }

            instance.contentWindow.postMessage({
              type: iframe["INIT"],
              payload: {
                settings: settings,
                extension: extension
              }
            }, origin);
            instance.onload = undefined;
          }; // IE hack


          if (instance.attachEvent) {
            instance.attachEvent('onload', onLoad);
          } else {
            instance.onload = onLoad;
          } // inject iframe into host document body


          if (document.body) {
            document.body.appendChild(instance); // eslint-disable-next-line no-use-before-define

            builder_injectStyleSheet();
          }

          _context.prev = 11;
          _context.next = 14;
          return regenerator_default.a.awrap(initPromise.promise);

        case 14:
          _context.next = 20;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](11);

          // reset state to allow initialization again
          if (instance) {
            if (instance.parentNode) {
              instance.parentNode.removeChild(instance);
            } // eslint-disable-next-line require-atomic-updates


            instance = null;
          }

          throw _context.t0.message || _context.t0;

        case 20:
          _context.prev = 20;
          window.clearTimeout(timeout);
          timeout = 0;
          return _context.finish(20);

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[11, 16, 20, 24]]);
};

var builder_injectStyleSheet = function injectStyleSheet() {
  if (!instance) {
    throw IFRAME_BLOCKED;
  }

  var doc = instance.ownerDocument;
  var head = doc.head || doc.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.setAttribute('id', 'TrezorConnectStylesheet'); // $FlowIssue

  if (style.styleSheet) {
    // IE
    // $FlowIssue
    style.styleSheet.cssText = inline_styles;
  } else {
    style.appendChild(document.createTextNode(inline_styles));
  }

  head.append(style);
};

var builder_handleIframeBlocked = function handleIframeBlocked() {
  window.clearTimeout(timeout);
  builder_error = IFRAME_BLOCKED.message; // eslint-disable-next-line no-use-before-define

  builder_dispose();
  initPromise.reject(IFRAME_BLOCKED);
}; // post messages to iframe


var builder_postMessage = function postMessage(message, usePromise) {
  if (usePromise === void 0) {
    usePromise = true;
  }

  if (!instance) {
    throw IFRAME_BLOCKED;
  }

  if (usePromise) {
    _messageID++;
    message.id = _messageID;
    messagePromises[_messageID] = create();
    instance.contentWindow.postMessage(message, origin);
    return messagePromises[_messageID].promise;
  }

  instance.contentWindow.postMessage(message, origin);
  return null;
};
var builder_dispose = function dispose() {
  if (instance && instance.parentNode) {
    try {
      instance.parentNode.removeChild(instance);
    } catch (error) {// do nothing
    }
  }

  instance = null;
  timeout = 0;
};
var builder_clearTimeout = function clearTimeout() {
  window.clearTimeout(timeout);
};
// CONCATENATED MODULE: ./src/js/webusb/button.js
var render = function render(className, url, origin) {
  var query = className || '.trezor-webusb-button';
  var buttons = document.querySelectorAll(query);
  var src = url + "?" + Date.now();
  buttons.forEach(function (b) {
    if (b.getElementsByTagName('iframe').length < 1) {
      var bounds = b.getBoundingClientRect();
      var btnIframe = document.createElement('iframe');
      btnIframe.frameBorder = '0';
      btnIframe.width = Math.round(bounds.width) + 'px';
      btnIframe.height = Math.round(bounds.height) + 'px';
      btnIframe.style.position = 'absolute';
      btnIframe.style.top = '0px';
      btnIframe.style.left = '0px';
      btnIframe.style.zIndex = '1'; // btnIframe.style.opacity = '0'; // this makes click impossible on cross-origin

      btnIframe.setAttribute('allow', 'usb');
      btnIframe.setAttribute('scrolling', 'no');

      btnIframe.onload = function () {
        btnIframe.contentWindow.postMessage({// style: JSON.stringify( window.getComputedStyle(b) ),
          // outer: b.outerHTML,
          // inner: b.innerHTML
        }, origin);
      };

      btnIframe.src = src; // inject iframe into button

      b.append(btnIframe);
    }
  });
};

/* harmony default export */ var webusb_button = (render);
// CONCATENATED MODULE: ./src/js/message/index.js
// parse MessageEvent .data into CoreMessage
var parseMessage = function parseMessage(messageData) {
  var message = {
    event: messageData.event,
    type: messageData.type,
    payload: messageData.payload
  };

  if (typeof messageData.id === 'number') {
    message.id = messageData.id;
  }

  if (typeof messageData.success === 'boolean') {
    message.success = messageData.success;
  }

  return message;
};
// CONCATENATED MODULE: ./src/js/data/ConnectSettings.js


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { defineProperty_default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/*
 * Initial settings for connect.
 * It could be changed by passing values into TrezorConnect.init(...) method
 */
var VERSION = '8.0.9';
var versionN = VERSION.split('.').map(function (s) {
  return parseInt(s);
});
var DIRECTORY = "" + versionN[0] + (versionN[1] > 0 ? "." + versionN[1] : '') + "/";
var DEFAULT_DOMAIN = "https://connect.trezor.io/" + DIRECTORY;
var DEFAULT_PRIORITY = 2;
var initialSettings = {
  configSrc: './data/config.json',
  // constant
  version: VERSION,
  // constant
  debug: false,
  origin: null,
  priority: DEFAULT_PRIORITY,
  trustedHost: false,
  connectSrc: DEFAULT_DOMAIN,
  iframeSrc: DEFAULT_DOMAIN + "iframe.html",
  popup: true,
  popupSrc: DEFAULT_DOMAIN + "popup.html",
  webusbSrc: DEFAULT_DOMAIN + "webusb.html",
  transportReconnect: false,
  webusb: true,
  pendingTransportEvent: true,
  supportedBrowser: typeof navigator !== 'undefined' ? !/Trident|MSIE/.test(navigator.userAgent) : true,
  extension: null,
  manifest: null,
  env: 'web',
  lazyLoad: false,
  timestamp: new Date().getTime()
};
var currentSettings = initialSettings;

var parseManifest = function parseManifest(manifest) {
  if (typeof manifest.email !== 'string') {
    return null;
  }

  if (typeof manifest.appUrl !== 'string') {
    return null;
  }

  return {
    email: manifest.email,
    appUrl: manifest.appUrl
  };
};

var getEnv = function getEnv() {
  // $FlowIssue: chrome is not declared outside the project
  if (typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.onConnect !== 'undefined') {
    return 'webextension';
  }

  if (typeof navigator !== 'undefined') {
    if (typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative') {
      return 'react-native';
    }

    var userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf(' electron/') > -1) {
      return 'electron';
    }
  } // if (typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative') {
  //     return 'react-native';
  // }
  // if (typeof process !== 'undefined' && process.versions.hasOwnProperty('electron')) {
  //     return 'electron';
  // }


  return 'web';
};
var parse = function parse(input) {
  if (!input) return currentSettings;

  var settings = _objectSpread({}, currentSettings);

  if (Object.prototype.hasOwnProperty.call(input, 'debug')) {
    if (Array.isArray(input)) {// enable log with prefix
    }

    if (typeof input.debug === 'boolean') {
      settings.debug = input.debug;
    } else if (typeof input.debug === 'string') {
      settings.debug = input.debug === 'true';
    }
  }

  if (typeof input.connectSrc === 'string') {
    // TODO: escape string, validate url
    settings.connectSrc = input.connectSrc;
  } else if (typeof window !== 'undefined' && typeof window.__TREZOR_CONNECT_SRC === 'string') {
    settings.connectSrc = window.__TREZOR_CONNECT_SRC;
  }

  settings.iframeSrc = settings.connectSrc + "iframe.html";
  settings.popupSrc = settings.connectSrc + "popup.html";
  settings.webusbSrc = settings.connectSrc + "webusb.html";

  if (typeof input.transportReconnect === 'boolean') {
    settings.transportReconnect = input.transportReconnect;
  }

  if (typeof input.webusb === 'boolean') {
    settings.webusb = input.webusb;
  }

  if (typeof input.popup === 'boolean') {
    settings.popup = input.popup;
  }

  if (typeof input.lazyLoad === 'boolean') {
    settings.lazyLoad = input.lazyLoad;
  }

  if (typeof input.pendingTransportEvent === 'boolean') {
    settings.pendingTransportEvent = input.pendingTransportEvent;
  } // local files


  if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
    settings.origin = "file://" + window.location.pathname;
    settings.webusb = false;
  }

  if (typeof input.extension === 'string') {
    settings.extension = input.extension;
  } // $FlowIssue chrome is not declared outside


  if (typeof input.env === 'string') {
    settings.env = input.env;
  } else {
    settings.env = getEnv();
  }

  if (typeof input.timestamp === 'number') {
    settings.timestamp = input.timestamp;
  }

  if (typeof input.manifest === 'object') {
    settings.manifest = parseManifest(input.manifest);
  }

  currentSettings = settings;
  return currentSettings;
};
// EXTERNAL MODULE: ./src/js/utils/debug.js
var debug = __webpack_require__(20);

// EXTERNAL MODULE: ./src/js/constants/index.js
var constants = __webpack_require__(5);

// EXTERNAL MODULE: ./src/js/constants/transport.js
var transport = __webpack_require__(8);

// EXTERNAL MODULE: ./src/js/types/index.js
var types = __webpack_require__(14);

// CONCATENATED MODULE: ./src/js/env/browser/index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return eventEmitter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return browser_manifest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return browser_dispose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return browser_cancel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return browser_init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return browser_call; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return browser_uiResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return browser_renderWebUSBButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return browser_getSettings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return browser_customMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return browser_requestLogin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return browser_disableWebUSB; });



function browser_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function browser_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { browser_ownKeys(source, true).forEach(function (key) { defineProperty_default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { browser_ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }















var eventEmitter = new events_default.a();

var _log = Object(debug["a" /* init */])('[trezor-connect.js]');

var _settings;

var _popupManager;

var browser_initPopupManager = function initPopupManager() {
  var pm = new PopupManager_PopupManager(_settings);
  pm.on(popup["c" /* CLOSED */], function (error) {
    builder_postMessage({
      type: popup["c" /* CLOSED */],
      payload: error ? {
        error: error
      } : null
    }, false);
  });
  return pm;
};

var browser_manifest = function manifest(data) {
  _settings = parse({
    manifest: data
  });
};
var browser_dispose = function dispose() {
  builder_dispose();

  if (_popupManager) {
    _popupManager.close();
  }
};
var browser_cancel = function cancel(error) {
  if (_popupManager) {
    _popupManager.emit(popup["c" /* CLOSED */], error);
  }
}; // handle message received from iframe

var browser_handleMessage = function handleMessage(messageEvent) {
  // ignore messages from domain other then iframe origin
  if (messageEvent.origin !== origin) return;
  var message = parseMessage(messageEvent.data);
  var event = message.event,
      type = message.type,
      payload = message.payload;
  var id = message.id || 0;

  _log.log('handleMessage', message);

  switch (event) {
    case constants["c" /* RESPONSE_EVENT */]:
      if (messagePromises[id]) {
        // resolve message promise (send result of call method)
        messagePromises[id].resolve({
          id: id,
          success: message.success,
          payload: payload
        });
        delete messagePromises[id];
      } else {
        _log.warn("Unknown message id " + id);
      }

      break;

    case constants["b" /* DEVICE_EVENT */]:
      // pass DEVICE event up to html
      eventEmitter.emit(event, message);
      eventEmitter.emit(type, payload); // DEVICE_EVENT also emit single events (connect/disconnect...)

      break;

    case constants["d" /* TRANSPORT_EVENT */]:
      eventEmitter.emit(event, message);
      eventEmitter.emit(type, payload);
      break;

    case constants["a" /* BLOCKCHAIN_EVENT */]:
      eventEmitter.emit(event, message);
      eventEmitter.emit(type, payload);
      break;

    case constants["e" /* UI_EVENT */]:
      if (type === iframe["BOOTSTRAP"]) {
        builder_clearTimeout();
        break;
      }

      if (type === iframe["LOADED"]) {
        initPromise.resolve();
      }

      if (type === iframe["ERROR"]) {
        initPromise.reject(new Error(payload.error));
      } // pass UI event up


      eventEmitter.emit(event, message);
      eventEmitter.emit(type, payload);
      break;

    default:
      _log.log('Undefined message', event, messageEvent);

  }
};

var browser_init = function init(settings) {
  return regenerator_default.a.async(function init$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (settings === void 0) {
            settings = {};
          }

          if (!instance) {
            _context.next = 3;
            break;
          }

          throw IFRAME_INITIALIZED;

        case 3:
          if (!_settings) {
            _settings = parse(settings);
          }

          if (_settings.manifest) {
            _context.next = 6;
            break;
          }

          throw MANIFEST_NOT_SET;

        case 6:
          if (_settings.supportedBrowser) {
            _context.next = 8;
            break;
          }

          throw BROWSER_NOT_SUPPORTED;

        case 8:
          if (!_settings.lazyLoad) {
            _context.next = 11;
            break;
          }

          // reset "lazyLoad" after first use
          _settings.lazyLoad = false;
          return _context.abrupt("return");

        case 11:
          if (!_popupManager) {
            _popupManager = browser_initPopupManager();
          }

          _log.enabled = _settings.debug;
          window.addEventListener('message', browser_handleMessage);
          window.addEventListener('beforeunload', browser_dispose);
          _context.next = 17;
          return regenerator_default.a.awrap(builder_init(_settings));

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
};
var browser_call = function call(params) {
  var response;
  return regenerator_default.a.async(function call$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(!instance && !timeout)) {
            _context2.next = 17;
            break;
          }

          // init popup with lazy loading before iframe initialization
          _settings = parse(_settings);

          if (_settings.manifest) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", {
            success: false,
            payload: {
              error: MANIFEST_NOT_SET.message
            }
          });

        case 4:
          if (_settings.supportedBrowser) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", {
            success: false,
            payload: {
              error: BROWSER_NOT_SUPPORTED.message
            }
          });

        case 6:
          if (!_popupManager) {
            _popupManager = browser_initPopupManager();
          }

          _popupManager.request(true); // auto init with default settings


          _context2.prev = 8;
          _context2.next = 11;
          return regenerator_default.a.awrap(browser_init(_settings));

        case 11:
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](8);

          if (_popupManager) {
            _popupManager.close();
          }

          return _context2.abrupt("return", {
            success: false,
            payload: {
              error: _context2.t0
            }
          });

        case 17:
          if (!timeout) {
            _context2.next = 21;
            break;
          }

          return _context2.abrupt("return", {
            success: false,
            payload: {
              error: NO_IFRAME.message
            }
          });

        case 21:
          if (!builder_error) {
            _context2.next = 23;
            break;
          }

          return _context2.abrupt("return", {
            success: false,
            payload: {
              error: builder_error
            }
          });

        case 23:
          // request popup window it might be used in the future
          if (_settings.popup && _popupManager) {
            _popupManager.request();
          } // post message to iframe


          _context2.prev = 24;
          _context2.next = 27;
          return regenerator_default.a.awrap(builder_postMessage({
            type: iframe["CALL"],
            payload: params
          }));

        case 27:
          response = _context2.sent;

          if (!response) {
            _context2.next = 33;
            break;
          }

          // TODO: unlock popupManager request only if there wasn't error "in progress"
          if (response.payload.error !== DEVICE_CALL_IN_PROGRESS.message && _popupManager) {
            _popupManager.unlock();
          }

          return _context2.abrupt("return", response);

        case 33:
          if (_popupManager) {
            _popupManager.unlock();
          }

          return _context2.abrupt("return", {
            success: false,
            payload: {
              error: 'No response from iframe'
            }
          });

        case 35:
          _context2.next = 41;
          break;

        case 37:
          _context2.prev = 37;
          _context2.t1 = _context2["catch"](24);

          _log.error('__call error', _context2.t1);

          return _context2.abrupt("return", _context2.t1);

        case 41:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 13], [24, 37]]);
};

var browser_customMessageResponse = function customMessageResponse(payload) {
  builder_postMessage({
    event: constants["e" /* UI_EVENT */],
    type: ui["CUSTOM_MESSAGE_RESPONSE"],
    payload: payload
  });
};

var browser_uiResponse = function uiResponse(response) {
  builder_postMessage(browser_objectSpread({
    event: constants["e" /* UI_EVENT */]
  }, response));
};
var browser_renderWebUSBButton = function renderWebUSBButton(className) {
  webusb_button(className, _settings.webusbSrc, origin);
};
var browser_getSettings = function getSettings() {
  return regenerator_default.a.async(function getSettings$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (instance) {
            _context3.next = 2;
            break;
          }

          return _context3.abrupt("return", {
            success: false,
            payload: {
              error: 'Iframe not initialized yet, you need to call TrezorConnect.init or any other method first.'
            }
          });

        case 2:
          _context3.next = 4;
          return regenerator_default.a.awrap(browser_call({
            method: 'getSettings'
          }));

        case 4:
          return _context3.abrupt("return", _context3.sent);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
};
var browser_customMessage = function customMessage(params) {
  var callback, customMessageListener, response;
  return regenerator_default.a.async(function customMessage$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!(typeof params.callback !== 'function')) {
            _context5.next = 2;
            break;
          }

          return _context5.abrupt("return", {
            success: false,
            payload: {
              error: 'Parameter "callback" is not a function'
            }
          });

        case 2:
          // TODO: set message listener only if iframe is loaded correctly
          callback = params.callback;

          customMessageListener = function customMessageListener(event) {
            var data, payload;
            return regenerator_default.a.async(function customMessageListener$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    data = event.data;

                    if (!(data && data.type === ui["CUSTOM_MESSAGE_REQUEST"])) {
                      _context4.next = 6;
                      break;
                    }

                    _context4.next = 4;
                    return regenerator_default.a.awrap(callback(data.payload));

                  case 4:
                    payload = _context4.sent;

                    if (payload) {
                      browser_customMessageResponse(payload);
                    } else {
                      browser_customMessageResponse({
                        message: 'release'
                      });
                    }

                  case 6:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          };

          window.addEventListener('message', customMessageListener, false);
          _context5.next = 7;
          return regenerator_default.a.awrap(browser_call(browser_objectSpread({
            method: 'customMessage'
          }, params, {
            callback: null
          })));

        case 7:
          response = _context5.sent;
          window.removeEventListener('message', customMessageListener);
          return _context5.abrupt("return", response);

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  });
};
var browser_requestLogin = function requestLogin(params) {
  var _callback, loginChallengeListener, response;

  return regenerator_default.a.async(function requestLogin$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          if (!(typeof params.callback === 'function')) {
            _context7.next = 11;
            break;
          }

          _callback = params.callback; // TODO: set message listener only if iframe is loaded correctly

          loginChallengeListener = function loginChallengeListener(event) {
            var data, payload;
            return regenerator_default.a.async(function loginChallengeListener$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    data = event.data;

                    if (!(data && data.type === ui["LOGIN_CHALLENGE_REQUEST"])) {
                      _context6.next = 12;
                      break;
                    }

                    _context6.prev = 2;
                    _context6.next = 5;
                    return regenerator_default.a.awrap(_callback());

                  case 5:
                    payload = _context6.sent;
                    builder_postMessage({
                      event: constants["e" /* UI_EVENT */],
                      type: ui["LOGIN_CHALLENGE_RESPONSE"],
                      payload: payload
                    });
                    _context6.next = 12;
                    break;

                  case 9:
                    _context6.prev = 9;
                    _context6.t0 = _context6["catch"](2);
                    builder_postMessage({
                      event: constants["e" /* UI_EVENT */],
                      type: ui["LOGIN_CHALLENGE_RESPONSE"],
                      payload: _context6.t0.message
                    });

                  case 12:
                  case "end":
                    return _context6.stop();
                }
              }
            }, null, null, [[2, 9]]);
          };

          window.addEventListener('message', loginChallengeListener, false);
          _context7.next = 6;
          return regenerator_default.a.awrap(browser_call(browser_objectSpread({
            method: 'requestLogin'
          }, params, {
            asyncChallenge: true,
            callback: null
          })));

        case 6:
          response = _context7.sent;
          window.removeEventListener('message', loginChallengeListener);
          return _context7.abrupt("return", response);

        case 11:
          _context7.next = 13;
          return regenerator_default.a.awrap(browser_call(browser_objectSpread({
            method: 'requestLogin'
          }, params)));

        case 13:
          return _context7.abrupt("return", _context7.sent);

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  });
};
var browser_disableWebUSB = function disableWebUSB() {
  builder_postMessage({
    event: constants["e" /* UI_EVENT */],
    type: transport["DISABLE_WEBUSB"]
  });
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BOOTSTRAP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return LOADED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return INIT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ERROR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return EXTENSION_USB_PERMISSIONS; });
/* unused harmony export HANDSHAKE */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return CLOSED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CANCEL_POPUP_REQUEST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return CLOSE_WINDOW; });
// Message called from popup.html inline script before "window.onload" event. This is first message from popup to window.opener.
var BOOTSTRAP = 'popup-bootstrap'; // Message from popup.js to window.opener, called after "window.onload" event. This is second message from popup to window.opener.

var LOADED = 'popup-loaded'; // Message from window.opener to popup.js. Send settings to popup. This is first message from window.opener to popup.

var INIT = 'popup-init'; // Error message from popup to window.opener. Could be thrown during popup initialization process (POPUP.INIT)

var ERROR = 'popup-error'; // Message to webextensions, opens "trezor-usb-permission.html" within webextension

var EXTENSION_USB_PERMISSIONS = 'open-usb-permissions'; // Message called from both [popup > iframe] then [popup > iframe > popup] in this exact order.
// Firstly popup call iframe to resolve popup promise in Core
// Then iframe reacts to POPUP.HANDSHAKE message and sends ConnectSettings, transport information and requested method details back to popup

var HANDSHAKE = 'popup-handshake'; // Event emitted from PopupManager at the end of popup closing process.
// Sent from popup thru window.opener to an iframe because message channel between popup and iframe is no longer available

var CLOSED = 'popup-closed'; // Message called from iframe to popup, it means that popup will not be needed (example: Blockchain methods are not using popup at all)
// This will close active popup window and/or clear opening process in PopupManager (maybe popup wasn't opened yet)

var CANCEL_POPUP_REQUEST = 'ui-cancel-popup-request'; // Message called from inline element in popup.html (window.closeWindow), this is used only with webextensions to properly handle popup close event

var CLOSE_WINDOW = 'window.close';

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TRANSPORT", function() { return TRANSPORT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BOOTLOADER", function() { return BOOTLOADER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NOT_IN_BOOTLOADER", function() { return NOT_IN_BOOTLOADER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REQUIRE_MODE", function() { return REQUIRE_MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INITIALIZE", function() { return INITIALIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SEEDLESS", function() { return SEEDLESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIRMWARE_OLD", function() { return FIRMWARE_OLD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIRMWARE_OUTDATED", function() { return FIRMWARE_OUTDATED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIRMWARE_NOT_SUPPORTED", function() { return FIRMWARE_NOT_SUPPORTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIRMWARE_NOT_COMPATIBLE", function() { return FIRMWARE_NOT_COMPATIBLE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIRMWARE_NOT_INSTALLED", function() { return FIRMWARE_NOT_INSTALLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEVICE_NEEDS_BACKUP", function() { return DEVICE_NEEDS_BACKUP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BROWSER_NOT_SUPPORTED", function() { return BROWSER_NOT_SUPPORTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BROWSER_OUTDATED", function() { return BROWSER_OUTDATED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECEIVE_BROWSER", function() { return RECEIVE_BROWSER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REQUEST_UI_WINDOW", function() { return REQUEST_UI_WINDOW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CLOSE_UI_WINDOW", function() { return CLOSE_UI_WINDOW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REQUEST_PERMISSION", function() { return REQUEST_PERMISSION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REQUEST_CONFIRMATION", function() { return REQUEST_CONFIRMATION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REQUEST_PIN", function() { return REQUEST_PIN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INVALID_PIN", function() { return INVALID_PIN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REQUEST_PASSPHRASE", function() { return REQUEST_PASSPHRASE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REQUEST_PASSPHRASE_ON_DEVICE", function() { return REQUEST_PASSPHRASE_ON_DEVICE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INVALID_PASSPHRASE", function() { return INVALID_PASSPHRASE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INVALID_PASSPHRASE_ACTION", function() { return INVALID_PASSPHRASE_ACTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CONNECT", function() { return CONNECT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOADING", function() { return LOADING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_OPERATION", function() { return SET_OPERATION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SELECT_DEVICE", function() { return SELECT_DEVICE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SELECT_ACCOUNT", function() { return SELECT_ACCOUNT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SELECT_FEE", function() { return SELECT_FEE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_CUSTOM_FEE", function() { return UPDATE_CUSTOM_FEE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INSUFFICIENT_FUNDS", function() { return INSUFFICIENT_FUNDS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REQUEST_BUTTON", function() { return REQUEST_BUTTON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REQUEST_WORD", function() { return REQUEST_WORD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIRMWARE_PROGRESS", function() { return FIRMWARE_PROGRESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECEIVE_PERMISSION", function() { return RECEIVE_PERMISSION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECEIVE_CONFIRMATION", function() { return RECEIVE_CONFIRMATION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECEIVE_PIN", function() { return RECEIVE_PIN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECEIVE_PASSPHRASE", function() { return RECEIVE_PASSPHRASE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECEIVE_DEVICE", function() { return RECEIVE_DEVICE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_ACCOUNT", function() { return CHANGE_ACCOUNT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECEIVE_ACCOUNT", function() { return RECEIVE_ACCOUNT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECEIVE_FEE", function() { return RECEIVE_FEE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECEIVE_WORD", function() { return RECEIVE_WORD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGE_SETTINGS", function() { return CHANGE_SETTINGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CUSTOM_MESSAGE_REQUEST", function() { return CUSTOM_MESSAGE_REQUEST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CUSTOM_MESSAGE_RESPONSE", function() { return CUSTOM_MESSAGE_RESPONSE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGIN_CHALLENGE_REQUEST", function() { return LOGIN_CHALLENGE_REQUEST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGIN_CHALLENGE_RESPONSE", function() { return LOGIN_CHALLENGE_RESPONSE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BUNDLE_PROGRESS", function() { return BUNDLE_PROGRESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ADDRESS_VALIDATION", function() { return ADDRESS_VALIDATION; });
var TRANSPORT = 'ui-no_transport';
var BOOTLOADER = 'ui-device_bootloader_mode';
var NOT_IN_BOOTLOADER = 'ui-device_not_in_bootloader_mode';
var REQUIRE_MODE = 'ui-device_require_mode';
var INITIALIZE = 'ui-device_not_initialized';
var SEEDLESS = 'ui-device_seedless';
var FIRMWARE_OLD = 'ui-device_firmware_old';
var FIRMWARE_OUTDATED = 'ui-device_firmware_outdated';
var FIRMWARE_NOT_SUPPORTED = 'ui-device_firmware_unsupported';
var FIRMWARE_NOT_COMPATIBLE = 'ui-device_firmware_not_compatible';
var FIRMWARE_NOT_INSTALLED = 'ui-device_firmware_not_installed';
var DEVICE_NEEDS_BACKUP = 'ui-device_needs_backup';
var BROWSER_NOT_SUPPORTED = 'ui-browser_not_supported';
var BROWSER_OUTDATED = 'ui-browser_outdated';
var RECEIVE_BROWSER = 'ui-receive_browser';
var REQUEST_UI_WINDOW = 'ui-request_window';
var CLOSE_UI_WINDOW = 'ui-close_window';
var REQUEST_PERMISSION = 'ui-request_permission';
var REQUEST_CONFIRMATION = 'ui-request_confirmation';
var REQUEST_PIN = 'ui-request_pin';
var INVALID_PIN = 'ui-invalid_pin';
var REQUEST_PASSPHRASE = 'ui-request_passphrase';
var REQUEST_PASSPHRASE_ON_DEVICE = 'ui-request_passphrase_on_device';
var INVALID_PASSPHRASE = 'ui-invalid_passphrase';
var INVALID_PASSPHRASE_ACTION = 'ui-invalid_passphrase_action';
var CONNECT = 'ui-connect';
var LOADING = 'ui-loading';
var SET_OPERATION = 'ui-set_operation';
var SELECT_DEVICE = 'ui-select_device';
var SELECT_ACCOUNT = 'ui-select_account';
var SELECT_FEE = 'ui-select_fee';
var UPDATE_CUSTOM_FEE = 'ui-update_custom_fee';
var INSUFFICIENT_FUNDS = 'ui-insufficient_funds';
var REQUEST_BUTTON = 'ui-button';
var REQUEST_WORD = 'ui-request_word';
var FIRMWARE_PROGRESS = 'ui-firmware-progress';
var RECEIVE_PERMISSION = 'ui-receive_permission';
var RECEIVE_CONFIRMATION = 'ui-receive_confirmation';
var RECEIVE_PIN = 'ui-receive_pin';
var RECEIVE_PASSPHRASE = 'ui-receive_passphrase';
var RECEIVE_DEVICE = 'ui-receive_device';
var CHANGE_ACCOUNT = 'ui-change_account';
var RECEIVE_ACCOUNT = 'ui-receive_account';
var RECEIVE_FEE = 'ui-receive_fee';
var RECEIVE_WORD = 'ui-receive_word';
var CHANGE_SETTINGS = 'ui-change_settings';
var CUSTOM_MESSAGE_REQUEST = 'ui-custom_request';
var CUSTOM_MESSAGE_RESPONSE = 'ui-custom_response';
var LOGIN_CHALLENGE_REQUEST = 'ui-login_challenge_request';
var LOGIN_CHALLENGE_RESPONSE = 'ui-login_challenge_response';
var BUNDLE_PROGRESS = 'ui-bundle_progress';
var ADDRESS_VALIDATION = 'ui-address_validation';

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export CORE_EVENT */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return UI_EVENT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DEVICE_EVENT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return TRANSPORT_EVENT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return RESPONSE_EVENT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BLOCKCHAIN_EVENT; });
var CORE_EVENT = 'CORE_EVENT';
var UI_EVENT = 'UI_EVENT';
var DEVICE_EVENT = 'DEVICE_EVENT';
var TRANSPORT_EVENT = 'TRANSPORT_EVENT';
var RESPONSE_EVENT = 'RESPONSE_EVENT';
var BLOCKCHAIN_EVENT = 'BLOCKCHAIN_EVENT';

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BOOTSTRAP", function() { return BOOTSTRAP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOADED", function() { return LOADED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INIT", function() { return INIT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ERROR", function() { return ERROR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CALL", function() { return CALL; });
// Message called from iframe.html inline script before "window.onload" event. This is first message from iframe to window.opener.
var BOOTSTRAP = 'iframe-bootstrap'; // Message from iframe.js to window.opener, called after "window.onload" event. This is second message from iframe to window.opener.

var LOADED = 'iframe-loaded'; // Message from window.opener to iframe.js

var INIT = 'iframe-init'; // Error message from iframe.js to window.opener. Could be thrown during iframe initialization process

var ERROR = 'iframe-error'; // Message from window.opener to iframe. Call method

var CALL = 'iframe-call';

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "START", function() { return START; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ERROR", function() { return ERROR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE", function() { return UPDATE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "STREAM", function() { return STREAM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REQUEST", function() { return REQUEST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECONNECT", function() { return RECONNECT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DISABLE_WEBUSB", function() { return DISABLE_WEBUSB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "START_PENDING", function() { return START_PENDING; });
var START = 'transport-start';
var ERROR = 'transport-error';
var UPDATE = 'transport-update';
var STREAM = 'transport-stream';
var REQUEST = 'transport-request_device';
var RECONNECT = 'transport-reconnect';
var DISABLE_WEBUSB = 'transport-disable_webusb';
var START_PENDING = 'transport-start_pending';

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = $getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}


/***/ }),
/* 10 */
/***/ (function(module, exports) {

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

module.exports = _inheritsLoose;

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CONNECT", function() { return CONNECT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CONNECT_UNACQUIRED", function() { return CONNECT_UNACQUIRED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DISCONNECT", function() { return DISCONNECT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANGED", function() { return CHANGED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ACQUIRE", function() { return ACQUIRE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RELEASE", function() { return RELEASE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ACQUIRED", function() { return ACQUIRED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RELEASED", function() { return RELEASED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USED_ELSEWHERE", function() { return USED_ELSEWHERE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOADING", function() { return LOADING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BUTTON", function() { return BUTTON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PIN", function() { return PIN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PASSPHRASE", function() { return PASSPHRASE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PASSPHRASE_ON_DEVICE", function() { return PASSPHRASE_ON_DEVICE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WORD", function() { return WORD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WAIT_FOR_SELECTION", function() { return WAIT_FOR_SELECTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UNREADABLE", function() { return UNREADABLE; });
// device list events
var CONNECT = 'device-connect';
var CONNECT_UNACQUIRED = 'device-connect_unacquired';
var DISCONNECT = 'device-disconnect';
var CHANGED = 'device-changed';
var ACQUIRE = 'device-acquire';
var RELEASE = 'device-release';
var ACQUIRED = 'device-acquired';
var RELEASED = 'device-released';
var USED_ELSEWHERE = 'device-used_elsewhere';
var LOADING = 'device-loading'; // trezor-link events in protobuf format

var BUTTON = 'button';
var PIN = 'pin';
var PASSPHRASE = 'passphrase';
var PASSPHRASE_ON_DEVICE = 'passphrase_on_device';
var WORD = 'word'; // custom

var WAIT_FOR_SELECTION = 'device-wait_for_selection'; // this string has different prefix than other constants and it's used as device path

var UNREADABLE = 'unreadable-device';

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ERROR", function() { return ERROR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CONNECT", function() { return CONNECT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLOCK", function() { return BLOCK; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NOTIFICATION", function() { return NOTIFICATION; });
// blockchain events
var ERROR = 'blockchain-error';
var CONNECT = 'blockchain-connect';
var BLOCK = 'blockchain-block';
var NOTIFICATION = 'blockchain-notification';

/***/ }),
/* 13 */
/***/ (function(module, exports) {



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _constants_transport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _constants_popup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _constants_iframe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
/* harmony import */ var _constants_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4);
/* harmony import */ var _constants_device__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11);
/* harmony import */ var _params__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(23);
/* harmony import */ var _params__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_params__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _response__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(13);
/* harmony import */ var _response__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_response__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _cardano__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(24);
/* harmony import */ var _cardano__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_cardano__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _ripple__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(25);
/* harmony import */ var _ripple__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_ripple__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _ethereum__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(26);
/* harmony import */ var _ethereum__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_ethereum__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _nem__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(27);
/* harmony import */ var _nem__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_nem__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _stellar__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(28);
/* harmony import */ var _stellar__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_stellar__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _lisk__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(29);
/* harmony import */ var _lisk__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_lisk__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _tezos__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(30);
/* harmony import */ var _tezos__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_tezos__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _eos__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(31);
/* harmony import */ var _eos__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_eos__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _binance__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(32);
/* harmony import */ var _binance__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_binance__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _vsys__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(33);
/* harmony import */ var _vsys__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_vsys__WEBPACK_IMPORTED_MODULE_17__);
/* unused harmony reexport * */
/* harmony import */ var _coinInfo__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(15);
/* harmony import */ var _coinInfo__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(_coinInfo__WEBPACK_IMPORTED_MODULE_18__);
/* unused harmony reexport * */
/*
* Public types accessible from npm library
*/

















 // export type UiResponseFn = (settings: UiResponse) => void;

/* eslint-enable no-redeclare */



/***/ }),
/* 15 */
/***/ (function(module, exports) {



/***/ }),
/* 16 */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _constants_blockchain__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);


/***/ }),
/* 18 */
/***/ (function(module, exports) {



/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var getPrototypeOf = __webpack_require__(34);

var setPrototypeOf = __webpack_require__(16);

var isNativeFunction = __webpack_require__(35);

var construct = __webpack_require__(36);

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return construct(Class, arguments, getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

module.exports = _wrapNativeSuper;

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* unused harmony export default */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return init; });
/* unused harmony export enable */
/* unused harmony export getLog */
/* unused harmony export enableByPrefix */
/* unused harmony export popupConsole */
var _this = undefined;

// https://stackoverflow.com/questions/7505623/colors-in-javascript-console
// https://github.com/pimterry/loglevel/blob/master/lib/loglevel.js
// http://www.color-hex.com/color-palette/5016
var colors = {
  // green
  'DescriptorStream': 'color: #77ab59',
  'DeviceList': 'color: #36802d',
  'Device': 'color: #bada55',
  'Core': 'color: #c9df8a',
  'IFrame': 'color: #FFFFFF; background: #f4a742;',
  'Popup': 'color: #f48a00'
};

var Log =
/*#__PURE__*/
function () {
  function Log(prefix, enabled) {
    if (enabled === void 0) {
      enabled = false;
    }

    this.prefix = prefix;
    this.enabled = enabled;
    this.messages = [];
    this.css = colors[prefix] || 'color: #000000; background: #FFFFFF;';
  }

  var _proto = Log.prototype;

  _proto.addMessage = function addMessage(level, prefix) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    this.messages.push({
      level: level,
      prefix: prefix,
      message: args,
      timestamp: new Date().getTime()
    });
  };

  _proto.log = function log() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    this.addMessage.apply(this, ['log', this.prefix].concat(args)); // eslint-disable-next-line no-console

    if (this.enabled) {
      var _console;

      (_console = console).log.apply(_console, [this.prefix].concat(args));
    }
  };

  _proto.error = function error() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    this.addMessage.apply(this, ['error', this.prefix].concat(args)); // eslint-disable-next-line no-console

    if (this.enabled) {
      var _console2;

      (_console2 = console).error.apply(_console2, [this.prefix].concat(args));
    }
  };

  _proto.warn = function warn() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    this.addMessage.apply(this, ['warn', this.prefix].concat(args)); // eslint-disable-next-line no-console

    if (this.enabled) {
      var _console3;

      (_console3 = console).warn.apply(_console3, [this.prefix].concat(args));
    }
  };

  _proto.debug = function debug() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    this.addMessage.apply(this, ['debug', this.prefix].concat(args)); // eslint-disable-next-line no-console

    if (this.enabled) {
      var _console4;

      (_console4 = console).log.apply(_console4, ['%c' + this.prefix, this.css].concat(args));
    }
  };

  return Log;
}();


var _logs = {};
var init = function init(prefix, enabled) {
  var enab = typeof enabled === 'boolean' ? enabled : false;
  var instance = new Log(prefix, enab);
  _logs[prefix] = instance;
  return instance;
};
var enable = function enable(enabled) {
  for (var _i = 0, _Object$keys = Object.keys(_logs); _i < _Object$keys.length; _i++) {
    var l = _Object$keys[_i];
    _logs[l].enabled = enabled;
  }
};
var getLog = function getLog(args) {
  // if
  var logs = [];

  for (var _i2 = 0, _Object$keys2 = Object.keys(_logs); _i2 < _Object$keys2.length; _i2++) {
    var l = _Object$keys2[_i2];
    logs = logs.concat(_logs[l].messages);
  }

  logs.sort(function (a, b) {
    return a.timestamp - b.timestamp;
  });
  return logs;
};
var enableByPrefix = function enableByPrefix(prefix, enabled) {
  if (_logs[prefix]) {
    _logs[prefix].enabled = enabled;
  }
}; // TODO: enable/disable log at runtime

var popupConsole = function popupConsole(tag, postMessage) {
  var c = global.console;
  var orig = {
    error: c.error,
    // warn: c.warn,
    info: c.info,
    debug: c.debug,
    log: c.log
  };
  var log = [];

  var inject = function inject(method, level) {
    return function () {
      // args.unshift('[popup.js]');
      var time = new Date().toUTCString();

      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      log.push([level, time].concat(args));
      postMessage.apply(_this, [{
        type: tag,
        level: level,
        time: time,
        args: JSON.stringify(args)
      } // { type: 'LOG', level: level, time: time, args: JSON.stringify(deepClone(args)) }
      ]);
      return method.apply(c, args);
    };
  };

  for (var level in orig) {
    c[level] = inject(orig[level], level);
  }
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(37)))

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UI_EVENT", function() { return _constants__WEBPACK_IMPORTED_MODULE_2__["e"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEVICE_EVENT", function() { return _constants__WEBPACK_IMPORTED_MODULE_2__["b"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TRANSPORT_EVENT", function() { return _constants__WEBPACK_IMPORTED_MODULE_2__["d"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BLOCKCHAIN_EVENT", function() { return _constants__WEBPACK_IMPORTED_MODULE_2__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RESPONSE_EVENT", function() { return _constants__WEBPACK_IMPORTED_MODULE_2__["c"]; });

/* harmony import */ var _constants_transport__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "TRANSPORT", function() { return _constants_transport__WEBPACK_IMPORTED_MODULE_3__; });
/* harmony import */ var _constants_iframe__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "IFRAME", function() { return _constants_iframe__WEBPACK_IMPORTED_MODULE_4__; });
/* harmony import */ var _constants_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "UI", function() { return _constants_ui__WEBPACK_IMPORTED_MODULE_5__; });
/* harmony import */ var _constants_device__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(11);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "DEVICE", function() { return _constants_device__WEBPACK_IMPORTED_MODULE_6__; });
/* harmony import */ var _constants_blockchain__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(12);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "BLOCKCHAIN", function() { return _constants_blockchain__WEBPACK_IMPORTED_MODULE_7__; });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(14);
/* harmony import */ var _env_node__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(1);
/* harmony import */ var _types_blockchainEvent__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(17);
/* harmony import */ var _types_account__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(18);
/* harmony import */ var _types_account__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_types_account__WEBPACK_IMPORTED_MODULE_11__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _types_account__WEBPACK_IMPORTED_MODULE_11__) if(["IFRAME","TRANSPORT","UI","DEVICE","BLOCKCHAIN","UI_EVENT","DEVICE_EVENT","TRANSPORT_EVENT","BLOCKCHAIN_EVENT","RESPONSE_EVENT","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _types_account__WEBPACK_IMPORTED_MODULE_11__[key]; }) }(__WEBPACK_IMPORT_KEY__));



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }










var TrezorConnect = function TrezorConnect() {};

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "manifest", function (data) {
  Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* manifest */ "i"])(data);
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "getSettings", function _callee() {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* getSettings */ "g"])());

        case 2:
          return _context.abrupt("return", _context.sent);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "init", function _callee2(settings) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* init */ "h"])(settings));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "on", function (type, fn) {
  _env_node__WEBPACK_IMPORTED_MODULE_9__[/* eventEmitter */ "f"].on(type, fn);
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "off", function (type, fn) {
  _env_node__WEBPACK_IMPORTED_MODULE_9__[/* eventEmitter */ "f"].removeListener(type, fn);
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "uiResponse", function (response) {
  Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* uiResponse */ "l"])(response);
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "blockchainDisconnect", function _callee3(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'blockchainDisconnect'
          }, params)));

        case 2:
          return _context3.abrupt("return", _context3.sent);

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "blockchainEstimateFee", function _callee4(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'blockchainEstimateFee'
          }, params)));

        case 2:
          return _context4.abrupt("return", _context4.sent);

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "blockchainGetTransactions", function _callee5(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'blockchainGetTransactions'
          }, params)));

        case 2:
          return _context5.abrupt("return", _context5.sent);

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "blockchainSubscribe", function _callee6(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'blockchainSubscribe'
          }, params)));

        case 2:
          return _context6.abrupt("return", _context6.sent);

        case 3:
        case "end":
          return _context6.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "blockchainUnsubscribe", function _callee7(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'blockchainUnsubscribe'
          }, params)));

        case 2:
          return _context7.abrupt("return", _context7.sent);

        case 3:
        case "end":
          return _context7.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "customMessage", function _callee8(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* customMessage */ "c"])(params));

        case 2:
          return _context8.abrupt("return", _context8.sent);

        case 3:
        case "end":
          return _context8.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "requestLogin", function _callee9(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* requestLogin */ "k"])(params));

        case 2:
          return _context9.abrupt("return", _context9.sent);

        case 3:
        case "end":
          return _context9.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "resetDevice", function _callee10(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'resetDevice'
          }, params)));

        case 2:
          return _context10.abrupt("return", _context10.sent);

        case 3:
        case "end":
          return _context10.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "cardanoGetAddress", function _callee11(params) {
  var useEventListener;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          useEventListener = _env_node__WEBPACK_IMPORTED_MODULE_9__[/* eventEmitter */ "f"].listenerCount(_constants_ui__WEBPACK_IMPORTED_MODULE_5__["ADDRESS_VALIDATION"]) > 0;
          _context11.next = 3;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'cardanoGetAddress'
          }, params, {
            useEventListener: useEventListener
          })));

        case 3:
          return _context11.abrupt("return", _context11.sent);

        case 4:
        case "end":
          return _context11.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "cardanoGetPublicKey", function _callee12(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'cardanoGetPublicKey'
          }, params)));

        case 2:
          return _context12.abrupt("return", _context12.sent);

        case 3:
        case "end":
          return _context12.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "cardanoSignTransaction", function _callee13(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'cardanoSignTransaction'
          }, params)));

        case 2:
          return _context13.abrupt("return", _context13.sent);

        case 3:
        case "end":
          return _context13.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "cipherKeyValue", function _callee14(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'cipherKeyValue'
          }, params)));

        case 2:
          return _context14.abrupt("return", _context14.sent);

        case 3:
        case "end":
          return _context14.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "composeTransaction", function _callee15(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'composeTransaction'
          }, params)));

        case 2:
          return _context15.abrupt("return", _context15.sent);

        case 3:
        case "end":
          return _context15.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "debugLinkDecision", function _callee16(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'debugLinkDecision'
          }, params)));

        case 2:
          return _context16.abrupt("return", _context16.sent);

        case 3:
        case "end":
          return _context16.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "debugLinkGetState", function _callee17(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'debugLinkGetState'
          }, params)));

        case 2:
          return _context17.abrupt("return", _context17.sent);

        case 3:
        case "end":
          return _context17.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "ethereumGetAddress", function _callee18(params) {
  var useEventListener;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee18$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          useEventListener = _env_node__WEBPACK_IMPORTED_MODULE_9__[/* eventEmitter */ "f"].listenerCount(_constants_ui__WEBPACK_IMPORTED_MODULE_5__["ADDRESS_VALIDATION"]) > 0;
          _context18.next = 3;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'ethereumGetAddress'
          }, params, {
            useEventListener: useEventListener
          })));

        case 3:
          return _context18.abrupt("return", _context18.sent);

        case 4:
        case "end":
          return _context18.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "ethereumGetPublicKey", function _callee19(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee19$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'ethereumGetPublicKey'
          }, params)));

        case 2:
          return _context19.abrupt("return", _context19.sent);

        case 3:
        case "end":
          return _context19.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "ethereumSignMessage", function _callee20(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee20$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'ethereumSignMessage'
          }, params)));

        case 2:
          return _context20.abrupt("return", _context20.sent);

        case 3:
        case "end":
          return _context20.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "ethereumSignTransaction", function _callee21(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee21$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'ethereumSignTransaction'
          }, params)));

        case 2:
          return _context21.abrupt("return", _context21.sent);

        case 3:
        case "end":
          return _context21.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "ethereumVerifyMessage", function _callee22(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee22$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          _context22.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'ethereumVerifyMessage'
          }, params)));

        case 2:
          return _context22.abrupt("return", _context22.sent);

        case 3:
        case "end":
          return _context22.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "getAccountInfo", function _callee23(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee23$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _context23.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'getAccountInfo'
          }, params)));

        case 2:
          return _context23.abrupt("return", _context23.sent);

        case 3:
        case "end":
          return _context23.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "getAddress", function _callee24(params) {
  var useEventListener;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee24$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          useEventListener = _env_node__WEBPACK_IMPORTED_MODULE_9__[/* eventEmitter */ "f"].listenerCount(_constants_ui__WEBPACK_IMPORTED_MODULE_5__["ADDRESS_VALIDATION"]) > 0;
          _context24.next = 3;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'getAddress'
          }, params, {
            useEventListener: useEventListener
          })));

        case 3:
          return _context24.abrupt("return", _context24.sent);

        case 4:
        case "end":
          return _context24.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "getDeviceState", function _callee25(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee25$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          _context25.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'getDeviceState'
          }, params)));

        case 2:
          return _context25.abrupt("return", _context25.sent);

        case 3:
        case "end":
          return _context25.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "getFeatures", function _callee26(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee26$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          _context26.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'getFeatures'
          }, params)));

        case 2:
          return _context26.abrupt("return", _context26.sent);

        case 3:
        case "end":
          return _context26.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "getPublicKey", function _callee27(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee27$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          _context27.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'getPublicKey'
          }, params)));

        case 2:
          return _context27.abrupt("return", _context27.sent);

        case 3:
        case "end":
          return _context27.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "liskGetAddress", function _callee28(params) {
  var useEventListener;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee28$(_context28) {
    while (1) {
      switch (_context28.prev = _context28.next) {
        case 0:
          useEventListener = _env_node__WEBPACK_IMPORTED_MODULE_9__[/* eventEmitter */ "f"].listenerCount(_constants_ui__WEBPACK_IMPORTED_MODULE_5__["ADDRESS_VALIDATION"]) > 0;
          _context28.next = 3;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'liskGetAddress'
          }, params, {
            useEventListener: useEventListener
          })));

        case 3:
          return _context28.abrupt("return", _context28.sent);

        case 4:
        case "end":
          return _context28.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "liskGetPublicKey", function _callee29(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee29$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          _context29.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'liskGetPublicKey'
          }, params)));

        case 2:
          return _context29.abrupt("return", _context29.sent);

        case 3:
        case "end":
          return _context29.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "liskSignMessage", function _callee30(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee30$(_context30) {
    while (1) {
      switch (_context30.prev = _context30.next) {
        case 0:
          _context30.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'liskSignMessage'
          }, params)));

        case 2:
          return _context30.abrupt("return", _context30.sent);

        case 3:
        case "end":
          return _context30.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "liskSignTransaction", function _callee31(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee31$(_context31) {
    while (1) {
      switch (_context31.prev = _context31.next) {
        case 0:
          _context31.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'liskSignTransaction'
          }, params)));

        case 2:
          return _context31.abrupt("return", _context31.sent);

        case 3:
        case "end":
          return _context31.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "liskVerifyMessage", function _callee32(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee32$(_context32) {
    while (1) {
      switch (_context32.prev = _context32.next) {
        case 0:
          _context32.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'liskVerifyMessage'
          }, params)));

        case 2:
          return _context32.abrupt("return", _context32.sent);

        case 3:
        case "end":
          return _context32.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "nemGetAddress", function _callee33(params) {
  var useEventListener;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee33$(_context33) {
    while (1) {
      switch (_context33.prev = _context33.next) {
        case 0:
          useEventListener = _env_node__WEBPACK_IMPORTED_MODULE_9__[/* eventEmitter */ "f"].listenerCount(_constants_ui__WEBPACK_IMPORTED_MODULE_5__["ADDRESS_VALIDATION"]) > 0;
          _context33.next = 3;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'nemGetAddress'
          }, params, {
            useEventListener: useEventListener
          })));

        case 3:
          return _context33.abrupt("return", _context33.sent);

        case 4:
        case "end":
          return _context33.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "nemSignTransaction", function _callee34(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee34$(_context34) {
    while (1) {
      switch (_context34.prev = _context34.next) {
        case 0:
          _context34.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'nemSignTransaction'
          }, params)));

        case 2:
          return _context34.abrupt("return", _context34.sent);

        case 3:
        case "end":
          return _context34.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "pushTransaction", function _callee35(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee35$(_context35) {
    while (1) {
      switch (_context35.prev = _context35.next) {
        case 0:
          _context35.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'pushTransaction'
          }, params)));

        case 2:
          return _context35.abrupt("return", _context35.sent);

        case 3:
        case "end":
          return _context35.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "rippleGetAddress", function _callee36(params) {
  var useEventListener;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee36$(_context36) {
    while (1) {
      switch (_context36.prev = _context36.next) {
        case 0:
          useEventListener = _env_node__WEBPACK_IMPORTED_MODULE_9__[/* eventEmitter */ "f"].listenerCount(_constants_ui__WEBPACK_IMPORTED_MODULE_5__["ADDRESS_VALIDATION"]) > 0;
          _context36.next = 3;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'rippleGetAddress'
          }, params, {
            useEventListener: useEventListener
          })));

        case 3:
          return _context36.abrupt("return", _context36.sent);

        case 4:
        case "end":
          return _context36.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "rippleSignTransaction", function _callee37(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee37$(_context37) {
    while (1) {
      switch (_context37.prev = _context37.next) {
        case 0:
          _context37.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'rippleSignTransaction'
          }, params)));

        case 2:
          return _context37.abrupt("return", _context37.sent);

        case 3:
        case "end":
          return _context37.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "signMessage", function _callee38(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee38$(_context38) {
    while (1) {
      switch (_context38.prev = _context38.next) {
        case 0:
          _context38.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'signMessage'
          }, params)));

        case 2:
          return _context38.abrupt("return", _context38.sent);

        case 3:
        case "end":
          return _context38.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "signTransaction", function _callee39(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee39$(_context39) {
    while (1) {
      switch (_context39.prev = _context39.next) {
        case 0:
          _context39.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'signTransaction'
          }, params)));

        case 2:
          return _context39.abrupt("return", _context39.sent);

        case 3:
        case "end":
          return _context39.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "stellarGetAddress", function _callee40(params) {
  var useEventListener;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee40$(_context40) {
    while (1) {
      switch (_context40.prev = _context40.next) {
        case 0:
          useEventListener = _env_node__WEBPACK_IMPORTED_MODULE_9__[/* eventEmitter */ "f"].listenerCount(_constants_ui__WEBPACK_IMPORTED_MODULE_5__["ADDRESS_VALIDATION"]) > 0;
          _context40.next = 3;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'stellarGetAddress'
          }, params, {
            useEventListener: useEventListener
          })));

        case 3:
          return _context40.abrupt("return", _context40.sent);

        case 4:
        case "end":
          return _context40.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "stellarSignTransaction", function _callee41(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee41$(_context41) {
    while (1) {
      switch (_context41.prev = _context41.next) {
        case 0:
          _context41.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'stellarSignTransaction'
          }, params)));

        case 2:
          return _context41.abrupt("return", _context41.sent);

        case 3:
        case "end":
          return _context41.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "tezosGetAddress", function _callee42(params) {
  var useEventListener;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee42$(_context42) {
    while (1) {
      switch (_context42.prev = _context42.next) {
        case 0:
          useEventListener = _env_node__WEBPACK_IMPORTED_MODULE_9__[/* eventEmitter */ "f"].listenerCount(_constants_ui__WEBPACK_IMPORTED_MODULE_5__["ADDRESS_VALIDATION"]) > 0;
          _context42.next = 3;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'tezosGetAddress'
          }, params, {
            useEventListener: useEventListener
          })));

        case 3:
          return _context42.abrupt("return", _context42.sent);

        case 4:
        case "end":
          return _context42.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "tezosGetPublicKey", function _callee43(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee43$(_context43) {
    while (1) {
      switch (_context43.prev = _context43.next) {
        case 0:
          _context43.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'tezosGetPublicKey'
          }, params)));

        case 2:
          return _context43.abrupt("return", _context43.sent);

        case 3:
        case "end":
          return _context43.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "tezosSignTransaction", function _callee44(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee44$(_context44) {
    while (1) {
      switch (_context44.prev = _context44.next) {
        case 0:
          _context44.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'tezosSignTransaction'
          }, params)));

        case 2:
          return _context44.abrupt("return", _context44.sent);

        case 3:
        case "end":
          return _context44.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "eosGetPublicKey", function _callee45(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee45$(_context45) {
    while (1) {
      switch (_context45.prev = _context45.next) {
        case 0:
          _context45.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'eosGetPublicKey'
          }, params)));

        case 2:
          return _context45.abrupt("return", _context45.sent);

        case 3:
        case "end":
          return _context45.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "eosSignTransaction", function _callee46(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee46$(_context46) {
    while (1) {
      switch (_context46.prev = _context46.next) {
        case 0:
          _context46.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'eosSignTransaction'
          }, params)));

        case 2:
          return _context46.abrupt("return", _context46.sent);

        case 3:
        case "end":
          return _context46.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "binanceGetAddress", function _callee47(params) {
  var useEventListener;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee47$(_context47) {
    while (1) {
      switch (_context47.prev = _context47.next) {
        case 0:
          useEventListener = _env_node__WEBPACK_IMPORTED_MODULE_9__[/* eventEmitter */ "f"].listenerCount(_constants_ui__WEBPACK_IMPORTED_MODULE_5__["ADDRESS_VALIDATION"]) > 0;
          _context47.next = 3;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'binanceGetAddress'
          }, params, {
            useEventListener: useEventListener
          })));

        case 3:
          return _context47.abrupt("return", _context47.sent);

        case 4:
        case "end":
          return _context47.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "binanceGetPublicKey", function _callee48(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee48$(_context48) {
    while (1) {
      switch (_context48.prev = _context48.next) {
        case 0:
          _context48.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'binanceGetPublicKey'
          }, params)));

        case 2:
          return _context48.abrupt("return", _context48.sent);

        case 3:
        case "end":
          return _context48.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "binanceSignTransaction", function _callee49(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee49$(_context49) {
    while (1) {
      switch (_context49.prev = _context49.next) {
        case 0:
          _context49.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'binanceSignTransaction'
          }, params)));

        case 2:
          return _context49.abrupt("return", _context49.sent);

        case 3:
        case "end":
          return _context49.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "vsysGetAddress", function _callee50(params) {
  var useEventListener;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee50$(_context50) {
    while (1) {
      switch (_context50.prev = _context50.next) {
        case 0:
          useEventListener = _env_node__WEBPACK_IMPORTED_MODULE_9__[/* eventEmitter */ "f"].listenerCount(_constants_ui__WEBPACK_IMPORTED_MODULE_5__["ADDRESS_VALIDATION"]) > 0;
          _context50.next = 3;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'vsysGetAddress'
          }, params, {
            useEventListener: useEventListener
          })));

        case 3:
          return _context50.abrupt("return", _context50.sent);

        case 4:
        case "end":
          return _context50.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "vsysGetPublicKey", function _callee51(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee51$(_context51) {
    while (1) {
      switch (_context51.prev = _context51.next) {
        case 0:
          _context51.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'vsysGetPublicKey'
          }, params)));

        case 2:
          return _context51.abrupt("return", _context51.sent);

        case 3:
        case "end":
          return _context51.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "vsysSignTx", function _callee52(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee52$(_context52) {
    while (1) {
      switch (_context52.prev = _context52.next) {
        case 0:
          _context52.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'vsysSignTx'
          }, params)));

        case 2:
          return _context52.abrupt("return", _context52.sent);

        case 3:
        case "end":
          return _context52.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "verifyMessage", function _callee53(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee53$(_context53) {
    while (1) {
      switch (_context53.prev = _context53.next) {
        case 0:
          _context53.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'verifyMessage'
          }, params)));

        case 2:
          return _context53.abrupt("return", _context53.sent);

        case 3:
        case "end":
          return _context53.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "wipeDevice", function _callee54(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee54$(_context54) {
    while (1) {
      switch (_context54.prev = _context54.next) {
        case 0:
          _context54.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'wipeDevice'
          }, params)));

        case 2:
          return _context54.abrupt("return", _context54.sent);

        case 3:
        case "end":
          return _context54.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "applyFlags", function _callee55(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee55$(_context55) {
    while (1) {
      switch (_context55.prev = _context55.next) {
        case 0:
          _context55.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'applyFlags'
          }, params)));

        case 2:
          return _context55.abrupt("return", _context55.sent);

        case 3:
        case "end":
          return _context55.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "applySettings", function _callee56(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee56$(_context56) {
    while (1) {
      switch (_context56.prev = _context56.next) {
        case 0:
          _context56.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'applySettings'
          }, params)));

        case 2:
          return _context56.abrupt("return", _context56.sent);

        case 3:
        case "end":
          return _context56.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "backupDevice", function _callee57() {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee57$(_context57) {
    while (1) {
      switch (_context57.prev = _context57.next) {
        case 0:
          _context57.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])({
            method: 'backupDevice'
          }));

        case 2:
          return _context57.abrupt("return", _context57.sent);

        case 3:
        case "end":
          return _context57.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "changePin", function _callee58(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee58$(_context58) {
    while (1) {
      switch (_context58.prev = _context58.next) {
        case 0:
          _context58.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'changePin'
          }, params)));

        case 2:
          return _context58.abrupt("return", _context58.sent);

        case 3:
        case "end":
          return _context58.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "firmwareUpdate", function _callee59(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee59$(_context59) {
    while (1) {
      switch (_context59.prev = _context59.next) {
        case 0:
          _context59.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'firmwareUpdate'
          }, params)));

        case 2:
          return _context59.abrupt("return", _context59.sent);

        case 3:
        case "end":
          return _context59.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "recoveryDevice", function _callee60(params) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee60$(_context60) {
    while (1) {
      switch (_context60.prev = _context60.next) {
        case 0:
          _context60.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* call */ "a"])(_objectSpread({
            method: 'recoveryDevice'
          }, params)));

        case 2:
          return _context60.abrupt("return", _context60.sent);

        case 3:
        case "end":
          return _context60.stop();
      }
    }
  });
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "dispose", function () {
  Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* dispose */ "e"])();
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "cancel", function (error) {
  Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* cancel */ "b"])(error);
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "renderWebUSBButton", function (className) {
  Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* renderWebUSBButton */ "j"])(className);
});

_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(TrezorConnect, "disableWebUSB", function _callee61() {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function _callee61$(_context61) {
    while (1) {
      switch (_context61.prev = _context61.next) {
        case 0:
          Object(_env_node__WEBPACK_IMPORTED_MODULE_9__[/* disableWebUSB */ "d"])();

        case 1:
        case "end":
          return _context61.stop();
      }
    }
  });
});

/* harmony default export */ __webpack_exports__["default"] = (TrezorConnect);




/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),
/* 23 */
/***/ (function(module, exports) {



/***/ }),
/* 24 */
/***/ (function(module, exports) {



/***/ }),
/* 25 */
/***/ (function(module, exports) {



/***/ }),
/* 26 */
/***/ (function(module, exports) {



/***/ }),
/* 27 */
/***/ (function(module, exports) {



/***/ }),
/* 28 */
/***/ (function(module, exports) {



/***/ }),
/* 29 */
/***/ (function(module, exports) {



/***/ }),
/* 30 */
/***/ (function(module, exports) {



/***/ }),
/* 31 */
/***/ (function(module, exports) {



/***/ }),
/* 32 */
/***/ (function(module, exports) {



/***/ }),
/* 33 */
/***/ (function(module, exports) {



/***/ }),
/* 34 */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;

/***/ }),
/* 35 */
/***/ (function(module, exports) {

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

module.exports = _isNativeFunction;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(16);

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    module.exports = _construct = Reflect.construct;
  } else {
    module.exports = _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

module.exports = _construct;

/***/ }),
/* 37 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ])["default"];
});