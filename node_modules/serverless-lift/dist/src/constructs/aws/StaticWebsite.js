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
var StaticWebsite_exports = {};
__export(StaticWebsite_exports, {
  StaticWebsite: () => StaticWebsite
});
module.exports = __toCommonJS(StaticWebsite_exports);
var cloudfront = __toESM(require("aws-cdk-lib/aws-cloudfront"));
var import_aws_cloudfront = require("aws-cdk-lib/aws-cloudfront");
var import_aws_cdk_lib = require("aws-cdk-lib");
var import_cloudfrontFunctions = require("../../classes/cloudfrontFunctions");
var import_getDefaultCfnFunctionAssociations = require("../../utils/getDefaultCfnFunctionAssociations");
var import_naming = require("../../utils/naming");
var import_StaticWebsiteAbstract = require("./abstracts/StaticWebsiteAbstract");
class StaticWebsite extends import_StaticWebsiteAbstract.StaticWebsiteAbstract {
  constructor(scope, id, configuration, provider) {
    super(scope, id, configuration, provider);
    this.id = id;
    this.configuration = configuration;
    this.provider = provider;
    const cfnDistribution = this.distribution.node.defaultChild;
    const requestFunction = this.createRequestFunction();
    if (requestFunction === null) {
      return;
    }
    const defaultBehaviorFunctionAssociations = (0, import_getDefaultCfnFunctionAssociations.getCfnFunctionAssociations)(cfnDistribution);
    cfnDistribution.addOverride("Properties.DistributionConfig.DefaultCacheBehavior.FunctionAssociations", [
      ...defaultBehaviorFunctionAssociations,
      { EventType: import_aws_cloudfront.FunctionEventType.VIEWER_REQUEST, FunctionARN: requestFunction.functionArn }
    ]);
  }
  createRequestFunction() {
    let additionalCode = "";
    if (this.configuration.redirectToMainDomain === true) {
      additionalCode += (0, import_cloudfrontFunctions.redirectToMainDomain)(this.domains);
    }
    if (additionalCode === "") {
      return null;
    }
    const code = `function handler(event) {
    var request = event.request;${additionalCode}
    return request;
}`;
    const functionName = (0, import_naming.ensureNameMaxLength)(
      `${this.provider.stackName}-${this.provider.region}-${this.id}-request`,
      64
    );
    return new cloudfront.Function(this, "RequestFunction", {
      functionName,
      code: cloudfront.FunctionCode.fromInline(code)
    });
  }
  getBucketProps() {
    return {
      // Enable static website hosting
      websiteIndexDocument: "index.html",
      websiteErrorDocument: this.errorPath(),
      // public read access is required when enabling static website hosting
      publicReadAccess: true,
      // For a static website, the content is code that should be versioned elsewhere
      removalPolicy: import_aws_cdk_lib.RemovalPolicy.DESTROY
    };
  }
}
StaticWebsite.type = "static-website";
StaticWebsite.schema = import_StaticWebsiteAbstract.COMMON_STATIC_WEBSITE_DEFINITION;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StaticWebsite
});
//# sourceMappingURL=StaticWebsite.js.map
