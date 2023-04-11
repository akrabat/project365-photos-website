"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var logger_exports = {};
__export(logger_exports, {
  getUtils: () => getUtils,
  setUtils: () => setUtils
});
module.exports = __toCommonJS(logger_exports);
var import_chalk = __toESM(require("chalk"));
let utils;
function createLegacyUtils() {
  const logger = (message) => {
    if (Array.isArray(message)) {
      message = message.join("\n");
    }
    console.log("Lift: " + import_chalk.default.yellow(message));
  };
  logger.debug = (message) => {
    if (process.env.SLS_DEBUG !== void 0) {
      if (Array.isArray(message)) {
        message = message.join("\n");
      }
      console.log(import_chalk.default.gray("Lift: " + (message != null ? message : "")));
    }
  };
  logger.verbose = logger.debug;
  logger.success = logger;
  logger.warning = logger;
  logger.error = logger;
  logger.get = () => logger;
  return {
    writeText: logger,
    log: logger
  };
}
function setUtils(u) {
  utils = u;
}
function getUtils() {
  if (utils === void 0) {
    utils = createLegacyUtils();
  }
  return utils;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getUtils,
  setUtils
});
//# sourceMappingURL=logger.js.map
