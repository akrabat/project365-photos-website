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
var Vpc_exports = {};
__export(Vpc_exports, {
  Vpc: () => Vpc
});
module.exports = __toCommonJS(Vpc_exports);
var import_aws_ec2 = require("aws-cdk-lib/aws-ec2");
const VPC_DEFINITION = {
  type: "object",
  properties: {
    type: { const: "vpc" }
  },
  additionalProperties: false,
  required: []
};
class Vpc extends import_aws_ec2.Vpc {
  constructor(scope, id, configuration, provider) {
    super(scope, id, {
      maxAzs: 2
    });
    this.provider = provider;
    this.appSecurityGroup = new import_aws_ec2.SecurityGroup(this, "AppSecurityGroup", {
      vpc: this
    });
    this.appSecurityGroup.addEgressRule(import_aws_ec2.Peer.anyIpv4(), import_aws_ec2.Port.allTraffic());
    provider.setVpcConfig(
      [this.appSecurityGroup.securityGroupId],
      this.privateSubnets.map((subnet) => subnet.subnetId)
    );
  }
  static create(provider, id, configuration) {
    return new this(provider.stack, id, configuration, provider);
  }
  outputs() {
    return {};
  }
}
Vpc.type = "vpc";
Vpc.schema = VPC_DEFINITION;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Vpc
});
//# sourceMappingURL=Vpc.js.map
