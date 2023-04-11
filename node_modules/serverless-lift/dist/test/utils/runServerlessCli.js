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
var runServerlessCli_exports = {};
__export(runServerlessCli_exports, {
  runServerlessCli: () => runServerlessCli
});
module.exports = __toCommonJS(runServerlessCli_exports);
var import_child_process = require("child_process");
var import_fs = require("fs");
var path = __toESM(require("path"));
async function runServerlessCli({ command, fixture }) {
  return new Promise((resolve, reject) => {
    const serverlessCmd = path.join(__dirname, "../../node_modules/.bin/serverless");
    const process = (0, import_child_process.spawn)(`${serverlessCmd} ${command}`, {
      shell: true,
      cwd: path.join(__dirname, "../fixtures", fixture)
    });
    let output = "";
    process.stdout.on("data", (data) => output += data);
    process.stderr.on("data", (data) => output += data);
    process.on("data", (data) => resolve(data));
    process.on("error", (err) => reject(new Error(`Exit code: ${err.message}
` + output)));
    process.on("close", (err) => {
      if (err === 0) {
        const json = (0, import_fs.readFileSync)(
          __dirname + "/../fixtures/variables/.serverless/cloudformation-template-update-stack.json"
        );
        resolve({
          stdoutData: output,
          cfTemplate: JSON.parse(json.toString())
        });
      } else {
        reject(new Error(`Exit code: ${err}
` + output));
      }
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  runServerlessCli
});
//# sourceMappingURL=runServerlessCli.js.map
