/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var pkg = __webpack_require__(/*! ./../../package.json */ "./node_modules/axios/package.json");

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./src/js/modules/ak.js":
/*!******************************!*\
  !*** ./src/js/modules/ak.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// добавляет элементы при клике на кнопку еще
const ak = () => {
  // Получаем кнопку "Еще..."
  const moreButton = document.querySelector('.idk');

  // Функция, которая добавляет элемент в список
  function addNewItem() {
    // Получаем контейнер, в который будем добавлять новые элементы
    const gridContainer = document.querySelector('.grid-container');

    // Создаем новый элемент div и добавляем ему класс grid-item
    const newItem = document.createElement('div');
    newItem.classList.add('grid-item');

    // Заполняем содержимое нового элемента HTML-кодом
    newItem.innerHTML = `
            <div class="img-container">
                <img class="gridimg" src="./assets/img/runtest2.jpeg" alt="" data-alt-src="./assets/img/runsho.jpeg">
            </div>
            <div class="gridtxt">Кроссовки Nike Air Max</div>
            <div class="price">1000 руб.</div>
            <button class="add-to-cart-button">Добавить в корзину</button>
        `;

    // Добавляем новый элемент в контейнер
    gridContainer.appendChild(newItem);

    // Повторяем те же шаги для создания и добавления еще трех элементов
    const newItem2 = document.createElement('div');
    newItem2.classList.add('grid-item');
    newItem2.innerHTML = `
            <div class="img-container">
                <img class="gridimg" src="./assets/img/runtest2.jpeg" alt="" data-alt-src="./assets/img/runsho.jpeg">
            </div>
            <div class="gridtxt">Кроссовки Nike Air Max</div>
            <div class="price">1000 руб.</div>
            <button class="add-to-cart-button">Добавить в корзину</button>
        `;
    gridContainer.appendChild(newItem2);

    // Повторяем те же шаги для создания и добавления еще трех элементов
    const newItem3 = document.createElement('div');
    newItem3.classList.add('grid-item');
    newItem3.innerHTML = `
            <div class="img-container">
                <img class="gridimg" src="./assets/img/runtest2.jpeg" alt="" data-alt-src="./assets/img/runsho.jpeg">
            </div>
            <div class="gridtxt">Кроссовки Nike Air Max</div>
            <div class="price">1000 руб.</div>
            <button class="add-to-cart-button">Добавить в корзину</button>
        `;
    gridContainer.appendChild(newItem3);

    // Повторяем те же шаги для создания и добавления еще трех элементов
    const newItem4 = document.createElement('div');
    newItem4.classList.add('grid-item');
    newItem4.innerHTML = `
            <div class="img-container">
                <img class="gridimg" src="./assets/img/runtest2.jpeg" alt="" data-alt-src="./assets/img/runsho.jpeg">
            </div>
            <div class="gridtxt">Кроссовки Nike Air Max</div>
            <div class="price">1000 руб.</div>
            <button class="add-to-cart-button">Добавить в корзину</button>
        `;
    gridContainer.appendChild(newItem4);
  }

  // Обработчик события клика на кнопку "Еще..."
  moreButton.addEventListener('click', addNewItem);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ak);

/***/ }),

/***/ "./src/js/modules/auth.js":
/*!********************************!*\
  !*** ./src/js/modules/auth.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

//Этот код реализует аутентификацию пользователя через форму ввода email и пароля:

const auth2 = () => {
  const loginForm = document.getElementById('hh');
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

    // Получаем значения полей формы
    const email = document.getElementById('email3').value;
    const password = document.getElementById('password3').value;

    // Вызываем функцию auth с полученными данными
    auth(email, password);
  });

  // Функция auth принимает email и password пользователя и отправляет запрос на сервер для аутентификации
  const auth = (email, password) => {
    axios__WEBPACK_IMPORTED_MODULE_0___default().post('https://better-success-f3e3e81dd8.strapiapp.com/api/auth/local', {
      identifier: email,
      password: password
    }).then(response => {
      // Если аутентификация прошла успешно, сохраняем полученный JWT токен в локальном хранилище
      const jwt = response.data.jwt;
      window.localStorage.setItem('jwt', jwt);

      // Получаем ID пользователя из ответа сервера
      const userId = response.data.user.id;

      // Проверяем или создаем корзину для пользователя
      checkOrCreateCart(userId, jwt);

      // Обновляем данные пользователя
      refreshUser(jwt);
    }).catch(error => {
      // Обрабатываем ошибку аутентификации
      console.error('An error occurred during authentication:', error);
    });
  };

  // Функция checkOrCreateCart проверяет существует ли корзина для пользователя, и если нет - создает новую
  const checkOrCreateCart = (userId, jwt) => {
    axios__WEBPACK_IMPORTED_MODULE_0___default().get('https://better-success-f3e3e81dd8.strapiapp.com/api/carts', {
      params: {
        'user.id': userId
      },
      headers: {
        'Authorization': 'Bearer ' + jwt
      }
    }).then(response => {
      // Если корзина не существует, создаем новую
      if (response.data.length === 0) {
        createCartForUser(userId, jwt);
      } else {
        console.log('Cart already exists for user:', response.data);
      }
    }).catch(error => {
      console.log(error);
    });
  };

  // Функция createCartForUser создает новую корзину для пользователя
  const createCartForUser = (userId, jwt) => {
    axios__WEBPACK_IMPORTED_MODULE_0___default().post('https://better-success-f3e3e81dd8.strapiapp.com/api/carts', {
      data: {
        user: userId
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt
      }
    }).then(response => {
      console.log('Cart created:', response.data);
    }).catch(error => {
      console.log(error);
    });
  };

  // Функция refreshUser обновляет данные пользователя после успешной аутентификации
  const refreshUser = jwt => {
    axios__WEBPACK_IMPORTED_MODULE_0___default().get('https://better-success-f3e3e81dd8.strapiapp.com/api/users/me?populate=*', {
      headers: {
        Authorization: 'Bearer ' + jwt
      }
    }).then(response => {
      // Получаем данные пользователя из ответа сервера и сохраняем их в локальном хранилище
      const userData = response.data;
      window.localStorage.setItem('userData', JSON.stringify(userData));

      // Перенаправляем пользователя на главную страницу
      window.location.href = '/';
    }).catch(error => {
      console.error('An error occurred during authentication:', error);
    });
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (auth2);

/***/ }),

/***/ "./src/js/modules/baza.js":
/*!********************************!*\
  !*** ./src/js/modules/baza.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Jet: () => (/* binding */ Jet),
/* harmony export */   hiol: () => (/* binding */ hiol)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);


// Этот код реализует функциональность для отображения товаров на веб-странице, их визуального представления в виде карточек, а также модального окна с подробной информацией о товаре. 
// Функция Jet принимает аргумент gender (пол) со значением "all" по умолчанию и отображает товары на веб-странице в зависимости от пола.
const Jet = (gender = 'all') => {
  const all = document.querySelectorAll('.grid-item'); // Получение всех элементов с классом 'grid-item'

  // Функция getProducts отправляет GET-запрос на сервер, получает данные о товарах и обновляет их отображение на странице
  function getProducts() {
    const url = 'https://better-success-f3e3e81dd8.strapiapp.com/api/products?populate=*'; // URL-адрес для запроса данных о товарах
    axios__WEBPACK_IMPORTED_MODULE_0___default().get(url) // Выполнение GET-запроса с использованием axios
    .then(response => {
      // Обработка успешного ответа от сервера
      const rens = response.data.data.filter(item => {
        // Фильтрация данных о товарах в зависимости от пола
        const sex = item.attributes.male; // Пол товара
        return gender === 'all' || sex === gender; // Условие для фильтрации по полу
      });

      // Обновление отображения каждого товара на странице
      all.forEach((item, index) => {
        if (index < rens.length) {
          // Проверка наличия данных о товаре
          // Получение необходимых данных о товаре
          const textElement = item.querySelector('.gridtxt');
          const imgElement = item.querySelector('.gridimg');
          const priceElement = item.querySelector('.price');
          const imageURL = rens[index].attributes.preview.data.attributes.url;
          const description = rens[index].attributes.description;
          const price = rens[index].attributes.price;
          const name = rens[index].attributes.name;
          const id = rens[index].id;
          const imageURL2 = rens[index].attributes.carusel.data[1].attributes.url;
          const imageURL3 = rens[index].attributes.carusel.data[2].attributes.url;
          const sex = rens[index].attributes.male;
          const fullImageURL2 = `https://better-success-f3e3e81dd8.strapiapp.com${imageURL2}`;
          const fullImageURL3 = `https://better-success-f3e3e81dd8.strapiapp.com${imageURL3}`;
          const fullImageURL = `https://better-success-f3e3e81dd8.strapiapp.com${imageURL}`;

          // Обновление содержимого элементов для отображения данных о товаре
          imgElement.src = fullImageURL;
          textElement.textContent = name;
          priceElement.textContent = `${price} руб.`;
          imgElement.setAttribute('data-name', name);
          imgElement.setAttribute('data-alt-src', fullImageURL2);
          imgElement.setAttribute('data-alt-src3', fullImageURL3);
          imgElement.setAttribute('data-alt-src4', description);
        }
      });
      grid(); // Вызов функции для обновления отображения товаров
    }).catch(error => {
      // Обработка ошибок при выполнении запроса
      console.error('There was a problem with your axios request:', error);
    });
  }
  getProducts(); // Вызов функции для получения и отображения товаров
};

// Функция grid обрабатывает события mouseenter и mouseleave для анимации изображений товаров
const grid = () => {
  const gridItems = document.querySelectorAll('.grid-item'); // Получение всех элементов с классом 'grid-item'

  // Обработка событий для каждого элемента
  gridItems.forEach(item => {
    const img = item.querySelector('.gridimg'); // Получение изображения товара
    const originalSrc = img.src; // Исходный URL изображения
    let intervalId;
    const altSrc = img.getAttribute('data-alt-src'); // Альтернативный URL изображения
    const altSrc3 = img.getAttribute('data-alt-src3'); // Второй альтернативный URL изображения

    // Обработка события при наведении курсора на элемент
    item.addEventListener('mouseenter', () => {
      clearInterval(intervalId);
      let toggle = false;
      intervalId = setInterval(() => {
        img.classList.add('hidden');
        setTimeout(() => {
          img.src = toggle ? altSrc3 : altSrc; // Переключение между альтернативными изображениями
          toggle = !toggle;
          img.classList.remove('hidden');
        }, 400);
      }, 1500);
    });

    // Обработка события при уводе курсора с элемента
    item.addEventListener('mouseleave', () => {
      clearInterval(intervalId);
      img.classList.add('hidden');
      setTimeout(() => {
        img.src = originalSrc; // Восстановление исходного изображения
        img.classList.remove('hidden');
      }, 400);
    });
  });
};

// Функция hiol обрабатывает события открытия и закрытия модального окна с информацией о товаре
const hiol = () => {
  const openButtons = document.querySelectorAll('.grid-item'); // Получение всех элементов с классом 'grid-item' для открытия модального окна
  const closeButton = document.querySelector('.close-product-modal'); // Получение кнопки закрытия модального окна
  const productModal = document.querySelector('.product-modal'); // Получение модального окна
  const addToCartButton = document.querySelector('.add-to-cart-button2'); // Получение кнопки "Добавить в корзину"

  // Обработка события клика для каждой кнопки открытия модального окна
  openButtons.forEach(button => {
    button.addEventListener('click', () => {
      const img = button.querySelector('.gridimg');
      const productTitle = button.querySelector('.gridtxt').textContent;
      const productPrice = button.querySelector('.price').textContent;
      const productDescription = img.getAttribute('data-alt-src4');
      const productImage = img.src;
      const productName = img.getAttribute('data-name'); // Получение имени товара

      // Заполнение модального окна данными о товаре
      const modalImage = document.querySelector('.product-image-slider img');
      const modalTitle = document.querySelector('.product-title');
      const modalDescription = document.querySelector('.product-description-slider div');
      const modalPrice = document.querySelector('.product-price');
      if (modalImage && modalTitle && modalDescription && modalPrice) {
        modalImage.src = productImage;
        modalTitle.textContent = productTitle;
        modalDescription.textContent = productDescription;
        modalPrice.textContent = productPrice;
        addToCartButton.setAttribute('data-name', productName); // Установка имени товара для кнопки "Добавить в корзину"
      } else {
        console.error('One or more modal elements are not found'); // Вывод сообщения об ошибке, если один или несколько элементов модального окна не найдены
      }

      // Отображение модального окна
      if (productModal) {
        productModal.style.display = 'flex';
      } else {
        console.error('Product modal element is not found'); // Вывод сообщения об ошибке, если модальное окно не найдено
      }
    });
  });

  // Обработка события клика по кнопке закрытия модального окна
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      if (productModal) {
        productModal.style.display = 'none'; // Скрытие модального окна
      } else {
        console.error('Product modal element is not found'); // Вывод сообщения об ошибке, если модальное окно не найдено
      }
    });
  } else {
    console.error('Close button element is not found'); // Вывод сообщения об ошибке, если кнопка закрытия модального окна не найдена
  }
};
 // Экспорт функций Jet и hiol для использования в других файлах

/***/ }),

/***/ "./src/js/modules/cart.js":
/*!********************************!*\
  !*** ./src/js/modules/cart.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

const alt = () => {
  const addToCartButton = document.querySelector('.add-to-cart-button2');
  const closeModalButton = document.querySelector('.close-product-modal');
  const productModal = document.querySelector('.product-modal');
  const sizeElements = document.querySelectorAll('.product-sizes .size');
  const cartModal = document.getElementById('cartModal');
  const but = document.getElementById('openModalBtn2');
  const closeCartModalButton = document.querySelector('.close-cart-modal');
  const cartItemsContainer = document.querySelector('.cart-items-container');
  const totalPriceElement = document.querySelector('.total-price');
  const placeOrderButton = document.querySelector('.checkout');
  if (!addToCartButton || !closeModalButton || !productModal || !cartModal || !but || !closeCartModalButton || !cartItemsContainer || !totalPriceElement || !placeOrderButton) {
    console.error('One or more required elements not found');
    return;
  }
  let selectedSize = null;
  let jwtToken = localStorage.getItem('jwt');
  let userData = JSON.parse(localStorage.getItem('userData'));
  if (!jwtToken || !userData || !userData.cart || !userData.cart.id) {
    console.error('User data or JWT token not found');
    return;
  }
  sizeElements.forEach(sizeElement => {
    sizeElement.addEventListener('click', () => {
      sizeElements.forEach(el => el.classList.remove('selected'));
      sizeElement.classList.add('selected');
      selectedSize = sizeElement.textContent;
    });
  });
  closeModalButton.addEventListener('click', () => {
    productModal.style.display = 'none';
  });
  addToCartButton.addEventListener('click', () => {
    if (!selectedSize) {
      alert('Пожалуйста, выберите размер');
      return;
    }
    const productName = addToCartButton.getAttribute('data-name');
    if (!productName) {
      alert('Не удалось определить товар');
      return;
    }
    getCartData(userData.cart.id, jwtToken).then(cartData => {
      addProductToProds(userData.cart.id, jwtToken, productName);
    }).catch(error => {
      console.error('Error fetching cart data:', error);
    });
  });
  closeCartModalButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });
  placeOrderButton.addEventListener('click', () => {
    createOrder(userData.cart.id, jwtToken);
  });
  const getCartData = (cartId, token) => {
    return axios__WEBPACK_IMPORTED_MODULE_0___default().get(`https://better-success-f3e3e81dd8.strapiapp.com/api/carts/${cartId}?populate=*`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(response => {
      return response.data.data;
    });
  };
  const addProductToProds = (cartId, token, productName) => {
    let data = {
      name: productName,
      size: selectedSize,
      count: 1
    };
    axios__WEBPACK_IMPORTED_MODULE_0___default().post('https://better-success-f3e3e81dd8.strapiapp.com/api/prods', {
      data
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(response => {
      let prodId = response.data.data.id;
      axios__WEBPACK_IMPORTED_MODULE_0___default().put(`https://better-success-f3e3e81dd8.strapiapp.com/api/carts/${cartId}`, {
        data: {
          prods: {
            connect: [{
              id: prodId
            }]
          }
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      }).then(response => {
        alert('Товар добавлен в корзину');
        productModal.style.display = 'none';
        displayCartItems();
      }).catch(error => {
        console.error('Error updating cart with prod:', error);
      });
    }).catch(error => {
      console.error('Error adding product to prods:', error);
    });
  };
  const createOrder = (cartId, token) => {
    getCartData(cartId, token).then(cartData => {
      if (cartData && cartData.attributes && cartData.attributes.prods) {
        const prodsData = cartData.attributes.prods.data || [];
        let orderData = {
          prods: {
            connect: prodsData.map(prod => ({
              id: prod.id
            }))
          }
        };
        const productNames = prodsData.map(prod => prod.attributes.name).join(', ');
        orderData.name = productNames;
        axios__WEBPACK_IMPORTED_MODULE_0___default().post('https://better-success-f3e3e81dd8.strapiapp.com/api/orders', {
          data: orderData
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        }).then(response => {
          const orderId = response.data.data.id;
          addOrderToCart(cartId, token, orderId).then(() => {
            clearCart(cartId, token);
            alert('Заказ успешно оформлен');
          }).catch(error => {
            console.error('Error adding order to cart:', error);
          });
        }).catch(error => {
          console.error('Error creating order:', error);
        });
      } else {
        console.error('No products found in cart');
      }
    }).catch(error => {
      console.error('Error fetching cart data:', error);
    });
  };
  const addOrderToCart = (cartId, token, orderId) => {
    return axios__WEBPACK_IMPORTED_MODULE_0___default().put(`https://better-success-f3e3e81dd8.strapiapp.com/api/carts/${cartId}`, {
      data: {
        orders: {
          connect: [{
            id: orderId
          }]
        }
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  };
  const clearCart = (cartId, token) => {
    console.log('Clearing cart...');
    return new Promise((resolve, reject) => {
      getCartData(cartId, token).then(cartData => {
        if (cartData && cartData.attributes && cartData.attributes.prods) {
          const prodIds = cartData.attributes.prods.data.map(prod => prod.id);
          const disconnectProdsPromises = prodIds.map(prodId => {
            return axios__WEBPACK_IMPORTED_MODULE_0___default()["delete"](`https://better-success-f3e3e81dd8.strapiapp.com/api/prods/${prodId}`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              }
            });
          });
          Promise.all(disconnectProdsPromises).then(() => {
            displayCartItems();
            resolve();
          }).catch(error => {
            reject(error);
          });
        } else {
          console.error('No products found in cart');
          reject(new Error('No products found in cart'));
        }
      }).catch(error => {
        console.error('Error fetching cart data:', error);
        reject(error);
      });
    });
  };
  const displayCartItems = () => {
    cartItemsContainer.innerHTML = '';
    getCartData(userData.cart.id, jwtToken).then(cartData => {
      if (cartData && cartData.attributes && cartData.attributes.prods) {
        const prodsData = cartData.attributes.prods.data || [];
        let totalPrice = 0;
        const uniqueProductNames = new Set();
        const productPromises = prodsData.map(item => {
          if (item && item.attributes) {
            const productAttributes = item.attributes;
            if (uniqueProductNames.has(productAttributes.name)) {
              return Promise.resolve(null);
            }
            uniqueProductNames.add(productAttributes.name);
            return axios__WEBPACK_IMPORTED_MODULE_0___default().get(`https://better-success-f3e3e81dd8.strapiapp.com/api/products?populate=*`).then(response => {
              const products = response.data.data;
              const product = products.find(product => product.attributes.name === productAttributes.name);
              if (product) {
                const imageURL = product.attributes.preview.data.attributes.url;
                const fullImageURL = `https://better-success-f3e3e81dd8.strapiapp.com${imageURL}`;
                const price = parseFloat(product.attributes.price); // Преобразование строки в число
                totalPrice += price;
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                                            <img src="${fullImageURL || 'https://via.placeholder.com/100'}" alt="${productAttributes.name || 'Product Image'}" class="product-image">
                                            <div class="product-details">
                                                <h3 class="product-name">${productAttributes.name || 'Название товара'}</h3>
                                                <p class="product-size">Размер: ${productAttributes.size || 'N/A'}</p>
                                                <p class="product-price">Цена: ${price || 'N/A'}₽</p>
                                            </div>
                                        `;
                cartItemsContainer.appendChild(itemElement);
                return productAttributes.name;
              } else {
                console.error('Product not found:', productAttributes.name);
              }
            }).catch(error => {
              console.error('Error fetching product details:', error);
            });
          } else {
            console.error('Invalid product data:', item);
          }
        });
        Promise.all(productPromises).then(() => {
          totalPriceElement.textContent = `Примерная цена: ${totalPrice}₽`;
        });
        but.addEventListener('click', () => {
          cartModal.style.display = 'block';
        });
      } else {
        console.error('No product data found in cart:', cartData);
      }
    }).catch(error => {
      console.error('Error fetching cart items:', error);
    });
  };
  if (cartModal.style.display !== 'block') {
    displayCartItems();
  }
  document.addEventListener('DOMContentLoaded', () => {
    getCartData(userData.cart.id, jwtToken).then(cartData => {
      console.log('Cart data fetched successfully');
      displayCartItems();
    }).catch(error => {
      console.error('Error fetching current cart data:', error);
    });
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (alt);

/***/ }),

/***/ "./src/js/modules/clear.js":
/*!*********************************!*\
  !*** ./src/js/modules/clear.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
 // Импорт библиотеки axios для работы с HTTP-запросами

const accountModal = () => {
  // Объявление функции accountModal
  const accountModal = document.getElementById('accountInfoModal'); // Получение модального окна аккаунта
  const closeAccountModalButton = document.querySelector('.close-account-modal'); // Получение кнопки закрытия модального окна аккаунта
  const logoutButton = document.getElementById('logoutButton'); // Получение кнопки выхода из аккаунта
  const accountEmail = document.getElementById('account-email'); // Получение элемента с почтовым адресом аккаунта
  const accountUsername = document.getElementById('account-username'); // Получение элемента с именем пользователя аккаунта
  const accountButton = document.getElementById('openAccountInfoModal'); // Получение кнопки для открытия модального окна

  let jwtToken = localStorage.getItem('jwt'); // Получение JWT-токена из локального хранилища
  let userData = JSON.parse(localStorage.getItem('userData')); // Получение данных пользователя из локального хранилища и преобразование из JSON в объект

  // Проверка наличия JWT-токена и данных пользователя в локальном хранилище
  if (jwtToken && userData) {
    accountEmail.textContent = `Email: ${userData.email}`; // Установка текста для элемента с почтовым адресом аккаунта
    accountUsername.textContent = `Username: ${userData.username}`; // Установка текста для элемента с именем пользователя аккаунта
  }

  // Добавление слушателя события клика для кнопки открытия модального окна аккаунта
  accountButton.addEventListener('click', () => {
    accountModal.style.display = 'block'; // Отображение модального окна аккаунта
  });

  // Добавление слушателя события клика для кнопки закрытия модального окна аккаунта
  closeAccountModalButton.addEventListener('click', () => {
    accountModal.style.display = 'none'; // Скрытие модального окна аккаунта
  });

  // Добавление слушателя события клика на весь экран для закрытия модального окна аккаунта при клике за его пределами
  window.addEventListener('click', event => {
    if (event.target == accountModal) {
      accountModal.style.display = 'none'; // Скрытие модального окна аккаунта при клике за его пределами
    }
  });

  // Добавление слушателя события клика для кнопки выхода из аккаунта
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('jwt'); // Удаление JWT-токена из локального хранилища
    localStorage.removeItem('userData'); // Удаление данных пользователя из локального хранилища
    setTimeout(() => {
      window.location.reload(); // Перезагрузка страницы
    }, 50);
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (accountModal); // Экспорт функции accountModal

/***/ }),

/***/ "./src/js/modules/history.js":
/*!***********************************!*\
  !*** ./src/js/modules/history.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const history = () => {
  const accountInfoModal = document.getElementById('accountInfoModal'); // Получение модального окна аккаунта
  const closeAccountModalButton = document.querySelector('.close-account-modal'); // Получение кнопки закрытия модального окна аккаунта
  const accountEmailElement = document.getElementById('account-email'); // Получение элемента с адресом электронной почты аккаунта
  const accountUsernameElement = document.getElementById('account-username'); // Получение элемента с именем пользователя аккаунта
  const ordersContainer = document.getElementById('orders-container'); // Получение контейнера для заказов
  const logoutButton = document.getElementById('logoutButton'); // Получение кнопки выхода из аккаунта
  const openAccountModalButton = document.getElementById('openAccountInfoModal'); // Получение кнопки открытия модального окна аккаунта

  let jwtToken = localStorage.getItem('jwt'); // Получение JWT-токена из локального хранилища
  let userData = JSON.parse(localStorage.getItem('userData')); // Получение данных пользователя из локального хранилища и преобразование их из JSON в объект

  // Проверка наличия JWT-токена и данных пользователя в локальном хранилище
  if (!jwtToken || !userData || !userData.cart || !userData.cart.id) {
    console.error('User data or JWT token not found'); // Вывод сообщения об ошибке в консоль, если данные пользователя или JWT-токен не найдены
    return; // Выход из функции
  }

  // Функция для отображения информации о заказе в модальном окне
  const displayOrderInfo = orders => {
    ordersContainer.innerHTML = ''; // Очищаем контейнер перед добавлением заказов

    orders.forEach(order => {
      const orderElement = document.createElement('div'); // Создание нового элемента заказа
      orderElement.classList.add('order-item'); // Добавление класса для стилизации элемента заказа

      orderElement.innerHTML = `
                <h3>Заказ №${order.id}</h3>
                <p>Продукты:</p>
                <ul>
                    <li>${order.attributes.name}</li>
                </ul>
            `; // Заполнение HTML-содержимым элемента заказа

      ordersContainer.appendChild(orderElement); // Добавление элемента заказа в контейнер
    });
  };

  // Обработчик клика по кнопке для закрытия модального окна аккаунта
  closeAccountModalButton.addEventListener('click', () => {
    accountInfoModal.style.display = 'none'; // Скрытие модального окна аккаунта
  });

  // Обработчик клика по кнопке "Выйти"
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('jwt'); // Удаление JWT-токена из локального хранилища
    localStorage.removeItem('userData'); // Удаление данных пользователя из локального хранилища
    window.location.reload(); // Перезагрузка страницы после выхода
  });

  // Функция для получения информации о заказах
  const getOrderInfo = () => {
    const userId = userData.id; // Получение идентификатора пользователя
    const productRequests = []; // Массив для запросов на получение информации о продуктах в заказах пользователя

    axios.get(`https://better-success-f3e3e81dd8.strapiapp.com/api/orders?userId=${userId}&populate=prods`, {
      // Выполнение GET-запроса для получения информации о заказах пользователя
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}` // Установка заголовка авторизации с JWT-токеном
      }
    }).then(response => {
      const orders = response.data.data; // Получение данных о заказах

      // Обработка полученных данных о заказах
      orders.forEach(order => {
        order.attributes.prods.data.forEach(prod => {
          productRequests.push(axios.get(`https://better-success-f3e3e81dd8.strapiapp.com/api/products/${prod.id}`, {
            // Добавление запросов на получение информации о продуктах в заказах
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}` // Установка заголовка авторизации с JWT-токеном
            }
          }));
        });
      });

      // Выполнение всех запросов на получение информации о продуктах
      Promise.all(productRequests).then(responses => {
        responses.forEach((response, index) => {
          const product = response.data.data; // Получение данных о продукте из ответа сервера

          // Обновление данных о продуктах в заказах
          orders.forEach(order => {
            order.attributes.prods.data.forEach(prod => {
              if (prod.id === product.id) {
                prod.attributes.name = product.attributes.name; // Обновление имени продукта в заказе
              }
            });
          });
        });

        // Отображение информации о заказах после обновления данных о продуктах
        displayOrderInfo(orders);
      }).catch(error => {
        console.error('Error fetching product data:', error.response ? error.response.data : error.message); // Вывод сообщения об ошибке в консоль при ошибке получения данных о продуктах
      });
    }).catch(error => {
      console.error('Error fetching order data:', error.response ? error.response.data : error.message); // Вывод сообщения об ошибке в консоль при ошибке получения данных о заказах
    });
  };

  // Обработчик для открытия модального окна и получения информации о заказах
  openAccountModalButton.addEventListener('click', () => {
    accountEmailElement.textContent = `Email: ${userData.email}`; // Установка текста для элемента с адресом электронной почты аккаунта
    accountUsernameElement.textContent = `Phone: ${userData.username}`; // Установка текста для элемента с именем пользователя аккаунта
    accountInfoModal.style.display = 'block'; // Отображение модального окна аккаунта
    getOrderInfo(); // Получение информации о заказах
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (history); // Экспорт функции history

/***/ }),

/***/ "./src/js/modules/login.js":
/*!*********************************!*\
  !*** ./src/js/modules/login.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
 // Импорт библиотеки axios для работы с HTTP-запросами

const addUser = () => {
  const registerForm = document.getElementById('ff'); // Получение формы регистрации

  // Добавление слушателя события отправки формы
  registerForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Предотвращение стандартного поведения отправки формы

    // Получение значений полей формы
    const username2 = document.getElementById('phone5').value;
    const email2 = document.getElementById('emailul5').value;
    const password2 = document.getElementById('password5').value;

    // Отправка POST-запроса для регистрации пользователя
    axios__WEBPACK_IMPORTED_MODULE_0___default().post('https://better-success-f3e3e81dd8.strapiapp.com/api/auth/local/register', {
      // URL для регистрации пользователя
      username: username2,
      // Параметр с именем пользователя
      email: email2,
      // Параметр с адресом электронной почты пользователя
      password: password2 // Параметр с паролем пользователя
    }).then(response => {
      const jwt = response.data.jwt; // Получение JWT-токена из ответа сервера
      const userId = response.data.user.id; // Получение идентификатора пользователя из ответа сервера

      // Сохранение JWT-токена в локальном хранилище браузера
      window.localStorage.setItem('jwt', jwt);

      // Проверка или создание корзины для пользователя
      checkOrCreateCart(userId, jwt);

      // Закрытие модального окна после успешной регистрации
      const modal = document.getElementById('myModal2');
      modal.style.display = 'none';
    }).catch(error => {
      console.log(error); // Вывод ошибки в консоль в случае возникновения ошибки при регистрации пользователя
    });
  });
};

// Функция для проверки существующей корзины пользователя или создания новой
const checkOrCreateCart = (userId, jwt) => {
  axios__WEBPACK_IMPORTED_MODULE_0___default().get('https://better-success-f3e3e81dd8.strapiapp.com/api/carts', {
    // GET-запрос для получения корзины пользователя
    params: {
      'filters[user][id][$eq]': userId // Параметр запроса для указания идентификатора пользователя
    },
    headers: {
      'Authorization': 'Bearer ' + jwt // Установка заголовка авторизации с JWT-токеном
    }
  }).then(response => {
    // Если корзина не существует, создаем новую
    if (response.data.data.length === 0) {
      createCartForUser(userId, jwt); // Создание новой корзины для пользователя
    } else {
      console.log('Cart already exists for user:', response.data.data); // Вывод сообщения о существующей корзине пользователя
    }
  }).catch(error => {
    console.log(error); // Вывод ошибки в консоль в случае возникновения ошибки при получении корзины пользователя
  });
};

// Функция для создания новой корзины для пользователя
const createCartForUser = (userId, jwt) => {
  axios__WEBPACK_IMPORTED_MODULE_0___default().post('https://better-success-f3e3e81dd8.strapiapp.com/api/carts', {
    // POST-запрос для создания новой корзины пользователя
    data: {
      user: userId // Параметр запроса для указания идентификатора пользователя
    }
  }, {
    headers: {
      'Content-Type': 'application/json',
      // Установка заголовка Content-Type
      'Authorization': 'Bearer ' + jwt // Установка заголовка авторизации с JWT-токеном
    }
  }).then(response => {
    console.log('Cart created:', response.data); // Вывод сообщения о созданной корзине для пользователя
  }).catch(error => {
    console.log(error); // Вывод ошибки в консоль в случае возникновения ошибки при создании корзины для пользователя
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addUser); // Экспорт функции addUser

/***/ }),

/***/ "./src/js/modules/mod2.js":
/*!********************************!*\
  !*** ./src/js/modules/mod2.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const load = () => {
  // Объявление функции load
  document.addEventListener('DOMContentLoaded', () => {
    // Добавление слушателя события DOMContentLoaded
    const cartModal = document.getElementById('cartModal'); // Получение модального окна корзины
    const openCartButtons = document.querySelectorAll('.open-cart-modal'); // Получение кнопок для открытия модального окна корзины
    const closeCartModal = document.querySelector('.close-cart-modal'); // Получение кнопки для закрытия модального окна корзины

    openCartButtons.forEach(button => {
      // Для каждой кнопки для открытия модального окна корзины добавляем обработчик события клика
      button.addEventListener('click', () => {
        // Добавление слушателя события клика
        cartModal.style.display = 'flex'; // Отображение модального окна корзины
        document.body.classList.add('modal-open'); // Добавление класса для блокировки прокрутки страницы
      });
    });
    closeCartModal.addEventListener('click', () => {
      // Добавление слушателя события клика для кнопки закрытия модального окна корзины
      cartModal.style.display = 'none'; // Скрытие модального окна корзины
      document.body.classList.remove('modal-open'); // Удаление класса для блокировки прокрутки страницы
    });
    window.addEventListener('click', event => {
      // Добавление слушателя события клика для закрытия модального окна корзины при клике за его пределами
      if (event.target === cartModal) {
        // Проверка, что клик произошел за пределами модального окна корзины
        cartModal.style.display = 'none'; // Скрытие модального окна корзины
        document.body.classList.remove('modal-open'); // Удаление класса для блокировки прокрутки страницы
      }
    });
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (load); // Экспорт функции load

/***/ }),

/***/ "./src/js/modules/modal.js":
/*!*********************************!*\
  !*** ./src/js/modules/modal.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const modal = () => {
  // это дефолтный софт для открытия закрытия модалок
  const modal = document.getElementById("myModal");
  const modal2 = document.getElementById("myModal2");
  const modal3 = document.getElementById("myModal3");
  const cartModal = document.getElementById("cartModal");
  const delivmodal = document.getElementById('uniqueDeliveryModal'); // Добавляем получение cartModal

  const btn = document.getElementById("openModalBtn");
  const btn2 = document.getElementById("openModalBtn2");
  const btn3 = document.getElementById("openModalBtn3");
  const delivSmodal = document.getElementById('uniqueShippingModal');
  const span = document.getElementsByClassName("close")[0];
  const span2 = document.getElementsByClassName("close2")[0];
  const span3 = document.getElementsByClassName("close3")[0];
  const spanCart = document.getElementsByClassName("close-cart-modal")[0];
  const reg = document.getElementById("reg");
  const log = document.getElementById("log");
  const email = document.getElementById("emailul");

  // Проверяем наличие JWT токена
  const jwtToken = localStorage.getItem('jwt');
  const subscribeButton = document.querySelector('.sub');
  const emailInput = document.querySelector('.email');
  // Получаем все элементы с классом "size"
  const sizeElements = document.querySelectorAll('.size');

  // Функция для обработки клика по размеру
  const handleSizeClick = event => {
    // Удаляем класс "active" у всех элементов
    sizeElements.forEach(sizeElement => {
      sizeElement.classList.remove('active');
    });

    // Добавляем класс "active" к текущему элементу
    event.target.classList.add('active');
  };

  // Добавляем обработчик клика к каждому элементу с классом "size"
  sizeElements.forEach(sizeElement => {
    sizeElement.addEventListener('click', handleSizeClick);
  });

  // Функция для очистки поля ввода email
  const clearEmailInput = () => {
    emailInput.value = '';
  };

  // Добавляем обработчик клика на кнопку "Подписаться"
  if (subscribeButton) {
    subscribeButton.addEventListener('click', clearEmailInput);
  }
  if (jwtToken) {
    // Если токен существует, открываем cartModal при клике на btn2
    if (btn2 && modal2 && span2 && cartModal) {
      btn2.onclick = function () {
        cartModal.style.display = "block";
      };
    }
  } else {
    // Если токен не существует, открываем myModal2 при клике на btn2
    if (btn2 && modal2 && span2) {
      btn2.onclick = function () {
        modal2.style.display = "block";
      };
    }
  }

  // Остальной код оставляем без изменений

  if (btn3 && modal3 && span3) {
    btn3.onclick = function () {
      modal3.style.display = "block";
    };
  }
  if (reg && email) {
    reg.onclick = function () {
      email.style.display = "block";
    };
  }
  if (log && modal && modal2) {
    log.onclick = function () {
      modal2.style.display = "none";
      modal.style.display = "block";
    };
  }
  if (span) {
    span.onclick = function () {
      modal.style.display = "none";
    };
  }
  if (span2) {
    span2.onclick = function () {
      modal2.style.display = "none";
    };
  }
  if (span3) {
    span3.onclick = function () {
      modal3.style.display = "none";
    };
  }
  if (spanCart && modal2) {
    spanCart.onclick = function () {
      modal2.style.display = "none";
    };
  }
  if (btn3 && delivmodal) {
    btn3.addEventListener('click', function () {
      delivmodal.style.display = "block";
    });
  }
  if (btn && delivSmodal) {
    btn.addEventListener('click', function () {
      delivSmodal.style.display = "block";
    });
  }
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    } else if (event.target == modal2) {
      modal2.style.display = "none";
    } else if (event.target == modal3) {
      modal3.style.display = "none";
    }
    if (event.target === delivmodal) {
      delivmodal.style.display = "none";
    }
    if (event.target === delivSmodal) {
      delivSmodal.style.display = "none";
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (modal);

/***/ }),

/***/ "./src/js/modules/search.js":
/*!**********************************!*\
  !*** ./src/js/modules/search.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const search = () => {
  const searchInput = document.querySelector('.searcher'); // Получение элемента поискового поля
  const gridItems = document.querySelectorAll('.grid-item'); // Получение всех элементов сетки

  if (!searchInput) {
    // Проверка наличия элемента поискового поля
    console.error('Search input element not found'); // Вывод сообщения об ошибке в консоль, если элемент поискового поля не найден
    return; // Выход из функции
  }

  // Функция для отображения всех элементов сетки
  function showAllItems() {
    gridItems.forEach(item => {
      item.classList.remove('hidden'); // Удаление класса hidden для отображения элемента
      item.classList.add('fade-in'); // Добавление класса fade-in для плавного появления элемента
    });
  }

  // Функция для скрытия элемента
  function hideItem(item) {
    item.classList.add('hidden'); // Добавление класса hidden для скрытия элемента
    item.classList.remove('fade-in'); // Удаление класса fade-in
  }

  // Добавление слушателя события input для поля поиска
  searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.toLowerCase(); // Получение текста из поля поиска и преобразование его в нижний регистр

    // Перебор всех элементов сетки
    gridItems.forEach(item => {
      const textElement = item.querySelector('.gridtxt'); // Получение элемента с текстом из элемента сетки
      const itemName = textElement.textContent.toLowerCase(); // Получение текста элемента и преобразование его в нижний регистр

      // Проверка, содержит ли текст элемента поисковую строку
      if (itemName.includes(searchTerm)) {
        item.classList.remove('hidden'); // Удаление класса hidden для отображения элемента
        item.classList.add('fade-in'); // Добавление класса fade-in для плавного появления элемента
      } else {
        hideItem(item); // Скрытие элемента, если он не содержит поисковую строку
      }
    });

    // Отображение всех элементов сетки, если поисковая строка пуста
    if (!searchTerm) {
      showAllItems(); // Вызов функции для отображения всех элементов сетки
    }
  });
  showAllItems(); // Вызов функции для отображения всех элементов сетки при загрузке страницы
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (search); // Экспорт функции search

/***/ }),

/***/ "./src/js/modules/slider.js":
/*!**********************************!*\
  !*** ./src/js/modules/slider.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
 // Импорт библиотеки axios для выполнения HTTP-запросов

const slider = () => {
  const total = []; // Массив для хранения данных о продуктах
  const photo = document.getElementById('photo'); // Получение элемента для отображения фотографии товара
  const oldpr = document.getElementById('old'); // Получение элемента для отображения старой цены товара
  const newpr = document.getElementById('new'); // Получение элемента для отображения новой цены товара
  const gridBlock = document.querySelector('.grid');

  // Массив кнопок для переключения слайдов
  const buttons = [document.getElementById('f'), document.getElementById('s'), document.getElementById('t'), document.getElementById('fo')];

  // Функция для загрузки данных о продуктах и их отображения в слайдере
  function sli() {
    const url = `https://better-success-f3e3e81dd8.strapiapp.com/api/products?populate=*`; // URL для получения данных о продуктах
    axios__WEBPACK_IMPORTED_MODULE_0___default().get(url) // Выполнение GET-запроса для получения данных о продуктах
    .then(response => {
      const rens = response.data.data; // Получение данных о продуктах из ответа сервера

      // Добавление данных о продуктах в массив total
      total.push(rens[0].attributes);
      total.push(rens[1].attributes);
      total.push(rens[2].attributes);
      total.push(rens[3].attributes);
      let currentIndex = 0; // Индекс текущего слайда

      // Функция для обновления слайдера
      const updateSlider = () => {
        if (currentIndex < total.length) {
          // Проверка, что индекс находится в пределах массива total
          // Обновление данных о текущем слайде
          photo.src = `https://better-success-f3e3e81dd8.strapiapp.com${total[currentIndex].preview.data.attributes.url}`;
          oldpr.textContent = total[currentIndex].price;
          newpr.textContent = total[currentIndex].price - 200;
          currentIndex++;
        } else {
          // Возврат к первой фотографии после завершения цикла
          photo.src = `https://better-success-f3e3e81dd8.strapiapp.com${total[0].preview.data.attributes.url}`;
          oldpr.textContent = total[0].price;
          newpr.textContent = total[0].price - 200;
          clearInterval(sliderInterval); // Остановка интервала для переключения слайдов
        }
      };

      // Установка интервала для автоматического переключения слайдов каждые 2 секунды
      const sliderInterval = setInterval(updateSlider, 2000);

      // Инициализация слайдера
      updateSlider();

      // Добавление обработчиков событий клика для кнопок переключения слайдов
      buttons.forEach((btn, index) => {
        btn.onclick = () => {
          // Обновление данных о текущем слайде при клике на кнопку
          photo.src = `https://better-success-f3e3e81dd8.strapiapp.com${total[index].preview.data.attributes.url}`;
          oldpr.textContent = total[index].price;
          newpr.textContent = total[index].price - 200;
        };
      });
      document.querySelector('.fbb').addEventListener('click', () => {
        gridBlock.scrollIntoView({
          behavior: "smooth"
        }); // Плавно скроллим к блоку с классом 'grid'
      });
    }).catch(error => {
      console.error('There was a problem with your axios request:', error); // Вывод ошибки в консоль в случае возникновения проблемы с запросом axios
    });
  }
  sli(); // Вызов функции для инициализации слайдера
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (slider); // Экспорт функции slider

/***/ }),

/***/ "./node_modules/axios/package.json":
/*!*****************************************!*\
  !*** ./node_modules/axios/package.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/modal */ "./src/js/modules/modal.js");
/* harmony import */ var _modules_baza__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/baza */ "./src/js/modules/baza.js");
/* harmony import */ var _modules_slider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/slider */ "./src/js/modules/slider.js");
/* harmony import */ var _modules_search__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/search */ "./src/js/modules/search.js");
/* harmony import */ var _modules_ak__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/ak */ "./src/js/modules/ak.js");
/* harmony import */ var _modules_login__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/login */ "./src/js/modules/login.js");
/* harmony import */ var _modules_auth__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/auth */ "./src/js/modules/auth.js");
/* harmony import */ var _modules_cart__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modules/cart */ "./src/js/modules/cart.js");
/* harmony import */ var _modules_clear__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modules/clear */ "./src/js/modules/clear.js");
/* harmony import */ var _modules_mod2__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./modules/mod2 */ "./src/js/modules/mod2.js");
/* harmony import */ var _modules_history__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./modules/history */ "./src/js/modules/history.js");











window.addEventListener('DOMContentLoaded', () => {
  (0,_modules_clear__WEBPACK_IMPORTED_MODULE_8__["default"])();
  (0,_modules_auth__WEBPACK_IMPORTED_MODULE_6__["default"])();
  (0,_modules_login__WEBPACK_IMPORTED_MODULE_5__["default"])();
  (0,_modules_baza__WEBPACK_IMPORTED_MODULE_1__.hiol)();
  (0,_modules_modal__WEBPACK_IMPORTED_MODULE_0__["default"])();
  (0,_modules_slider__WEBPACK_IMPORTED_MODULE_2__["default"])();
  (0,_modules_baza__WEBPACK_IMPORTED_MODULE_1__.Jet)();
  (0,_modules_search__WEBPACK_IMPORTED_MODULE_3__["default"])();
  (0,_modules_ak__WEBPACK_IMPORTED_MODULE_4__["default"])();
  (0,_modules_cart__WEBPACK_IMPORTED_MODULE_7__["default"])();
  (0,_modules_history__WEBPACK_IMPORTED_MODULE_10__["default"])();

  // Переносим вызов функции load в самый конец
  (0,_modules_mod2__WEBPACK_IMPORTED_MODULE_9__["default"])();
});
})();

/******/ })()
;
//# sourceMappingURL=script.js.map