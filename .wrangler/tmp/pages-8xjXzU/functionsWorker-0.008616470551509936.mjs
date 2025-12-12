var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../.wrangler/tmp/bundle-oTSwTO/checked-fetch.js
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  "../.wrangler/tmp/bundle-oTSwTO/checked-fetch.js"() {
    "use strict";
    urls = /* @__PURE__ */ new Set();
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init] = argArray;
        checkURL(request, init);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// api/summary.ts
var onRequestPost;
var init_summary = __esm({
  "api/summary.ts"() {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    onRequestPost = /* @__PURE__ */ __name(async (context) => {
      const { request, env } = context;
      try {
        const { text } = await request.json();
        if (!text) {
          return new Response(JSON.stringify({ error: "Text is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        const truncatedText = text.slice(0, 4e3);
        const response = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that summarizes blog posts. Provide a concise summary in the same language as the blog post (likely Chinese or English). Keep it under 200 words."
            },
            {
              role: "user",
              content: `Please summarize the following text:

${truncatedText}`
            }
          ]
        });
        return new Response(JSON.stringify({ summary: response.response }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to generate summary" + error }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }, "onRequestPost");
  }
});

// ../node_modules/@notionhq/client/build/src/utils.js
var require_utils = __commonJS({
  "../node_modules/@notionhq/client/build/src/utils.js"(exports) {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isObject = exports.pick = exports.assertNever = void 0;
    function assertNever(value) {
      throw new Error(`Unexpected value should never occur: ${value}`);
    }
    __name(assertNever, "assertNever");
    exports.assertNever = assertNever;
    function pick(base, keys) {
      const entries = keys.map((key) => [key, base === null || base === void 0 ? void 0 : base[key]]);
      return Object.fromEntries(entries);
    }
    __name(pick, "pick");
    exports.pick = pick;
    function isObject(o) {
      return typeof o === "object" && o !== null;
    }
    __name(isObject, "isObject");
    exports.isObject = isObject;
  }
});

// ../node_modules/@notionhq/client/build/src/logging.js
var require_logging = __commonJS({
  "../node_modules/@notionhq/client/build/src/logging.js"(exports) {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.logLevelSeverity = exports.makeConsoleLogger = exports.LogLevel = void 0;
    var utils_1 = require_utils();
    var LogLevel;
    (function(LogLevel2) {
      LogLevel2["DEBUG"] = "debug";
      LogLevel2["INFO"] = "info";
      LogLevel2["WARN"] = "warn";
      LogLevel2["ERROR"] = "error";
    })(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
    function makeConsoleLogger(name) {
      return (level, message, extraInfo) => {
        console[level](`${name} ${level}:`, message, extraInfo);
      };
    }
    __name(makeConsoleLogger, "makeConsoleLogger");
    exports.makeConsoleLogger = makeConsoleLogger;
    function logLevelSeverity(level) {
      switch (level) {
        case LogLevel.DEBUG:
          return 20;
        case LogLevel.INFO:
          return 40;
        case LogLevel.WARN:
          return 60;
        case LogLevel.ERROR:
          return 80;
        default:
          return (0, utils_1.assertNever)(level);
      }
    }
    __name(logLevelSeverity, "logLevelSeverity");
    exports.logLevelSeverity = logLevelSeverity;
  }
});

// ../node_modules/@notionhq/client/build/src/errors.js
var require_errors = __commonJS({
  "../node_modules/@notionhq/client/build/src/errors.js"(exports) {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildRequestError = exports.APIResponseError = exports.UnknownHTTPResponseError = exports.isHTTPResponseError = exports.RequestTimeoutError = exports.isNotionClientError = exports.ClientErrorCode = exports.APIErrorCode = void 0;
    var utils_1 = require_utils();
    var APIErrorCode;
    (function(APIErrorCode2) {
      APIErrorCode2["Unauthorized"] = "unauthorized";
      APIErrorCode2["RestrictedResource"] = "restricted_resource";
      APIErrorCode2["ObjectNotFound"] = "object_not_found";
      APIErrorCode2["RateLimited"] = "rate_limited";
      APIErrorCode2["InvalidJSON"] = "invalid_json";
      APIErrorCode2["InvalidRequestURL"] = "invalid_request_url";
      APIErrorCode2["InvalidRequest"] = "invalid_request";
      APIErrorCode2["ValidationError"] = "validation_error";
      APIErrorCode2["ConflictError"] = "conflict_error";
      APIErrorCode2["InternalServerError"] = "internal_server_error";
      APIErrorCode2["ServiceUnavailable"] = "service_unavailable";
    })(APIErrorCode = exports.APIErrorCode || (exports.APIErrorCode = {}));
    var ClientErrorCode;
    (function(ClientErrorCode2) {
      ClientErrorCode2["RequestTimeout"] = "notionhq_client_request_timeout";
      ClientErrorCode2["ResponseError"] = "notionhq_client_response_error";
    })(ClientErrorCode = exports.ClientErrorCode || (exports.ClientErrorCode = {}));
    var NotionClientErrorBase = class extends Error {
      static {
        __name(this, "NotionClientErrorBase");
      }
    };
    function isNotionClientError(error) {
      return (0, utils_1.isObject)(error) && error instanceof NotionClientErrorBase;
    }
    __name(isNotionClientError, "isNotionClientError");
    exports.isNotionClientError = isNotionClientError;
    function isNotionClientErrorWithCode(error, codes) {
      return isNotionClientError(error) && error.code in codes;
    }
    __name(isNotionClientErrorWithCode, "isNotionClientErrorWithCode");
    var RequestTimeoutError = class _RequestTimeoutError extends NotionClientErrorBase {
      static {
        __name(this, "RequestTimeoutError");
      }
      constructor(message = "Request to Notion API has timed out") {
        super(message);
        this.code = ClientErrorCode.RequestTimeout;
        this.name = "RequestTimeoutError";
      }
      static isRequestTimeoutError(error) {
        return isNotionClientErrorWithCode(error, {
          [ClientErrorCode.RequestTimeout]: true
        });
      }
      static rejectAfterTimeout(promise, timeoutMS) {
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new _RequestTimeoutError());
          }, timeoutMS);
          promise.then(resolve).catch(reject).then(() => clearTimeout(timeoutId));
        });
      }
    };
    exports.RequestTimeoutError = RequestTimeoutError;
    var HTTPResponseError = class extends NotionClientErrorBase {
      static {
        __name(this, "HTTPResponseError");
      }
      constructor(args) {
        super(args.message);
        this.name = "HTTPResponseError";
        const { code, status, headers, rawBodyText } = args;
        this.code = code;
        this.status = status;
        this.headers = headers;
        this.body = rawBodyText;
      }
    };
    var httpResponseErrorCodes = {
      [ClientErrorCode.ResponseError]: true,
      [APIErrorCode.Unauthorized]: true,
      [APIErrorCode.RestrictedResource]: true,
      [APIErrorCode.ObjectNotFound]: true,
      [APIErrorCode.RateLimited]: true,
      [APIErrorCode.InvalidJSON]: true,
      [APIErrorCode.InvalidRequestURL]: true,
      [APIErrorCode.InvalidRequest]: true,
      [APIErrorCode.ValidationError]: true,
      [APIErrorCode.ConflictError]: true,
      [APIErrorCode.InternalServerError]: true,
      [APIErrorCode.ServiceUnavailable]: true
    };
    function isHTTPResponseError(error) {
      if (!isNotionClientErrorWithCode(error, httpResponseErrorCodes)) {
        return false;
      }
      return true;
    }
    __name(isHTTPResponseError, "isHTTPResponseError");
    exports.isHTTPResponseError = isHTTPResponseError;
    var UnknownHTTPResponseError = class extends HTTPResponseError {
      static {
        __name(this, "UnknownHTTPResponseError");
      }
      constructor(args) {
        var _a;
        super({
          ...args,
          code: ClientErrorCode.ResponseError,
          message: (_a = args.message) !== null && _a !== void 0 ? _a : `Request to Notion API failed with status: ${args.status}`
        });
        this.name = "UnknownHTTPResponseError";
      }
      static isUnknownHTTPResponseError(error) {
        return isNotionClientErrorWithCode(error, {
          [ClientErrorCode.ResponseError]: true
        });
      }
    };
    exports.UnknownHTTPResponseError = UnknownHTTPResponseError;
    var apiErrorCodes = {
      [APIErrorCode.Unauthorized]: true,
      [APIErrorCode.RestrictedResource]: true,
      [APIErrorCode.ObjectNotFound]: true,
      [APIErrorCode.RateLimited]: true,
      [APIErrorCode.InvalidJSON]: true,
      [APIErrorCode.InvalidRequestURL]: true,
      [APIErrorCode.InvalidRequest]: true,
      [APIErrorCode.ValidationError]: true,
      [APIErrorCode.ConflictError]: true,
      [APIErrorCode.InternalServerError]: true,
      [APIErrorCode.ServiceUnavailable]: true
    };
    var APIResponseError = class extends HTTPResponseError {
      static {
        __name(this, "APIResponseError");
      }
      constructor() {
        super(...arguments);
        this.name = "APIResponseError";
      }
      static isAPIResponseError(error) {
        return isNotionClientErrorWithCode(error, apiErrorCodes);
      }
    };
    exports.APIResponseError = APIResponseError;
    function buildRequestError(response, bodyText) {
      const apiErrorResponseBody = parseAPIErrorResponseBody(bodyText);
      if (apiErrorResponseBody !== void 0) {
        return new APIResponseError({
          code: apiErrorResponseBody.code,
          message: apiErrorResponseBody.message,
          headers: response.headers,
          status: response.status,
          rawBodyText: bodyText
        });
      }
      return new UnknownHTTPResponseError({
        message: void 0,
        headers: response.headers,
        status: response.status,
        rawBodyText: bodyText
      });
    }
    __name(buildRequestError, "buildRequestError");
    exports.buildRequestError = buildRequestError;
    function parseAPIErrorResponseBody(body) {
      if (typeof body !== "string") {
        return;
      }
      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch (parseError) {
        return;
      }
      if (!(0, utils_1.isObject)(parsed) || typeof parsed["message"] !== "string" || !isAPIErrorCode(parsed["code"])) {
        return;
      }
      return {
        ...parsed,
        code: parsed["code"],
        message: parsed["message"]
      };
    }
    __name(parseAPIErrorResponseBody, "parseAPIErrorResponseBody");
    function isAPIErrorCode(code) {
      return typeof code === "string" && code in apiErrorCodes;
    }
    __name(isAPIErrorCode, "isAPIErrorCode");
  }
});

// ../node_modules/@notionhq/client/build/src/api-endpoints.js
var require_api_endpoints = __commonJS({
  "../node_modules/@notionhq/client/build/src/api-endpoints.js"(exports) {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.listComments = exports.createComment = exports.search = exports.createDatabase = exports.listDatabases = exports.queryDatabase = exports.updateDatabase = exports.getDatabase = exports.appendBlockChildren = exports.listBlockChildren = exports.deleteBlock = exports.updateBlock = exports.getBlock = exports.getPageProperty = exports.updatePage = exports.getPage = exports.createPage = exports.listUsers = exports.getUser = exports.getSelf = void 0;
    exports.getSelf = {
      method: "get",
      pathParams: [],
      queryParams: [],
      bodyParams: [],
      path: /* @__PURE__ */ __name(() => `users/me`, "path")
    };
    exports.getUser = {
      method: "get",
      pathParams: ["user_id"],
      queryParams: [],
      bodyParams: [],
      path: /* @__PURE__ */ __name((p) => `users/${p.user_id}`, "path")
    };
    exports.listUsers = {
      method: "get",
      pathParams: [],
      queryParams: ["start_cursor", "page_size"],
      bodyParams: [],
      path: /* @__PURE__ */ __name(() => `users`, "path")
    };
    exports.createPage = {
      method: "post",
      pathParams: [],
      queryParams: [],
      bodyParams: ["parent", "properties", "icon", "cover", "content", "children"],
      path: /* @__PURE__ */ __name(() => `pages`, "path")
    };
    exports.getPage = {
      method: "get",
      pathParams: ["page_id"],
      queryParams: ["filter_properties"],
      bodyParams: [],
      path: /* @__PURE__ */ __name((p) => `pages/${p.page_id}`, "path")
    };
    exports.updatePage = {
      method: "patch",
      pathParams: ["page_id"],
      queryParams: [],
      bodyParams: ["properties", "icon", "cover", "archived"],
      path: /* @__PURE__ */ __name((p) => `pages/${p.page_id}`, "path")
    };
    exports.getPageProperty = {
      method: "get",
      pathParams: ["page_id", "property_id"],
      queryParams: ["start_cursor", "page_size"],
      bodyParams: [],
      path: /* @__PURE__ */ __name((p) => `pages/${p.page_id}/properties/${p.property_id}`, "path")
    };
    exports.getBlock = {
      method: "get",
      pathParams: ["block_id"],
      queryParams: [],
      bodyParams: [],
      path: /* @__PURE__ */ __name((p) => `blocks/${p.block_id}`, "path")
    };
    exports.updateBlock = {
      method: "patch",
      pathParams: ["block_id"],
      queryParams: [],
      bodyParams: [
        "embed",
        "type",
        "archived",
        "bookmark",
        "image",
        "video",
        "pdf",
        "file",
        "audio",
        "code",
        "equation",
        "divider",
        "breadcrumb",
        "table_of_contents",
        "link_to_page",
        "table_row",
        "heading_1",
        "heading_2",
        "heading_3",
        "paragraph",
        "bulleted_list_item",
        "numbered_list_item",
        "quote",
        "to_do",
        "toggle",
        "template",
        "callout",
        "synced_block",
        "table"
      ],
      path: /* @__PURE__ */ __name((p) => `blocks/${p.block_id}`, "path")
    };
    exports.deleteBlock = {
      method: "delete",
      pathParams: ["block_id"],
      queryParams: [],
      bodyParams: [],
      path: /* @__PURE__ */ __name((p) => `blocks/${p.block_id}`, "path")
    };
    exports.listBlockChildren = {
      method: "get",
      pathParams: ["block_id"],
      queryParams: ["start_cursor", "page_size"],
      bodyParams: [],
      path: /* @__PURE__ */ __name((p) => `blocks/${p.block_id}/children`, "path")
    };
    exports.appendBlockChildren = {
      method: "patch",
      pathParams: ["block_id"],
      queryParams: [],
      bodyParams: ["children"],
      path: /* @__PURE__ */ __name((p) => `blocks/${p.block_id}/children`, "path")
    };
    exports.getDatabase = {
      method: "get",
      pathParams: ["database_id"],
      queryParams: [],
      bodyParams: [],
      path: /* @__PURE__ */ __name((p) => `databases/${p.database_id}`, "path")
    };
    exports.updateDatabase = {
      method: "patch",
      pathParams: ["database_id"],
      queryParams: [],
      bodyParams: [
        "title",
        "description",
        "icon",
        "cover",
        "properties",
        "is_inline",
        "archived"
      ],
      path: /* @__PURE__ */ __name((p) => `databases/${p.database_id}`, "path")
    };
    exports.queryDatabase = {
      method: "post",
      pathParams: ["database_id"],
      queryParams: ["filter_properties"],
      bodyParams: ["sorts", "filter", "start_cursor", "page_size", "archived"],
      path: /* @__PURE__ */ __name((p) => `databases/${p.database_id}/query`, "path")
    };
    exports.listDatabases = {
      method: "get",
      pathParams: [],
      queryParams: ["start_cursor", "page_size"],
      bodyParams: [],
      path: /* @__PURE__ */ __name(() => `databases`, "path")
    };
    exports.createDatabase = {
      method: "post",
      pathParams: [],
      queryParams: [],
      bodyParams: [
        "parent",
        "properties",
        "icon",
        "cover",
        "title",
        "description",
        "is_inline"
      ],
      path: /* @__PURE__ */ __name(() => `databases`, "path")
    };
    exports.search = {
      method: "post",
      pathParams: [],
      queryParams: [],
      bodyParams: ["sort", "query", "start_cursor", "page_size", "filter"],
      path: /* @__PURE__ */ __name(() => `search`, "path")
    };
    exports.createComment = {
      method: "post",
      pathParams: [],
      queryParams: [],
      bodyParams: ["parent", "rich_text", "discussion_id"],
      path: /* @__PURE__ */ __name(() => `comments`, "path")
    };
    exports.listComments = {
      method: "get",
      pathParams: [],
      queryParams: ["block_id", "start_cursor", "page_size"],
      bodyParams: [],
      path: /* @__PURE__ */ __name(() => `comments`, "path")
    };
  }
});

// ../node_modules/node-fetch/browser.js
var require_browser = __commonJS({
  "../node_modules/node-fetch/browser.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    var getGlobal = /* @__PURE__ */ __name(function() {
      if (typeof self !== "undefined") {
        return self;
      }
      if (typeof window !== "undefined") {
        return window;
      }
      if (typeof global !== "undefined") {
        return global;
      }
      throw new Error("unable to locate global object");
    }, "getGlobal");
    var globalObject = getGlobal();
    module.exports = exports = globalObject.fetch;
    if (globalObject.fetch) {
      exports.default = globalObject.fetch.bind(globalObject);
    }
    exports.Headers = globalObject.Headers;
    exports.Request = globalObject.Request;
    exports.Response = globalObject.Response;
  }
});

// ../node_modules/@notionhq/client/build/package.json
var require_package = __commonJS({
  "../node_modules/@notionhq/client/build/package.json"(exports, module) {
    module.exports = {
      name: "@notionhq/client",
      version: "2.2.3",
      description: "A simple and easy to use client for the Notion API",
      engines: {
        node: ">=12"
      },
      homepage: "https://developers.notion.com/docs/getting-started",
      bugs: {
        url: "https://github.com/makenotion/notion-sdk-js/issues"
      },
      repository: {
        type: "git",
        url: "https://github.com/makenotion/notion-sdk-js/"
      },
      keywords: [
        "notion",
        "notionapi",
        "rest",
        "notion-api"
      ],
      main: "./build/src",
      types: "./build/src/index.d.ts",
      scripts: {
        prepare: "npm run build",
        prepublishOnly: "npm run checkLoggedIn && npm run lint && npm run test",
        build: "tsc",
        prettier: "prettier --write .",
        lint: "prettier --check . && eslint . --ext .ts && cspell '**/*' ",
        test: "jest ./test",
        "check-links": "git ls-files | grep md$ | xargs -n 1 markdown-link-check",
        prebuild: "npm run clean",
        clean: "rm -rf ./build",
        checkLoggedIn: "./scripts/verifyLoggedIn.sh"
      },
      author: "",
      license: "MIT",
      files: [
        "build/package.json",
        "build/src/**"
      ],
      dependencies: {
        "@types/node-fetch": "^2.5.10",
        "node-fetch": "^2.6.1"
      },
      devDependencies: {
        "@types/jest": "^28.1.4",
        "@typescript-eslint/eslint-plugin": "^5.39.0",
        "@typescript-eslint/parser": "^5.39.0",
        cspell: "^5.4.1",
        eslint: "^7.24.0",
        jest: "^28.1.2",
        "markdown-link-check": "^3.8.7",
        prettier: "^2.3.0",
        "ts-jest": "^28.0.5",
        typescript: "^4.8.4"
      }
    };
  }
});

// ../node_modules/@notionhq/client/build/src/Client.js
var require_Client = __commonJS({
  "../node_modules/@notionhq/client/build/src/Client.js"(exports) {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m") throw new TypeError("Private method is not writable");
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _Client_auth;
    var _Client_logLevel;
    var _Client_logger;
    var _Client_prefixUrl;
    var _Client_timeoutMs;
    var _Client_notionVersion;
    var _Client_fetch;
    var _Client_agent;
    var _Client_userAgent;
    Object.defineProperty(exports, "__esModule", { value: true });
    var logging_1 = require_logging();
    var errors_1 = require_errors();
    var utils_1 = require_utils();
    var api_endpoints_1 = require_api_endpoints();
    var node_fetch_1 = require_browser();
    var package_json_1 = require_package();
    var Client2 = class _Client {
      static {
        __name(this, "Client");
      }
      constructor(options) {
        var _a, _b, _c, _d, _e, _f;
        _Client_auth.set(this, void 0);
        _Client_logLevel.set(this, void 0);
        _Client_logger.set(this, void 0);
        _Client_prefixUrl.set(this, void 0);
        _Client_timeoutMs.set(this, void 0);
        _Client_notionVersion.set(this, void 0);
        _Client_fetch.set(this, void 0);
        _Client_agent.set(this, void 0);
        _Client_userAgent.set(this, void 0);
        this.blocks = {
          /**
           * Retrieve block
           */
          retrieve: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.getBlock.path(args),
              method: api_endpoints_1.getBlock.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.getBlock.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.getBlock.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "retrieve"),
          /**
           * Update block
           */
          update: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.updateBlock.path(args),
              method: api_endpoints_1.updateBlock.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.updateBlock.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.updateBlock.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "update"),
          /**
           * Delete block
           */
          delete: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.deleteBlock.path(args),
              method: api_endpoints_1.deleteBlock.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.deleteBlock.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.deleteBlock.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "delete"),
          children: {
            /**
             * Append block children
             */
            append: /* @__PURE__ */ __name((args) => {
              return this.request({
                path: api_endpoints_1.appendBlockChildren.path(args),
                method: api_endpoints_1.appendBlockChildren.method,
                query: (0, utils_1.pick)(args, api_endpoints_1.appendBlockChildren.queryParams),
                body: (0, utils_1.pick)(args, api_endpoints_1.appendBlockChildren.bodyParams),
                auth: args === null || args === void 0 ? void 0 : args.auth
              });
            }, "append"),
            /**
             * Retrieve block children
             */
            list: /* @__PURE__ */ __name((args) => {
              return this.request({
                path: api_endpoints_1.listBlockChildren.path(args),
                method: api_endpoints_1.listBlockChildren.method,
                query: (0, utils_1.pick)(args, api_endpoints_1.listBlockChildren.queryParams),
                body: (0, utils_1.pick)(args, api_endpoints_1.listBlockChildren.bodyParams),
                auth: args === null || args === void 0 ? void 0 : args.auth
              });
            }, "list")
          }
        };
        this.databases = {
          /**
           * List databases
           *
           * @deprecated Please use `search`
           */
          list: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.listDatabases.path(),
              method: api_endpoints_1.listDatabases.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.listDatabases.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.listDatabases.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "list"),
          /**
           * Retrieve a database
           */
          retrieve: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.getDatabase.path(args),
              method: api_endpoints_1.getDatabase.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.getDatabase.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.getDatabase.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "retrieve"),
          /**
           * Query a database
           */
          query: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.queryDatabase.path(args),
              method: api_endpoints_1.queryDatabase.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.queryDatabase.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.queryDatabase.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "query"),
          /**
           * Create a database
           */
          create: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.createDatabase.path(),
              method: api_endpoints_1.createDatabase.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.createDatabase.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.createDatabase.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "create"),
          /**
           * Update a database
           */
          update: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.updateDatabase.path(args),
              method: api_endpoints_1.updateDatabase.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.updateDatabase.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.updateDatabase.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "update")
        };
        this.pages = {
          /**
           * Create a page
           */
          create: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.createPage.path(),
              method: api_endpoints_1.createPage.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.createPage.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.createPage.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "create"),
          /**
           * Retrieve a page
           */
          retrieve: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.getPage.path(args),
              method: api_endpoints_1.getPage.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.getPage.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.getPage.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "retrieve"),
          /**
           * Update page properties
           */
          update: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.updatePage.path(args),
              method: api_endpoints_1.updatePage.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.updatePage.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.updatePage.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "update"),
          properties: {
            /**
             * Retrieve page property
             */
            retrieve: /* @__PURE__ */ __name((args) => {
              return this.request({
                path: api_endpoints_1.getPageProperty.path(args),
                method: api_endpoints_1.getPageProperty.method,
                query: (0, utils_1.pick)(args, api_endpoints_1.getPageProperty.queryParams),
                body: (0, utils_1.pick)(args, api_endpoints_1.getPageProperty.bodyParams),
                auth: args === null || args === void 0 ? void 0 : args.auth
              });
            }, "retrieve")
          }
        };
        this.users = {
          /**
           * Retrieve a user
           */
          retrieve: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.getUser.path(args),
              method: api_endpoints_1.getUser.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.getUser.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.getUser.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "retrieve"),
          /**
           * List all users
           */
          list: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.listUsers.path(),
              method: api_endpoints_1.listUsers.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.listUsers.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.listUsers.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "list"),
          /**
           * Get details about bot
           */
          me: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.getSelf.path(),
              method: api_endpoints_1.getSelf.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.getSelf.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.getSelf.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "me")
        };
        this.comments = {
          /**
           * Create a comment
           */
          create: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.createComment.path(),
              method: api_endpoints_1.createComment.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.createComment.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.createComment.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "create"),
          /**
           * List comments
           */
          list: /* @__PURE__ */ __name((args) => {
            return this.request({
              path: api_endpoints_1.listComments.path(),
              method: api_endpoints_1.listComments.method,
              query: (0, utils_1.pick)(args, api_endpoints_1.listComments.queryParams),
              body: (0, utils_1.pick)(args, api_endpoints_1.listComments.bodyParams),
              auth: args === null || args === void 0 ? void 0 : args.auth
            });
          }, "list")
        };
        this.search = (args) => {
          return this.request({
            path: api_endpoints_1.search.path(),
            method: api_endpoints_1.search.method,
            query: (0, utils_1.pick)(args, api_endpoints_1.search.queryParams),
            body: (0, utils_1.pick)(args, api_endpoints_1.search.bodyParams),
            auth: args === null || args === void 0 ? void 0 : args.auth
          });
        };
        __classPrivateFieldSet(this, _Client_auth, options === null || options === void 0 ? void 0 : options.auth, "f");
        __classPrivateFieldSet(this, _Client_logLevel, (_a = options === null || options === void 0 ? void 0 : options.logLevel) !== null && _a !== void 0 ? _a : logging_1.LogLevel.WARN, "f");
        __classPrivateFieldSet(this, _Client_logger, (_b = options === null || options === void 0 ? void 0 : options.logger) !== null && _b !== void 0 ? _b : (0, logging_1.makeConsoleLogger)(package_json_1.name), "f");
        __classPrivateFieldSet(this, _Client_prefixUrl, ((_c = options === null || options === void 0 ? void 0 : options.baseUrl) !== null && _c !== void 0 ? _c : "https://api.notion.com") + "/v1/", "f");
        __classPrivateFieldSet(this, _Client_timeoutMs, (_d = options === null || options === void 0 ? void 0 : options.timeoutMs) !== null && _d !== void 0 ? _d : 6e4, "f");
        __classPrivateFieldSet(this, _Client_notionVersion, (_e = options === null || options === void 0 ? void 0 : options.notionVersion) !== null && _e !== void 0 ? _e : _Client.defaultNotionVersion, "f");
        __classPrivateFieldSet(this, _Client_fetch, (_f = options === null || options === void 0 ? void 0 : options.fetch) !== null && _f !== void 0 ? _f : node_fetch_1.default, "f");
        __classPrivateFieldSet(this, _Client_agent, options === null || options === void 0 ? void 0 : options.agent, "f");
        __classPrivateFieldSet(this, _Client_userAgent, `notionhq-client/${package_json_1.version}`, "f");
      }
      /**
       * Sends a request.
       *
       * @param path
       * @param method
       * @param query
       * @param body
       * @returns
       */
      async request({ path, method, query, body, auth }) {
        this.log(logging_1.LogLevel.INFO, "request start", { method, path });
        const bodyAsJsonString = !body || Object.entries(body).length === 0 ? void 0 : JSON.stringify(body);
        const url = new URL(`${__classPrivateFieldGet(this, _Client_prefixUrl, "f")}${path}`);
        if (query) {
          for (const [key, value] of Object.entries(query)) {
            if (value !== void 0) {
              if (Array.isArray(value)) {
                value.forEach((val) => url.searchParams.append(key, String(val)));
              } else {
                url.searchParams.append(key, String(value));
              }
            }
          }
        }
        const headers = {
          ...this.authAsHeaders(auth),
          "Notion-Version": __classPrivateFieldGet(this, _Client_notionVersion, "f"),
          "user-agent": __classPrivateFieldGet(this, _Client_userAgent, "f")
        };
        if (bodyAsJsonString !== void 0) {
          headers["content-type"] = "application/json";
        }
        try {
          const response = await errors_1.RequestTimeoutError.rejectAfterTimeout(__classPrivateFieldGet(this, _Client_fetch, "f").call(this, url.toString(), {
            method: method.toUpperCase(),
            headers,
            body: bodyAsJsonString,
            agent: __classPrivateFieldGet(this, _Client_agent, "f")
          }), __classPrivateFieldGet(this, _Client_timeoutMs, "f"));
          const responseText = await response.text();
          if (!response.ok) {
            throw (0, errors_1.buildRequestError)(response, responseText);
          }
          const responseJson = JSON.parse(responseText);
          this.log(logging_1.LogLevel.INFO, `request success`, { method, path });
          return responseJson;
        } catch (error) {
          if (!(0, errors_1.isNotionClientError)(error)) {
            throw error;
          }
          this.log(logging_1.LogLevel.WARN, `request fail`, {
            code: error.code,
            message: error.message
          });
          if ((0, errors_1.isHTTPResponseError)(error)) {
            this.log(logging_1.LogLevel.DEBUG, `failed response body`, {
              body: error.body
            });
          }
          throw error;
        }
      }
      /**
       * Emits a log message to the console.
       *
       * @param level The level for this message
       * @param args Arguments to send to the console
       */
      log(level, message, extraInfo) {
        if ((0, logging_1.logLevelSeverity)(level) >= (0, logging_1.logLevelSeverity)(__classPrivateFieldGet(this, _Client_logLevel, "f"))) {
          __classPrivateFieldGet(this, _Client_logger, "f").call(this, level, message, extraInfo);
        }
      }
      /**
       * Transforms an API key or access token into a headers object suitable for an HTTP request.
       *
       * This method uses the instance's value as the default when the input is undefined. If neither are defined, it returns
       * an empty object
       *
       * @param auth API key or access token
       * @returns headers key-value object
       */
      authAsHeaders(auth) {
        const headers = {};
        const authHeaderValue = auth !== null && auth !== void 0 ? auth : __classPrivateFieldGet(this, _Client_auth, "f");
        if (authHeaderValue !== void 0) {
          headers["authorization"] = `Bearer ${authHeaderValue}`;
        }
        return headers;
      }
    };
    exports.default = Client2;
    _Client_auth = /* @__PURE__ */ new WeakMap(), _Client_logLevel = /* @__PURE__ */ new WeakMap(), _Client_logger = /* @__PURE__ */ new WeakMap(), _Client_prefixUrl = /* @__PURE__ */ new WeakMap(), _Client_timeoutMs = /* @__PURE__ */ new WeakMap(), _Client_notionVersion = /* @__PURE__ */ new WeakMap(), _Client_fetch = /* @__PURE__ */ new WeakMap(), _Client_agent = /* @__PURE__ */ new WeakMap(), _Client_userAgent = /* @__PURE__ */ new WeakMap();
    Client2.defaultNotionVersion = "2022-06-28";
  }
});

// ../node_modules/@notionhq/client/build/src/helpers.js
var require_helpers = __commonJS({
  "../node_modules/@notionhq/client/build/src/helpers.js"(exports) {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isFullComment = exports.isFullUser = exports.isFullDatabase = exports.isFullPage = exports.isFullBlock = exports.collectPaginatedAPI = exports.iteratePaginatedAPI = void 0;
    async function* iteratePaginatedAPI(listFn, firstPageArgs) {
      let nextCursor = firstPageArgs.start_cursor;
      do {
        const response = await listFn({
          ...firstPageArgs,
          start_cursor: nextCursor
        });
        yield* response.results;
        nextCursor = response.next_cursor;
      } while (nextCursor);
    }
    __name(iteratePaginatedAPI, "iteratePaginatedAPI");
    exports.iteratePaginatedAPI = iteratePaginatedAPI;
    async function collectPaginatedAPI(listFn, firstPageArgs) {
      const results = [];
      for await (const item of iteratePaginatedAPI(listFn, firstPageArgs)) {
        results.push(item);
      }
      return results;
    }
    __name(collectPaginatedAPI, "collectPaginatedAPI");
    exports.collectPaginatedAPI = collectPaginatedAPI;
    function isFullBlock(response) {
      return "type" in response;
    }
    __name(isFullBlock, "isFullBlock");
    exports.isFullBlock = isFullBlock;
    function isFullPage(response) {
      return "url" in response;
    }
    __name(isFullPage, "isFullPage");
    exports.isFullPage = isFullPage;
    function isFullDatabase(response) {
      return "title" in response;
    }
    __name(isFullDatabase, "isFullDatabase");
    exports.isFullDatabase = isFullDatabase;
    function isFullUser(response) {
      return "type" in response;
    }
    __name(isFullUser, "isFullUser");
    exports.isFullUser = isFullUser;
    function isFullComment(response) {
      return "created_by" in response;
    }
    __name(isFullComment, "isFullComment");
    exports.isFullComment = isFullComment;
  }
});

// ../node_modules/@notionhq/client/build/src/index.js
var require_src = __commonJS({
  "../node_modules/@notionhq/client/build/src/index.js"(exports) {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isFullComment = exports.isFullUser = exports.isFullPage = exports.isFullDatabase = exports.isFullBlock = exports.iteratePaginatedAPI = exports.collectPaginatedAPI = exports.isNotionClientError = exports.RequestTimeoutError = exports.UnknownHTTPResponseError = exports.APIResponseError = exports.ClientErrorCode = exports.APIErrorCode = exports.LogLevel = exports.Client = void 0;
    var Client_1 = require_Client();
    Object.defineProperty(exports, "Client", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return Client_1.default;
    }, "get") });
    var logging_1 = require_logging();
    Object.defineProperty(exports, "LogLevel", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return logging_1.LogLevel;
    }, "get") });
    var errors_1 = require_errors();
    Object.defineProperty(exports, "APIErrorCode", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return errors_1.APIErrorCode;
    }, "get") });
    Object.defineProperty(exports, "ClientErrorCode", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return errors_1.ClientErrorCode;
    }, "get") });
    Object.defineProperty(exports, "APIResponseError", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return errors_1.APIResponseError;
    }, "get") });
    Object.defineProperty(exports, "UnknownHTTPResponseError", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return errors_1.UnknownHTTPResponseError;
    }, "get") });
    Object.defineProperty(exports, "RequestTimeoutError", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return errors_1.RequestTimeoutError;
    }, "get") });
    Object.defineProperty(exports, "isNotionClientError", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return errors_1.isNotionClientError;
    }, "get") });
    var helpers_1 = require_helpers();
    Object.defineProperty(exports, "collectPaginatedAPI", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return helpers_1.collectPaginatedAPI;
    }, "get") });
    Object.defineProperty(exports, "iteratePaginatedAPI", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return helpers_1.iteratePaginatedAPI;
    }, "get") });
    Object.defineProperty(exports, "isFullBlock", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return helpers_1.isFullBlock;
    }, "get") });
    Object.defineProperty(exports, "isFullDatabase", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return helpers_1.isFullDatabase;
    }, "get") });
    Object.defineProperty(exports, "isFullPage", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return helpers_1.isFullPage;
    }, "get") });
    Object.defineProperty(exports, "isFullUser", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return helpers_1.isFullUser;
    }, "get") });
    Object.defineProperty(exports, "isFullComment", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return helpers_1.isFullComment;
    }, "get") });
  }
});

// ../node_modules/repeat-string/index.js
var require_repeat_string = __commonJS({
  "../node_modules/repeat-string/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    var res = "";
    var cache;
    module.exports = repeat;
    function repeat(str, num) {
      if (typeof str !== "string") {
        throw new TypeError("expected a string");
      }
      if (num === 1) return str;
      if (num === 2) return str + str;
      var max = str.length * num;
      if (cache !== str || typeof cache === "undefined") {
        cache = str;
        res = "";
      } else if (res.length >= max) {
        return res.substr(0, max);
      }
      while (max > res.length && num > 1) {
        if (num & 1) {
          res += str;
        }
        num >>= 1;
        str += str;
      }
      res += str;
      res = res.substr(0, max);
      return res;
    }
    __name(repeat, "repeat");
  }
});

// ../node_modules/markdown-table/index.js
var require_markdown_table = __commonJS({
  "../node_modules/markdown-table/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    var repeat = require_repeat_string();
    module.exports = markdownTable;
    var trailingWhitespace = / +$/;
    var space = " ";
    var lineFeed = "\n";
    var dash = "-";
    var colon = ":";
    var verticalBar = "|";
    var x = 0;
    var C = 67;
    var L = 76;
    var R = 82;
    var c = 99;
    var l = 108;
    var r = 114;
    function markdownTable(table, options) {
      var settings = options || {};
      var padding = settings.padding !== false;
      var start = settings.delimiterStart !== false;
      var end = settings.delimiterEnd !== false;
      var align = (settings.align || []).concat();
      var alignDelimiters = settings.alignDelimiters !== false;
      var alignments = [];
      var stringLength = settings.stringLength || defaultStringLength;
      var rowIndex = -1;
      var rowLength = table.length;
      var cellMatrix = [];
      var sizeMatrix = [];
      var row = [];
      var sizes = [];
      var longestCellByColumn = [];
      var mostCellsPerRow = 0;
      var cells;
      var columnIndex;
      var columnLength;
      var largest;
      var size;
      var cell;
      var lines;
      var line;
      var before;
      var after;
      var code;
      while (++rowIndex < rowLength) {
        cells = table[rowIndex];
        columnIndex = -1;
        columnLength = cells.length;
        row = [];
        sizes = [];
        if (columnLength > mostCellsPerRow) {
          mostCellsPerRow = columnLength;
        }
        while (++columnIndex < columnLength) {
          cell = serialize(cells[columnIndex]);
          if (alignDelimiters === true) {
            size = stringLength(cell);
            sizes[columnIndex] = size;
            largest = longestCellByColumn[columnIndex];
            if (largest === void 0 || size > largest) {
              longestCellByColumn[columnIndex] = size;
            }
          }
          row.push(cell);
        }
        cellMatrix[rowIndex] = row;
        sizeMatrix[rowIndex] = sizes;
      }
      columnIndex = -1;
      columnLength = mostCellsPerRow;
      if (typeof align === "object" && "length" in align) {
        while (++columnIndex < columnLength) {
          alignments[columnIndex] = toAlignment(align[columnIndex]);
        }
      } else {
        code = toAlignment(align);
        while (++columnIndex < columnLength) {
          alignments[columnIndex] = code;
        }
      }
      columnIndex = -1;
      columnLength = mostCellsPerRow;
      row = [];
      sizes = [];
      while (++columnIndex < columnLength) {
        code = alignments[columnIndex];
        before = "";
        after = "";
        if (code === l) {
          before = colon;
        } else if (code === r) {
          after = colon;
        } else if (code === c) {
          before = colon;
          after = colon;
        }
        size = alignDelimiters ? Math.max(
          1,
          longestCellByColumn[columnIndex] - before.length - after.length
        ) : 1;
        cell = before + repeat(dash, size) + after;
        if (alignDelimiters === true) {
          size = before.length + size + after.length;
          if (size > longestCellByColumn[columnIndex]) {
            longestCellByColumn[columnIndex] = size;
          }
          sizes[columnIndex] = size;
        }
        row[columnIndex] = cell;
      }
      cellMatrix.splice(1, 0, row);
      sizeMatrix.splice(1, 0, sizes);
      rowIndex = -1;
      rowLength = cellMatrix.length;
      lines = [];
      while (++rowIndex < rowLength) {
        row = cellMatrix[rowIndex];
        sizes = sizeMatrix[rowIndex];
        columnIndex = -1;
        columnLength = mostCellsPerRow;
        line = [];
        while (++columnIndex < columnLength) {
          cell = row[columnIndex] || "";
          before = "";
          after = "";
          if (alignDelimiters === true) {
            size = longestCellByColumn[columnIndex] - (sizes[columnIndex] || 0);
            code = alignments[columnIndex];
            if (code === r) {
              before = repeat(space, size);
            } else if (code === c) {
              if (size % 2 === 0) {
                before = repeat(space, size / 2);
                after = before;
              } else {
                before = repeat(space, size / 2 + 0.5);
                after = repeat(space, size / 2 - 0.5);
              }
            } else {
              after = repeat(space, size);
            }
          }
          if (start === true && columnIndex === 0) {
            line.push(verticalBar);
          }
          if (padding === true && // Don’t add the opening space if we’re not aligning and the cell is
          // empty: there will be a closing space.
          !(alignDelimiters === false && cell === "") && (start === true || columnIndex !== 0)) {
            line.push(space);
          }
          if (alignDelimiters === true) {
            line.push(before);
          }
          line.push(cell);
          if (alignDelimiters === true) {
            line.push(after);
          }
          if (padding === true) {
            line.push(space);
          }
          if (end === true || columnIndex !== columnLength - 1) {
            line.push(verticalBar);
          }
        }
        line = line.join("");
        if (end === false) {
          line = line.replace(trailingWhitespace, "");
        }
        lines.push(line);
      }
      return lines.join(lineFeed);
    }
    __name(markdownTable, "markdownTable");
    function serialize(value) {
      return value === null || value === void 0 ? "" : String(value);
    }
    __name(serialize, "serialize");
    function defaultStringLength(value) {
      return value.length;
    }
    __name(defaultStringLength, "defaultStringLength");
    function toAlignment(value) {
      var code = typeof value === "string" ? value.charCodeAt(0) : x;
      return code === L || code === l ? l : code === R || code === r ? r : code === C || code === c ? c : x;
    }
    __name(toAlignment, "toAlignment");
  }
});

// ../node_modules/notion-to-md/build/utils/md.js
var require_md = __commonJS({
  "../node_modules/notion-to-md/build/utils/md.js"(exports) {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.table = exports.toggle = exports.divider = exports.addTabSpace = exports.image = exports.todo = exports.bullet = exports.callout = exports.quote = exports.heading3 = exports.heading2 = exports.heading1 = exports.equation = exports.codeBlock = exports.link = exports.underline = exports.strikethrough = exports.italic = exports.bold = exports.inlineEquation = exports.inlineCode = void 0;
    var markdown_table_1 = __importDefault(require_markdown_table());
    var node_fetch_1 = __importDefault(require_browser());
    var inlineCode = /* @__PURE__ */ __name((text) => {
      return `\`${text}\``;
    }, "inlineCode");
    exports.inlineCode = inlineCode;
    var inlineEquation = /* @__PURE__ */ __name((text) => {
      return `$${text}$`;
    }, "inlineEquation");
    exports.inlineEquation = inlineEquation;
    var bold = /* @__PURE__ */ __name((text) => {
      return `**${text}**`;
    }, "bold");
    exports.bold = bold;
    var italic = /* @__PURE__ */ __name((text) => {
      return `_${text}_`;
    }, "italic");
    exports.italic = italic;
    var strikethrough = /* @__PURE__ */ __name((text) => {
      return `~~${text}~~`;
    }, "strikethrough");
    exports.strikethrough = strikethrough;
    var underline = /* @__PURE__ */ __name((text) => {
      return `<u>${text}</u>`;
    }, "underline");
    exports.underline = underline;
    var link = /* @__PURE__ */ __name((text, href) => {
      return `[${text}](${href})`;
    }, "link");
    exports.link = link;
    var codeBlock = /* @__PURE__ */ __name((text, language) => {
      if (!text)
        return "";
      const lang = language && language.trim() ? language.toLowerCase() : "plaintext";
      return `\`\`\`${lang}
${text.trim()}
\`\`\``;
    }, "codeBlock");
    exports.codeBlock = codeBlock;
    var equation = /* @__PURE__ */ __name((text) => {
      return `$$
${text}
$$`;
    }, "equation");
    exports.equation = equation;
    var heading1 = /* @__PURE__ */ __name((text) => {
      return `# ${text}`;
    }, "heading1");
    exports.heading1 = heading1;
    var heading2 = /* @__PURE__ */ __name((text) => {
      return `## ${text}`;
    }, "heading2");
    exports.heading2 = heading2;
    var heading3 = /* @__PURE__ */ __name((text) => {
      return `### ${text}`;
    }, "heading3");
    exports.heading3 = heading3;
    var quote = /* @__PURE__ */ __name((text) => {
      return `> ${text.replace(/\n/g, "  \n> ")}`;
    }, "quote");
    exports.quote = quote;
    var callout = /* @__PURE__ */ __name((text, icon) => {
      let emoji;
      if ((icon === null || icon === void 0 ? void 0 : icon.type) === "emoji") {
        emoji = icon.emoji;
      }
      const formattedText = text.replace(/\n/g, "  \n> ");
      const formattedEmoji = emoji ? emoji + " " : "";
      const headingMatch = formattedText.match(/^(#{1,6})\s+([.*\s\S]+)/);
      if (headingMatch) {
        const headingLevel = headingMatch[1].length;
        const headingContent = headingMatch[2];
        return `> ${"#".repeat(headingLevel)} ${formattedEmoji}${headingContent}`;
      }
      return `> ${formattedEmoji}${formattedText}`;
    }, "callout");
    exports.callout = callout;
    var bullet = /* @__PURE__ */ __name((text, count) => {
      let renderText = text.trim();
      return count ? `${count}. ${renderText}` : `- ${renderText}`;
    }, "bullet");
    exports.bullet = bullet;
    var todo = /* @__PURE__ */ __name((text, checked) => {
      return checked ? `- [x] ${text}` : `- [ ] ${text}`;
    }, "todo");
    exports.todo = todo;
    var image = /* @__PURE__ */ __name(async (alt, href, convertToBase64 = false) => {
      if (!convertToBase64 || href.startsWith("data:")) {
        if (href.startsWith("data:")) {
          const base64 = href.split(",").pop();
          return `![${alt}](data:image/png;base64,${base64})`;
        }
        return `![${alt}](${href})`;
      } else {
        const res = await (0, node_fetch_1.default)(href);
        const buf = await res.arrayBuffer();
        const base64 = Buffer.from(buf).toString("base64");
        return `![${alt}](data:image/png;base64,${base64})`;
      }
    }, "image");
    exports.image = image;
    var addTabSpace = /* @__PURE__ */ __name((text, n = 0) => {
      const tab = "    ";
      for (let i = 0; i < n; i++) {
        if (text.includes("\n")) {
          const multiLineText = text.split(/(?:^|\n)/).join(`
${tab}`);
          text = tab + multiLineText;
        } else
          text = tab + text;
      }
      return text;
    }, "addTabSpace");
    exports.addTabSpace = addTabSpace;
    var divider = /* @__PURE__ */ __name(() => {
      return "---";
    }, "divider");
    exports.divider = divider;
    var toggle = /* @__PURE__ */ __name((summary, children) => {
      if (!summary)
        return children || "";
      return `<details>
<summary>${summary}</summary>
${children || ""}
</details>

`;
    }, "toggle");
    exports.toggle = toggle;
    var table = /* @__PURE__ */ __name((cells) => {
      return (0, markdown_table_1.default)(cells);
    }, "table");
    exports.table = table;
  }
});

// ../node_modules/notion-to-md/build/utils/notion.js
var require_notion = __commonJS({
  "../node_modules/notion-to-md/build/utils/notion.js"(exports) {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.modifyNumberedListObject = exports.getBlockChildren = void 0;
    var getBlockChildren = /* @__PURE__ */ __name(async (notionClient, block_id, totalPage) => {
      let result = [];
      let pageCount = 0;
      let start_cursor = void 0;
      do {
        const response = await notionClient.blocks.children.list({
          start_cursor,
          block_id
        });
        result.push(...response.results);
        start_cursor = response === null || response === void 0 ? void 0 : response.next_cursor;
        pageCount += 1;
      } while (start_cursor != null && (totalPage == null || pageCount < totalPage));
      (0, exports.modifyNumberedListObject)(result);
      return result;
    }, "getBlockChildren");
    exports.getBlockChildren = getBlockChildren;
    var modifyNumberedListObject = /* @__PURE__ */ __name((blocks) => {
      let numberedListIndex = 0;
      for (const block of blocks) {
        if ("type" in block && block.type === "numbered_list_item") {
          block.numbered_list_item.number = ++numberedListIndex;
        } else {
          numberedListIndex = 0;
        }
      }
    }, "modifyNumberedListObject");
    exports.modifyNumberedListObject = modifyNumberedListObject;
  }
});

// ../node_modules/notion-to-md/build/notion-to-md.js
var require_notion_to_md = __commonJS({
  "../node_modules/notion-to-md/build/notion-to-md.js"(exports) {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
          return m[k];
        }, "get") };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NotionToMarkdown = void 0;
    var md = __importStar(require_md());
    var notion_1 = require_notion();
    var NotionToMarkdown2 = class {
      static {
        __name(this, "NotionToMarkdown");
      }
      constructor(options) {
        this.notionClient = options.notionClient;
        const defaultConfig = {
          separateChildPage: false,
          convertImagesToBase64: false,
          parseChildPages: true
        };
        this.config = { ...defaultConfig, ...options.config };
        this.customTransformers = {};
      }
      setCustomTransformer(type, transformer) {
        this.customTransformers[type] = transformer;
        return this;
      }
      /**
       * Converts Markdown Blocks to string
       * @param {MdBlock[]} mdBlocks - Array of markdown blocks
       * @param {number} nestingLevel - Defines max depth of nesting
       * @returns {MdStringObject} - Returns markdown string with child pages separated
       */
      toMarkdownString(mdBlocks = [], pageIdentifier = "parent", nestingLevel = 0) {
        let mdOutput = {};
        mdBlocks.forEach((mdBlocks2) => {
          var _a;
          if (mdBlocks2.parent && mdBlocks2.type !== "toggle" && mdBlocks2.type !== "child_page") {
            if (mdBlocks2.type !== "to_do" && mdBlocks2.type !== "bulleted_list_item" && mdBlocks2.type !== "numbered_list_item" && mdBlocks2.type !== "quote") {
              mdOutput[pageIdentifier] = mdOutput[pageIdentifier] || "";
              mdOutput[pageIdentifier] += `
${md.addTabSpace(mdBlocks2.parent, nestingLevel)}

`;
            } else {
              mdOutput[pageIdentifier] = mdOutput[pageIdentifier] || "";
              mdOutput[pageIdentifier] += `${md.addTabSpace(mdBlocks2.parent, nestingLevel)}
`;
            }
          }
          if (mdBlocks2.children && mdBlocks2.children.length > 0) {
            if (mdBlocks2.type === "synced_block" || mdBlocks2.type === "column_list" || mdBlocks2.type === "column") {
              let mdstr = this.toMarkdownString(mdBlocks2.children, pageIdentifier);
              mdOutput[pageIdentifier] = mdOutput[pageIdentifier] || "";
              Object.keys(mdstr).forEach((key) => {
                if (mdOutput[key]) {
                  mdOutput[key] += mdstr[key];
                } else {
                  mdOutput[key] = mdstr[key];
                }
              });
            } else if (mdBlocks2.type === "child_page") {
              const childPageTitle = mdBlocks2.parent;
              let mdstr = this.toMarkdownString(mdBlocks2.children, childPageTitle);
              if (this.config.separateChildPage) {
                mdOutput = { ...mdOutput, ...mdstr };
              } else {
                mdOutput[pageIdentifier] = mdOutput[pageIdentifier] || "";
                if (mdstr[childPageTitle]) {
                  mdOutput[pageIdentifier] += `
${childPageTitle}
${mdstr[childPageTitle]}`;
                }
              }
            } else if (mdBlocks2.type === "toggle") {
              const toggle_children_md_string = this.toMarkdownString(mdBlocks2.children);
              mdOutput[pageIdentifier] = mdOutput[pageIdentifier] || "";
              mdOutput[pageIdentifier] += md.toggle(mdBlocks2.parent, toggle_children_md_string["parent"]);
            } else if (mdBlocks2.type === "quote") {
              let mdstr = this.toMarkdownString(mdBlocks2.children, pageIdentifier, nestingLevel);
              const formattedContent = ((_a = mdstr.parent) !== null && _a !== void 0 ? _a : mdstr[pageIdentifier]).split("\n").map((line) => line.trim() ? `> ${line}` : ">").join("\n").trim();
              mdOutput[pageIdentifier] = mdOutput[pageIdentifier] || "";
              if (pageIdentifier !== "parent" && mdstr["parent"]) {
                mdOutput[pageIdentifier] += formattedContent;
              } else if (mdstr[pageIdentifier]) {
                mdOutput[pageIdentifier] += formattedContent;
              }
              mdOutput[pageIdentifier] += "\n";
            } else if (mdBlocks2.type === "callout") {
            } else {
              let mdstr = this.toMarkdownString(mdBlocks2.children, pageIdentifier, nestingLevel + 1);
              mdOutput[pageIdentifier] = mdOutput[pageIdentifier] || "";
              if (pageIdentifier !== "parent" && mdstr["parent"]) {
                mdOutput[pageIdentifier] += mdstr["parent"];
              } else if (mdstr[pageIdentifier]) {
                mdOutput[pageIdentifier] += mdstr[pageIdentifier];
              }
            }
          }
        });
        return mdOutput;
      }
      /**
       * Retrieves Notion Blocks based on ID and converts them to Markdown Blocks
       * @param {string} id - notion page id (not database id)
       * @param {number} totalPage - Retrieve block children request number, page_size Maximum = totalPage * 100 (Default=null)
       * @returns {Promise<MdBlock[]>} - List of markdown blocks
       */
      async pageToMarkdown(id, totalPage = null) {
        if (!this.notionClient) {
          throw new Error("notion client is not provided, for more details check out https://github.com/souvikinator/notion-to-md");
        }
        const blocks = await (0, notion_1.getBlockChildren)(this.notionClient, id, totalPage);
        const parsedData = await this.blocksToMarkdown(blocks);
        return parsedData;
      }
      /**
       * Converts list of Notion Blocks to Markdown Blocks
       * @param {ListBlockChildrenResponseResults | undefined} blocks - List of notion blocks
       * @param {number} totalPage - Retrieve block children request number, page_size Maximum = totalPage * 100
       * @param {MdBlock[]} mdBlocks - Array of markdown blocks
       * @returns {Promise<MdBlock[]>} - Array of markdown blocks with their children
       */
      async blocksToMarkdown(blocks, totalPage = null, mdBlocks = []) {
        var _a, _b;
        if (!this.notionClient) {
          throw new Error("notion client is not provided, for more details check out https://github.com/souvikinator/notion-to-md");
        }
        if (!blocks)
          return mdBlocks;
        for (let i = 0; i < blocks.length; i++) {
          let block = blocks[i];
          if (
            // @ts-ignore
            block.type === "unsupported" || // @ts-ignore
            block.type === "child_page" && !this.config.parseChildPages
          ) {
            continue;
          }
          if ("has_children" in block && block.has_children) {
            const block_id = block.type == "synced_block" && ((_b = (_a = block.synced_block) === null || _a === void 0 ? void 0 : _a.synced_from) === null || _b === void 0 ? void 0 : _b.block_id) ? block.synced_block.synced_from.block_id : block.id;
            let child_blocks = await (0, notion_1.getBlockChildren)(this.notionClient, block_id, totalPage);
            mdBlocks.push({
              type: block.type,
              blockId: block.id,
              parent: await this.blockToMarkdown(block),
              children: []
            });
            if (!(block.type in this.customTransformers) && !this.customTransformers[block.type]) {
              let l = mdBlocks.length;
              await this.blocksToMarkdown(child_blocks, totalPage, mdBlocks[l - 1].children);
            }
            continue;
          }
          let tmp = await this.blockToMarkdown(block);
          mdBlocks.push({
            // @ts-ignore
            type: block.type,
            blockId: block.id,
            parent: tmp,
            children: []
          });
        }
        return mdBlocks;
      }
      /**
       * Converts a Notion Block to a Markdown Block
       * @param {ListBlockChildrenResponseResult} block - single notion block
       * @returns {string} corresponding markdown string of the passed block
       */
      async blockToMarkdown(block) {
        if (typeof block !== "object" || !("type" in block))
          return "";
        let parsedData = "";
        const { type } = block;
        if (type in this.customTransformers && !!this.customTransformers[type]) {
          const customTransformerValue = await this.customTransformers[type](block);
          if (typeof customTransformerValue === "string")
            return customTransformerValue;
        }
        switch (type) {
          case "image":
            {
              let blockContent = block.image;
              let image_title = "image";
              const image_caption_plain = blockContent.caption.map((item) => item.plain_text).join("");
              const image_type = blockContent.type;
              let link = "";
              if (image_type === "external") {
                link = blockContent.external.url;
              }
              if (image_type === "file") {
                link = blockContent.file.url;
              }
              if (image_caption_plain.trim().length > 0) {
                image_title = image_caption_plain;
              } else if (image_type === "file" || image_type === "external") {
                const matches = link.match(/[^\/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/);
                image_title = matches ? matches[0] : image_title;
              }
              return await md.image(image_title, link, this.config.convertImagesToBase64);
            }
            break;
          case "divider": {
            return md.divider();
          }
          case "equation": {
            return md.equation(block.equation.expression);
          }
          case "video":
          case "file":
          case "pdf":
            {
              let blockContent;
              let title = type;
              if (type === "video")
                blockContent = block.video;
              if (type === "file")
                blockContent = block.file;
              if (type === "pdf")
                blockContent = block.pdf;
              const caption = blockContent === null || blockContent === void 0 ? void 0 : blockContent.caption.map((item) => item.plain_text).join("");
              if (blockContent) {
                const file_type = blockContent.type;
                let link = "";
                if (file_type === "external")
                  link = blockContent.external.url;
                if (file_type === "file")
                  link = blockContent.file.url;
                if (caption && caption.trim().length > 0) {
                  title = caption;
                } else if (link) {
                  const matches = link.match(/[^\/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/);
                  title = matches ? matches[0] : type;
                }
                return md.link(title, link);
              }
            }
            break;
          case "bookmark":
          case "embed":
          case "link_preview":
          case "link_to_page":
            {
              let blockContent;
              let title = type;
              if (type === "bookmark")
                blockContent = block.bookmark;
              if (type === "embed")
                blockContent = block.embed;
              if (type === "link_preview")
                blockContent = block.link_preview;
              if (type === "link_to_page" && block.link_to_page.type === "page_id") {
                blockContent = {
                  url: `https://www.notion.so/${block.link_to_page.page_id}`
                };
              }
              if (blockContent)
                return md.link(title, blockContent.url);
            }
            break;
          case "child_page":
            {
              if (!this.config.parseChildPages)
                return "";
              let pageTitle = block.child_page.title;
              if (this.config.separateChildPage) {
                return pageTitle;
              }
              return md.heading2(pageTitle);
            }
            break;
          case "child_database":
            {
              let pageTitle = block.child_database.title || `child_database`;
              return pageTitle;
            }
            break;
          case "table": {
            const { id, has_children } = block;
            let tableArr = [];
            if (has_children) {
              const tableRows = await (0, notion_1.getBlockChildren)(this.notionClient, id, 100);
              let rowsPromise = tableRows === null || tableRows === void 0 ? void 0 : tableRows.map(async (row) => {
                const { type: type2 } = row;
                if (type2 !== "table_row")
                  return;
                const cells = row.table_row["cells"];
                let cellStringPromise = cells.map(async (cell) => await this.blockToMarkdown({
                  type: "paragraph",
                  paragraph: { rich_text: cell }
                }));
                const cellStringArr = await Promise.all(cellStringPromise);
                tableArr.push(cellStringArr);
              });
              await Promise.all(rowsPromise || []);
            }
            return md.table(tableArr);
          }
          // Rest of the types
          // "paragraph"
          // "heading_1"
          // "heading_2"
          // "heading_3"
          // "bulleted_list_item"
          // "numbered_list_item"
          // "quote"
          // "to_do"
          // "template"
          // "synced_block"
          // "child_page"
          // "child_database"
          // "code"
          // "callout"
          // "breadcrumb"
          // "table_of_contents"
          // "link_to_page"
          // "audio"
          // "unsupported"
          default: {
            let blockContent = block[type].text || block[type].rich_text || [];
            blockContent.map((content) => {
              if (content.type === "equation") {
                parsedData += md.inlineEquation(content.equation.expression);
                return;
              }
              const annotations = content.annotations;
              let plain_text = content.plain_text;
              plain_text = this.annotatePlainText(plain_text, annotations);
              if (content["href"])
                plain_text = md.link(plain_text, content["href"]);
              parsedData += plain_text;
            });
          }
        }
        switch (type) {
          case "code":
            {
              const codeContent = block.code.rich_text.map((t) => t.plain_text).join("\n");
              const language = block.code.language || "plaintext";
              parsedData = md.codeBlock(codeContent, language);
            }
            break;
          case "heading_1":
            {
              parsedData = md.heading1(parsedData);
            }
            break;
          case "heading_2":
            {
              parsedData = md.heading2(parsedData);
            }
            break;
          case "heading_3":
            {
              parsedData = md.heading3(parsedData);
            }
            break;
          case "quote":
            {
              parsedData = md.quote(parsedData);
            }
            break;
          case "callout":
            {
              const { id, has_children } = block;
              let callout_string = "";
              if (!has_children) {
                return md.callout(parsedData, block[type].icon);
              }
              const callout_children_object = await (0, notion_1.getBlockChildren)(this.notionClient, id, 100);
              const callout_children = await this.blocksToMarkdown(callout_children_object);
              callout_string += `${parsedData}
`;
              callout_children.map((child) => {
                callout_string += `${child.parent}

`;
              });
              parsedData = md.callout(callout_string.trim(), block[type].icon);
            }
            break;
          case "bulleted_list_item":
            {
              parsedData = md.bullet(parsedData);
            }
            break;
          case "numbered_list_item":
            {
              parsedData = md.bullet(parsedData, block.numbered_list_item.number);
            }
            break;
          case "to_do":
            {
              parsedData = md.todo(parsedData, block.to_do.checked);
            }
            break;
        }
        return parsedData;
      }
      /**
       * Annoate text using provided annotations
       * @param {string} text - String to be annotated
       * @param {Annotations} annotations - Annotation object of a notion block
       * @returns {string} - Annotated text
       */
      annotatePlainText(text, annotations) {
        if (text.match(/^\s*$/))
          return text;
        const leadingSpaceMatch = text.match(/^(\s*)/);
        const trailingSpaceMatch = text.match(/(\s*)$/);
        const leading_space = leadingSpaceMatch ? leadingSpaceMatch[0] : "";
        const trailing_space = trailingSpaceMatch ? trailingSpaceMatch[0] : "";
        text = text.trim();
        if (text !== "") {
          if (annotations.code)
            text = md.inlineCode(text);
          if (annotations.bold)
            text = md.bold(text);
          if (annotations.italic)
            text = md.italic(text);
          if (annotations.strikethrough)
            text = md.strikethrough(text);
          if (annotations.underline)
            text = md.underline(text);
        }
        return leading_space + text + trailing_space;
      }
    };
    exports.NotionToMarkdown = NotionToMarkdown2;
  }
});

// ../node_modules/notion-to-md/build/index.js
var require_build = __commonJS({
  "../node_modules/notion-to-md/build/index.js"(exports) {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
          return m[k];
        }, "get") };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_notion_to_md(), exports);
  }
});

// api/translate.ts
var import_client, import_notion_to_md, onRequestPost2;
var init_translate = __esm({
  "api/translate.ts"() {
    "use strict";
    init_functionsRoutes_0_7975518007531279();
    init_checked_fetch();
    import_client = __toESM(require_src());
    import_notion_to_md = __toESM(require_build());
    onRequestPost2 = /* @__PURE__ */ __name(async (context) => {
      const { request, env } = context;
      const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type"
      };
      if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
      }
      try {
        const { articleId, targetLang, title } = await request.json();
        if (!articleId || !targetLang) {
          return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders });
        }
        if (!env.NOTION_API_KEY || !env.NOTION_TRANSLATIONS_DATABASE_ID) {
          return new Response(JSON.stringify({ error: "Server misconfigured (missing env vars)" }), { status: 500, headers: corsHeaders });
        }
        const notion = new import_client.Client({ auth: env.NOTION_API_KEY });
        const n2m = new import_notion_to_md.NotionToMarkdown({ notionClient: notion });
        const mdblocks = await n2m.pageToMarkdown(articleId);
        const mdString = n2m.toMarkdownString(mdblocks);
        if (!mdString.parent) {
          return new Response(JSON.stringify({ error: "No content found to translate" }), { status: 400, headers: corsHeaders });
        }
        const contentToTranslate = mdString.parent.slice(0, 6e3);
        const contentPrompt = `Translate the following Markdown content to ${targetLang === "zh" ? "Chinese" : "English"}. Keep the markdown formatting exactly as is. Do not add any conversational text or explanations. Just the translation. 

${contentToTranslate}`;
        const contentResponse = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
          messages: [
            { role: "system", content: "You are a professional translator. Translate the markdown content accurately while preserving formatting." },
            { role: "user", content: contentPrompt }
          ]
        });
        const translatedContent = contentResponse.response;
        const titleResponse = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
          messages: [
            { role: "system", content: "Translate the title." },
            { role: "user", content: `Translate this title to ${targetLang === "zh" ? "Chinese" : "English"}: "${title}"` }
          ]
        });
        const translatedTitle = titleResponse.response.replace(/^"|"$/g, "").trim();
        const blocks = translatedContent.split("\n\n").filter((p) => p.trim()).map((p) => ({
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{ text: { content: p.substring(0, 2e3) } }]
          }
        }));
        const newPage = await notion.pages.create({
          parent: { database_id: env.NOTION_TRANSLATIONS_DATABASE_ID },
          properties: {
            Name: { title: [{ text: { content: translatedTitle } }] },
            Language: { select: { name: targetLang } },
            Original_ID: { rich_text: [{ text: { content: articleId } }] },
            Date: { date: { start: (/* @__PURE__ */ new Date()).toISOString() } },
            // Use original slug + lang suffix
            Slug: { rich_text: [{ text: { content: `${translatedTitle.replace(/\s+/g, "-").toLowerCase()}-${targetLang}` } }] }
          },
          children: blocks
        });
        return new Response(JSON.stringify({ success: true, pageId: newPage.id }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Translation failed: " + error }), { status: 500, headers: corsHeaders });
      }
    }, "onRequestPost");
  }
});

// ../.wrangler/tmp/pages-8xjXzU/functionsRoutes-0.7975518007531279.mjs
var routes;
var init_functionsRoutes_0_7975518007531279 = __esm({
  "../.wrangler/tmp/pages-8xjXzU/functionsRoutes-0.7975518007531279.mjs"() {
    "use strict";
    init_summary();
    init_translate();
    routes = [
      {
        routePath: "/api/summary",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost]
      },
      {
        routePath: "/api/translate",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost2]
      }
    ];
  }
});

// ../.wrangler/tmp/bundle-oTSwTO/middleware-loader.entry.ts
init_functionsRoutes_0_7975518007531279();
init_checked_fetch();

// ../.wrangler/tmp/bundle-oTSwTO/middleware-insertion-facade.js
init_functionsRoutes_0_7975518007531279();
init_checked_fetch();

// ../node_modules/wrangler/templates/pages-template-worker.ts
init_functionsRoutes_0_7975518007531279();
init_checked_fetch();

// ../node_modules/path-to-regexp/dist.es2015/index.js
init_functionsRoutes_0_7975518007531279();
init_checked_fetch();
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_functionsRoutes_0_7975518007531279();
init_checked_fetch();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_functionsRoutes_0_7975518007531279();
init_checked_fetch();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-oTSwTO/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../node_modules/wrangler/templates/middleware/common.ts
init_functionsRoutes_0_7975518007531279();
init_checked_fetch();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-oTSwTO/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
/*! Bundled license information:

repeat-string/index.js:
  (*!
   * repeat-string <https://github.com/jonschlinkert/repeat-string>
   *
   * Copyright (c) 2014-2015, Jon Schlinkert.
   * Licensed under the MIT License.
   *)
*/
//# sourceMappingURL=functionsWorker-0.008616470551509936.mjs.map
