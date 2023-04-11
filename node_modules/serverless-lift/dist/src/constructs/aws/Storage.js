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
var Storage_exports = {};
__export(Storage_exports, {
  Storage: () => Storage
});
module.exports = __toCommonJS(Storage_exports);
var import_aws_s3 = require("aws-cdk-lib/aws-s3");
var import_aws_cdk_lib = require("aws-cdk-lib");
var import_abstracts = require("../abstracts");
var import_CloudFormation = require("../../CloudFormation");
const STORAGE_DEFINITION = {
  type: "object",
  properties: {
    type: { const: "storage" },
    archive: { type: "number", minimum: 30 },
    encryption: {
      anyOf: [{ const: "s3" }, { const: "kms" }]
    }
  },
  additionalProperties: false
};
const STORAGE_DEFAULTS = {
  type: "storage",
  archive: 45,
  encryption: "s3"
};
class Storage extends import_abstracts.AwsConstruct {
  constructor(scope, id, configuration, provider) {
    super(scope, id);
    this.provider = provider;
    const resolvedConfiguration = Object.assign({}, STORAGE_DEFAULTS, configuration);
    const encryptionOptions = {
      s3: import_aws_s3.BucketEncryption.S3_MANAGED,
      kms: import_aws_s3.BucketEncryption.KMS_MANAGED
    };
    this.bucket = new import_aws_s3.Bucket(this, "Bucket", {
      encryption: encryptionOptions[resolvedConfiguration.encryption],
      versioned: true,
      blockPublicAccess: import_aws_s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      lifecycleRules: [
        {
          transitions: [
            {
              storageClass: import_aws_s3.StorageClass.INTELLIGENT_TIERING,
              transitionAfter: import_aws_cdk_lib.Duration.days(0)
            }
          ]
        },
        {
          noncurrentVersionExpiration: import_aws_cdk_lib.Duration.days(30)
        }
      ]
    });
    this.bucketNameOutput = new import_aws_cdk_lib.CfnOutput(this, "BucketName", {
      value: this.bucket.bucketName
    });
  }
  variables() {
    return {
      bucketArn: this.bucket.bucketArn,
      bucketName: this.bucket.bucketName
    };
  }
  permissions() {
    return [
      new import_CloudFormation.PolicyStatement(
        ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:ListBucket"],
        [this.bucket.bucketArn, import_aws_cdk_lib.Stack.of(this).resolve(import_aws_cdk_lib.Fn.join("/", [this.bucket.bucketArn, "*"]))]
      )
    ];
  }
  outputs() {
    return {
      bucketName: () => this.getBucketName()
    };
  }
  extend() {
    return {
      bucket: this.bucket.node.defaultChild
    };
  }
  async getBucketName() {
    return this.provider.getStackOutput(this.bucketNameOutput);
  }
}
Storage.type = "storage";
Storage.schema = STORAGE_DEFINITION;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Storage
});
//# sourceMappingURL=Storage.js.map
