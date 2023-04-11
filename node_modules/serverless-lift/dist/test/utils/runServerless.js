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
var runServerless_exports = {};
__export(runServerless_exports, {
  baseConfig: () => baseConfig,
  pluginConfigExt: () => pluginConfigExt,
  runServerless: () => runServerless
});
module.exports = __toCommonJS(runServerless_exports);
var import_path = __toESM(require("path"));
var import_aws_cdk_lib = require("aws-cdk-lib");
var import_setup_run_serverless_fixtures_engine = __toESM(require("@serverless/test/setup-run-serverless-fixtures-engine"));
const computeLogicalId = (serverless, ...address) => {
  const initialNode = serverless.stack.node;
  const foundNode = [...address].reduce((currentNode, nextNodeId) => {
    const nextNode = currentNode.tryFindChild(nextNodeId);
    if (!nextNode) {
      const existingNodes = currentNode.children.map((child) => child.node.id).join(", ");
      throw new Error(
        `No node named ${nextNodeId} found in ${address.join(".")} address. Existing nodes: ${existingNodes}`
      );
    }
    return nextNode.node;
  }, initialNode);
  const resourceNode = foundNode.tryFindChild("Resource");
  if (resourceNode) {
    return import_aws_cdk_lib.Names.nodeUniqueId(resourceNode.node);
  }
  return import_aws_cdk_lib.Names.nodeUniqueId(foundNode);
};
const runServerless = async (options) => {
  const runServerlessReturnValues = await (0, import_setup_run_serverless_fixtures_engine.default)({
    fixturesDir: import_path.default.resolve(__dirname, "../fixtures"),
    serverlessDir: import_path.default.resolve(__dirname, "../../node_modules/serverless")
  })(options);
  return {
    ...runServerlessReturnValues,
    computeLogicalId: (...address) => computeLogicalId(runServerlessReturnValues.serverless, ...address)
  };
};
const pluginConfigExt = {
  plugins: [import_path.default.join(process.cwd(), "src/plugin.ts")]
};
const baseConfig = {
  service: "app",
  provider: {
    name: "aws"
  },
  plugins: [import_path.default.join(process.cwd(), "src/plugin.ts")]
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  baseConfig,
  pluginConfigExt,
  runServerless
});
//# sourceMappingURL=runServerless.js.map
