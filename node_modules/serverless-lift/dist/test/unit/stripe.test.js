"use strict";
var import_path = require("path");
var import_lodash = require("lodash");
var import_runServerless = require("../utils/runServerless");
describe("stripe", () => {
  describe("when an existing STRIPE_API_KEY env is set", () => {
    let serverless;
    beforeAll(async () => {
      ({ serverless } = await (0, import_runServerless.runServerless)({
        fixture: "stripe",
        configExt: import_runServerless.pluginConfigExt,
        command: "package",
        env: {
          STRIPE_API_KEY: "rk_test_key_from_env",
          XDG_CONFIG_HOME: (0, import_path.resolve)(process.cwd(), "test/fixtures/stripe/.config")
        }
      }));
    });
    test.each([
      ["stripeProviderWithProfile", "rk_test_key_from_toml_file"],
      ["stripeProviderWithoutProfile", "rk_test_key_from_env"]
    ])("should source the correct key for provider %p", (useCase, expectedApiKey) => {
      const stripeProvider = serverless.getLiftProviderById(useCase);
      const stripeApiKey = (0, import_lodash.get)(stripeProvider, "sdk._api.auth").slice(7);
      expect(stripeApiKey).toBe(expectedApiKey);
    });
  });
  it("should throw when no STRIPE_API_KEY env is set and one provider has no profile", async () => {
    await expect(
      (0, import_runServerless.runServerless)({
        fixture: "stripe",
        configExt: import_runServerless.pluginConfigExt,
        command: "package",
        env: {
          XDG_CONFIG_HOME: (0, import_path.resolve)(process.cwd(), "test/fixtures/stripe/.config")
        }
      })
    ).rejects.toThrow(/There is no default profile in your stripe configuration/);
  });
});
//# sourceMappingURL=stripe.test.js.map
