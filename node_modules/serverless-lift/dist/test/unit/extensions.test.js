"use strict";
var import_runServerless = require("../utils/runServerless");
describe("extensions", () => {
  it("should error if wrong extension key is used", async () => {
    await expect(() => {
      return (0, import_runServerless.runServerless)({
        fixture: "extensions",
        configExt: import_runServerless.pluginConfigExt,
        command: "package"
      });
    }).rejects.toThrowError(
      "There is no extension 'notExisting' available on this construct. Available extensions are: bucket."
    );
  });
});
//# sourceMappingURL=extensions.test.js.map
