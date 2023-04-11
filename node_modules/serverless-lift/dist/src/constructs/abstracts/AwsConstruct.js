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
var AwsConstruct_exports = {};
__export(AwsConstruct_exports, {
  AwsConstruct: () => AwsConstruct
});
module.exports = __toCommonJS(AwsConstruct_exports);
var import_constructs = require("constructs");
var import_lodash = require("lodash");
var import_traverse = require("traverse");
var import_error = __toESM(require("../../utils/error"));
class AwsConstruct extends import_constructs.Construct {
  applyExtensions(extensions) {
    const availableExtensions = this.extend();
    if ((0, import_lodash.isEmpty)(extensions) || (0, import_lodash.isEmpty)(availableExtensions)) {
      return;
    }
    Object.entries(extensions).forEach(([extensionKey, extensionObject]) => {
      if (!Object.keys(availableExtensions).includes(extensionKey)) {
        throw new import_error.default(
          `There is no extension '${extensionKey}' available on this construct. Available extensions are: ${Object.keys(
            availableExtensions
          ).join(", ")}.`,
          "LIFT_UNKNOWN_EXTENSION"
        );
      }
      if ((0, import_lodash.isObject)(extensionObject)) {
        const accumulatedPathsPointingToArray = [];
        (0, import_traverse.paths)(extensionObject).filter((path) => !(0, import_lodash.isEmpty)(path)).map((path) => {
          return path.join(".");
        }).filter((path) => {
          if (accumulatedPathsPointingToArray.some(
            (previouslySelectedPath) => path.startsWith(previouslySelectedPath)
          )) {
            return false;
          }
          const pointedValue = (0, import_lodash.get)(extensionObject, path);
          const isPathPointingToArray = (0, import_lodash.isArray)(pointedValue);
          if (isPathPointingToArray) {
            accumulatedPathsPointingToArray.push(path);
            return true;
          }
          const isPathPointingToLeaf = !(0, import_lodash.isObject)(pointedValue);
          return isPathPointingToLeaf;
        }).map((path) => {
          availableExtensions[extensionKey].addOverride(path, (0, import_lodash.get)(extensionObject, path));
        });
      }
    });
  }
  static create(provider, id, configuration) {
    var _a;
    const construct = new this(provider.stack, id, configuration, provider);
    construct.applyExtensions((_a = configuration.extensions) != null ? _a : {});
    return construct;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AwsConstruct
});
//# sourceMappingURL=AwsConstruct.js.map
