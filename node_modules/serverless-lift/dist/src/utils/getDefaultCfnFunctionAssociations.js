"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var getDefaultCfnFunctionAssociations_exports = {};
__export(getDefaultCfnFunctionAssociations_exports, {
  getCfnFunctionAssociations: () => getCfnFunctionAssociations
});
module.exports = __toCommonJS(getDefaultCfnFunctionAssociations_exports);
function cdkFunctionAssociationToCfnFunctionAssociation({
  eventType,
  functionArn
}) {
  if (eventType === void 0 || functionArn === void 0) {
    throw new Error("eventType and functionArn must be defined");
  }
  return {
    EventType: eventType,
    FunctionARN: functionArn
  };
}
function getCfnFunctionAssociations(distribution) {
  const defaultBehavior = distribution.distributionConfig.defaultCacheBehavior;
  return defaultBehavior.functionAssociations.map(
    cdkFunctionAssociationToCfnFunctionAssociation
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCfnFunctionAssociations
});
//# sourceMappingURL=getDefaultCfnFunctionAssociations.js.map
