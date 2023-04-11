"use strict";
var import_runServerless = require("../utils/runServerless");
describe("storage", () => {
  let cfTemplate;
  let computeLogicalId;
  beforeAll(async () => {
    ({ cfTemplate, computeLogicalId } = await (0, import_runServerless.runServerless)({
      fixture: "storage",
      configExt: import_runServerless.pluginConfigExt,
      command: "package"
    }));
  });
  describe("common tests", () => {
    const useCases = [["default"], ["kmsEncryption"]];
    test.each(useCases)("%p - should configure a lifecycle policy", (useCase) => {
      expect(
        cfTemplate.Resources[computeLogicalId(useCase, "Bucket")].Properties.LifecycleConfiguration
      ).toMatchObject({
        Rules: [
          {
            Status: "Enabled",
            Transitions: [
              {
                StorageClass: "INTELLIGENT_TIERING",
                TransitionInDays: 0
              }
            ]
          },
          {
            NoncurrentVersionExpiration: {
              NoncurrentDays: 30
            },
            Status: "Enabled"
          }
        ]
      });
    });
    test.each(useCases)("%p - should have versionning enabled", (useCase) => {
      expect(
        cfTemplate.Resources[computeLogicalId(useCase, "Bucket")].Properties.VersioningConfiguration
      ).toStrictEqual({ Status: "Enabled" });
    });
  });
  test.each([
    ["default", "AES256"],
    ["kmsEncryption", "aws:kms"]
  ])("should allow %p encryption", (construct, expectedSSEAlgorithm) => {
    expect(cfTemplate.Resources[computeLogicalId(construct, "Bucket")].Properties).toMatchObject({
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: { SSEAlgorithm: expectedSSEAlgorithm }
          }
        ]
      }
    });
  });
  it("allows overriding bucket properties", () => {
    expect(cfTemplate.Resources[computeLogicalId("extendedBucket", "Bucket")].Properties).toMatchObject({
      ObjectLockEnabled: true
    });
  });
  it("allows overriding bucket properties with array", () => {
    expect(cfTemplate.Resources[computeLogicalId("extendedBucketWithArray", "Bucket")].Properties).toMatchObject({
      CorsConfiguration: {
        CorsRules: [
          {
            AllowedOrigins: ["*"],
            AllowedHeaders: ["*"],
            AllowedMethods: ["GET", "HEAD", "PUT", "POST"]
          }
        ]
      }
    });
  });
});
//# sourceMappingURL=storage.test.js.map
