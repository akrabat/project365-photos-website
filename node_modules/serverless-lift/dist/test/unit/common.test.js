"use strict";
var import_runServerless = require("../utils/runServerless");
describe("common", () => {
  it("should explicitly require a type for each construct", async () => {
    await expect(
      (0, import_runServerless.runServerless)({
        command: "package",
        config: Object.assign(import_runServerless.baseConfig, {
          constructs: {
            avatars: {}
          }
        })
      })
    ).rejects.toThrow(/The construct 'avatars' has no 'type' defined.*/g);
  });
  it("should not override user defined resources in serverless.yml", async () => {
    const { cfTemplate } = await (0, import_runServerless.runServerless)({
      fixture: "common",
      configExt: import_runServerless.pluginConfigExt,
      command: "package"
    });
    expect(cfTemplate.Resources).toMatchObject({
      UserDefinedResource: {}
    });
  });
  it("should validate construct configuration", async () => {
    await (0, import_runServerless.runServerless)({
      command: "package",
      config: Object.assign(import_runServerless.baseConfig, {
        constructs: {
          avatars: {
            type: "storage"
          }
        }
      })
    });
    await expect(
      (0, import_runServerless.runServerless)({
        command: "package",
        config: Object.assign(import_runServerless.baseConfig, {
          constructs: {
            avatars: {
              type: "storage",
              foo: "bar"
            }
          }
        })
      })
    ).rejects.toThrow(/Configuration error at 'constructs\.avatars'.*/g);
    await expect(
      (0, import_runServerless.runServerless)({
        command: "package",
        config: Object.assign(import_runServerless.baseConfig, {
          constructs: {
            avatars: {
              type: "storage",
              // "path" is a valid property in the `static-website` construct
              path: "."
            }
          }
        })
      })
    ).rejects.toThrow(/Configuration error at 'constructs\.avatars'.*/g);
  });
});
//# sourceMappingURL=common.test.js.map
