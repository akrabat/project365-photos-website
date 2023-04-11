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
var StaticWebsiteAbstract_exports = {};
__export(StaticWebsiteAbstract_exports, {
  COMMON_STATIC_WEBSITE_DEFINITION: () => COMMON_STATIC_WEBSITE_DEFINITION,
  StaticWebsiteAbstract: () => StaticWebsiteAbstract
});
module.exports = __toCommonJS(StaticWebsiteAbstract_exports);
var acm = __toESM(require("aws-cdk-lib/aws-certificatemanager"));
var cloudfront = __toESM(require("aws-cdk-lib/aws-cloudfront"));
var import_aws_cloudfront = require("aws-cdk-lib/aws-cloudfront");
var import_aws_cloudfront_origins = require("aws-cdk-lib/aws-cloudfront-origins");
var import_aws_s3 = require("aws-cdk-lib/aws-s3");
var import_aws_cdk_lib = require("aws-cdk-lib");
var import_aws_cdk_lib2 = require("aws-cdk-lib");
var import_abstracts = require("../../abstracts");
var import_chalk = __toESM(require("chalk"));
var import_lodash = require("lodash");
var import_aws = require("../../../classes/aws");
var import_error = __toESM(require("../../../utils/error"));
var import_logger = require("../../../utils/logger");
var import_naming = require("../../../utils/naming");
var import_s3_sync = require("../../../utils/s3-sync");
const COMMON_STATIC_WEBSITE_DEFINITION = {
  type: "object",
  properties: {
    path: { type: "string" },
    domain: {
      anyOf: [
        { type: "string" },
        {
          type: "array",
          items: { type: "string" }
        }
      ]
    },
    certificate: { type: "string" },
    security: {
      type: "object",
      properties: {
        allowIframe: { type: "boolean" }
      },
      additionalProperties: false
    },
    errorPage: { type: "string" },
    redirectToMainDomain: { type: "boolean" }
  },
  additionalProperties: false,
  required: ["path"]
};
const _StaticWebsiteAbstract = class extends import_abstracts.AwsConstruct {
  constructor(scope, id, configuration, provider) {
    super(scope, id);
    this.id = id;
    this.configuration = configuration;
    this.provider = provider;
    const bucketProps = this.getBucketProps();
    this.bucket = new import_aws_s3.Bucket(this, "Bucket", bucketProps);
    this.domains = configuration.domain !== void 0 && configuration.domain.length > 0 ? (0, import_lodash.flatten)([configuration.domain]) : void 0;
    const certificate = configuration.certificate !== void 0 && configuration.certificate !== "" ? acm.Certificate.fromCertificateArn(this, "Certificate", configuration.certificate) : void 0;
    if (this.domains !== void 0 && certificate === void 0) {
      throw new import_error.default(
        `Invalid configuration for the static website '${id}': if a domain is configured, then a certificate ARN must be configured in the 'certificate' option.
See https://github.com/getlift/lift/blob/master/docs/static-website.md#custom-domain`,
        "LIFT_INVALID_CONSTRUCT_CONFIGURATION"
      );
    }
    const functionAssociations = [
      {
        function: this.createResponseFunction(),
        eventType: import_aws_cloudfront.FunctionEventType.VIEWER_RESPONSE
      }
    ];
    this.distribution = new import_aws_cloudfront.Distribution(this, "CDN", {
      comment: `${provider.stackName} ${id} website CDN`,
      // Send all page requests to index.html
      defaultRootObject: "index.html",
      defaultBehavior: {
        // Origins are where CloudFront fetches content
        origin: new import_aws_cloudfront_origins.S3Origin(this.bucket),
        allowedMethods: import_aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        // Use the "Managed-CachingOptimized" policy
        // See https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-policies-list
        cachePolicy: import_aws_cloudfront.CachePolicy.CACHING_OPTIMIZED,
        viewerProtocolPolicy: import_aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations
      },
      errorResponses: [this.errorResponse()],
      // Enable http2 transfer for better performances
      httpVersion: import_aws_cloudfront.HttpVersion.HTTP2,
      certificate,
      domainNames: this.domains
    });
    this.bucketNameOutput = new import_aws_cdk_lib2.CfnOutput(this, "BucketName", {
      description: "Name of the bucket that stores the static website.",
      value: this.bucket.bucketName
    });
    let websiteDomain = this.distribution.distributionDomainName;
    if (this.domains !== void 0) {
      websiteDomain = this.domains[0];
    }
    this.domainOutput = new import_aws_cdk_lib2.CfnOutput(this, "Domain", {
      description: "Website domain name.",
      value: websiteDomain
    });
    this.cnameOutput = new import_aws_cdk_lib2.CfnOutput(this, "CloudFrontCName", {
      description: "CloudFront CNAME.",
      value: this.distribution.distributionDomainName
    });
    this.distributionIdOutput = new import_aws_cdk_lib2.CfnOutput(this, "DistributionId", {
      description: "ID of the CloudFront distribution.",
      value: this.distribution.distributionId
    });
  }
  variables() {
    return {
      cname: this.distribution.distributionDomainName,
      assetsBucketName: this.bucket.bucketName
    };
  }
  outputs() {
    return {
      url: () => this.getUrl(),
      cname: () => this.getCName()
    };
  }
  extend() {
    return {
      distribution: this.distribution.node.defaultChild,
      bucket: this.bucket.node.defaultChild
    };
  }
  async postDeploy() {
    await this.uploadWebsite();
  }
  async uploadWebsiteCommand() {
    (0, import_logger.getUtils)().log(`Deploying the static website '${this.id}'`);
    const fileChangeCount = await this.uploadWebsite();
    const domain = await this.getDomain();
    if (domain !== void 0) {
      (0, import_logger.getUtils)().log();
      (0, import_logger.getUtils)().log.success(`Deployed https://${domain} ${import_chalk.default.gray(`(${fileChangeCount} files changed)`)}`);
    }
  }
  async uploadWebsite() {
    const bucketName = await this.getBucketName();
    if (bucketName === void 0) {
      throw new import_error.default(
        `Could not find the bucket in which to deploy the '${this.id}' website: did you forget to run 'serverless deploy' first?`,
        "LIFT_MISSING_STACK_OUTPUT"
      );
    }
    const progress = (0, import_logger.getUtils)().progress;
    let uploadProgress;
    if (progress) {
      uploadProgress = progress.create({
        message: `Uploading directory '${this.configuration.path}' to bucket '${bucketName}'`
      });
      (0, import_logger.getUtils)().log.verbose(`Uploading directory '${this.configuration.path}' to bucket '${bucketName}'`);
    } else {
      (0, import_logger.getUtils)().log(`Uploading directory '${this.configuration.path}' to bucket '${bucketName}'`);
    }
    const { hasChanges, fileChangeCount } = await (0, import_s3_sync.s3Sync)({
      aws: this.provider,
      localPath: this.configuration.path,
      bucketName
    });
    if (hasChanges) {
      if (uploadProgress) {
        uploadProgress.update(`Clearing CloudFront DNS cache`);
      } else {
        (0, import_logger.getUtils)().log(`Clearing CloudFront DNS cache`);
      }
      await this.clearCDNCache();
    }
    if (uploadProgress) {
      uploadProgress.remove();
    }
    return fileChangeCount;
  }
  async clearCDNCache() {
    const distributionId = await this.getDistributionId();
    if (distributionId === void 0) {
      return;
    }
    await (0, import_aws.invalidateCloudFrontCache)(this.provider, distributionId);
  }
  async preRemove() {
    const bucketName = await this.getBucketName();
    if (bucketName === void 0) {
      return;
    }
    (0, import_logger.getUtils)().log(
      `Emptying S3 bucket '${bucketName}' for the '${this.id}' static website, else CloudFormation will fail (it cannot delete a non-empty bucket)`
    );
    await (0, import_aws.emptyBucket)(this.provider, bucketName);
  }
  async getUrl() {
    const domain = await this.getDomain();
    if (domain === void 0) {
      return void 0;
    }
    return `https://${domain}`;
  }
  async getBucketName() {
    return this.provider.getStackOutput(this.bucketNameOutput);
  }
  async getDomain() {
    return this.provider.getStackOutput(this.domainOutput);
  }
  async getCName() {
    return this.provider.getStackOutput(this.cnameOutput);
  }
  async getDistributionId() {
    return this.provider.getStackOutput(this.distributionIdOutput);
  }
  errorPath() {
    if (this.configuration.errorPage !== void 0) {
      let errorPath = this.configuration.errorPage;
      if (errorPath.startsWith("./") || errorPath.startsWith("../")) {
        throw new import_error.default(
          `The 'errorPage' option of the '${this.id}' static website cannot start with './' or '../'. (it cannot be a relative path).`,
          "LIFT_INVALID_CONSTRUCT_CONFIGURATION"
        );
      }
      if (!errorPath.startsWith("/")) {
        errorPath = `/${errorPath}`;
      }
      return errorPath;
    }
  }
  errorResponse() {
    const errorPath = this.errorPath();
    if (errorPath !== void 0) {
      return {
        httpStatus: 404,
        ttl: import_aws_cdk_lib.Duration.seconds(0),
        responseHttpStatus: 404,
        responsePagePath: errorPath
      };
    }
    return {
      httpStatus: 404,
      ttl: import_aws_cdk_lib.Duration.seconds(0),
      responseHttpStatus: 200,
      responsePagePath: "/index.html"
    };
  }
  createResponseFunction() {
    var _a;
    const securityHeaders = {
      "x-frame-options": { value: "SAMEORIGIN" },
      "x-content-type-options": { value: "nosniff" },
      "x-xss-protection": { value: "1; mode=block" },
      "strict-transport-security": { value: "max-age=63072000" }
    };
    if (((_a = this.configuration.security) == null ? void 0 : _a.allowIframe) === true) {
      delete securityHeaders["x-frame-options"];
    }
    const jsonHeaders = JSON.stringify(securityHeaders, void 0, 4);
    const code = `function handler(event) {
    var response = event.response;
    response.headers = Object.assign({}, ${jsonHeaders}, response.headers);
    return response;
}`;
    const functionName = (0, import_naming.ensureNameMaxLength)(
      `${this.provider.stackName}-${this.provider.region}-${this.id}-response`,
      64
    );
    return new cloudfront.Function(this, "ResponseFunction", {
      functionName,
      code: cloudfront.FunctionCode.fromInline(code)
    });
  }
  getBucketProps() {
    return {
      // For a static website, the content is code that should be versioned elsewhere
      removalPolicy: import_aws_cdk_lib.RemovalPolicy.DESTROY
    };
  }
};
let StaticWebsiteAbstract = _StaticWebsiteAbstract;
StaticWebsiteAbstract.commands = {
  upload: {
    usage: "Upload files directly to S3 without going through a CloudFormation deployment.",
    handler: _StaticWebsiteAbstract.prototype.uploadWebsiteCommand
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  COMMON_STATIC_WEBSITE_DEFINITION,
  StaticWebsiteAbstract
});
//# sourceMappingURL=StaticWebsiteAbstract.js.map
