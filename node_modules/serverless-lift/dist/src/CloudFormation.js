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
var CloudFormation_exports = {};
__export(CloudFormation_exports, {
  PolicyStatement: () => PolicyStatement,
  getStackOutput: () => getStackOutput
});
module.exports = __toCommonJS(CloudFormation_exports);
var import_aws_cdk_lib = require("aws-cdk-lib");
var import_logger = require("./utils/logger");
async function getStackOutput(aws, output) {
  var _a;
  const outputId = import_aws_cdk_lib.Stack.of(output.stack).resolve(output.logicalId);
  const stackName = aws.stackName;
  (0, import_logger.getUtils)().log.debug(`Fetching output "${outputId}" in stack "${stackName}"`);
  let data;
  try {
    data = await aws.request("CloudFormation", "describeStacks", {
      StackName: stackName
    });
  } catch (e) {
    if (e instanceof Error && e.message === `Stack with id ${stackName} does not exist`) {
      (0, import_logger.getUtils)().log.debug(e.message);
      return void 0;
    }
    throw e;
  }
  const outputs = (_a = data.Stacks) == null ? void 0 : _a[0].Outputs;
  if (!outputs) {
    return void 0;
  }
  for (const item of outputs) {
    if (item.OutputKey === outputId) {
      return item.OutputValue;
    }
  }
  return void 0;
}
class PolicyStatement {
  constructor(Action, Resource) {
    this.Effect = "Allow";
    this.Action = Action;
    this.Resource = Resource;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PolicyStatement,
  getStackOutput
});
//# sourceMappingURL=CloudFormation.js.map
