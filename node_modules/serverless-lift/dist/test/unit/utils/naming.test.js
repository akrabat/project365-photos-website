"use strict";
var import_naming = require("../../../src/utils/naming");
describe("naming", () => {
  it("should not change names shorter than the limit", () => {
    expect((0, import_naming.ensureNameMaxLength)("foo", 3)).toEqual("foo");
  });
  it("should trim names with a unique suffix to stay under the limit", () => {
    expect((0, import_naming.ensureNameMaxLength)("foobarfoobarfoobarfoobar", 15)).toEqual("foobarfo-7ca709");
    expect((0, import_naming.ensureNameMaxLength)("foobarfoobarfoobarfoobar", 15)).toHaveLength(15);
    expect((0, import_naming.ensureNameMaxLength)("foobarfoofoofoofoofoofoo", 15)).not.toEqual("foobarfo-7ca709");
  });
});
//# sourceMappingURL=naming.test.js.map
